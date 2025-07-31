import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { conferenceApi, facultyApi } from "@/lib/api";
import { Metadata } from "next";
import ConferencesClient from "./ConferencesClient";

export const metadata: Metadata = {
  title: 'Conferences | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const ConferencesNewPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conferenceResult = await conferenceApi.getConferencesByEmail(user.email as string);
  const facultyResult = await facultyApi.getFacultyByEmail(user.email as string);

  const tableData = conferenceResult.data || [];
  const facultyData = facultyResult.data;

  return <ConferencesClient data={tableData} facultyData={facultyData} />;
};

export default ConferencesNewPage;