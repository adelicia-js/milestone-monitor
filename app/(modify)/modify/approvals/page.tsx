import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverApprovalApi, serverFacultyApi } from "@/lib/api/server-apis";
import { Metadata } from "next";
import ApprovalsClient from "./ApprovalsClient";
import { Conference, Journal, Workshop, Patent } from "@/lib/types";

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
    const facultyResult = await serverFacultyApi.getFacultyByEmail(user.email as string);
    userData = facultyResult.data;
    
    if (!userData || userData.faculty_role !== "hod") {
      redirect("/404");
    }
  }

  // Get pending entries filtered by HOD's department
  const pendingResult = await serverApprovalApi.getPendingEntriesByDepartment(userData.faculty_department);
  
  if (pendingResult.error) {
    console.error('Error fetching pending entries:', pendingResult.error);
  }

  const pending_objects = pendingResult.data || {
    pending_conferences: [] as Conference[],
    pending_journal: [] as Journal[],
    pending_workshop: [] as Workshop[],
    pending_patent: [] as Patent[],
  };

  return <ApprovalsClient pending_data={pending_objects} userData={userData} />;
};

export default ApprovalsNewPage;