import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverJournalApi, serverFacultyApi } from "@/lib/api/server-apis";
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

  const journalResult = await serverJournalApi.getJournalsByEmail(user.email as string);
  const facultyResult = await serverFacultyApi.getFacultyByEmail(user.email as string);

  const tableData = journalResult.data || [];
  const facultyData = facultyResult.data;

  if (!facultyData) {
    redirect("/login");
  }

  return <JournalsClient data={tableData} facultyData={facultyData} />;
};

export default JournalsNewPage;