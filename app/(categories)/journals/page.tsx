import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { journalApi, facultyApi } from "@/lib/api";
import { Metadata } from "next";
import JournalsClient from "./JournalsClient";

export const metadata: Metadata = {
  title: 'Journals | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const JournalsNewPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const journalResult = await journalApi.getJournalsByEmail(user.email as string);
  const facultyResult = await facultyApi.getFacultyByEmail(user.email as string);

  const tableData = journalResult.data || [];
  const facultyData = facultyResult.data;

  return <JournalsClient data={tableData} facultyData={facultyData} />;
};

export default JournalsNewPage;