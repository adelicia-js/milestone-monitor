import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { approvalApi, facultyApi } from "@/lib/api";
import { Metadata } from "next";
import ApprovalsClient from "./ApprovalsClient";
import {
  PendingConference,
  PendingJournal,
  PendingWorkshop,
  PendingPatent,
} from "@/app/(modify)/modify/approvals/types";

export const metadata: Metadata = {
  title: 'Approvals | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const ApprovalsNewPage = async () => {
  const supabase = createServerComponentClient({ cookies });
  let userData;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  } else {
    const facultyResult = await facultyApi.getFacultyByEmail(user.email as string);
    userData = facultyResult.data;
    
    if (!userData || userData.faculty_role !== "hod") {
      redirect("/404");
    }
  }

  // Get all pending entries using the new API
  const pendingResult = await approvalApi.getAllPendingEntries();
  
  if (pendingResult.error) {
    console.error('Error fetching pending entries:', pendingResult.error);
  }

  const pending_objects = pendingResult.data || {
    pending_conferences: [] as PendingConference[],
    pending_journal: [] as PendingJournal[],
    pending_workshop: [] as PendingWorkshop[],
    pending_patent: [] as PendingPatent[],
  };

  return <ApprovalsClient pending_data={pending_objects} userData={userData} />;
};

export default ApprovalsNewPage;