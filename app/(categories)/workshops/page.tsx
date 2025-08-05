import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverWorkshopApi, serverFacultyApi } from "@/lib/api/server-apis";
import { Metadata } from "next";
import WorkshopsClient from "./WorkshopsClient";

export const metadata: Metadata = {
  title: 'Workshops | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const WorkshopsNewPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workshopResult = await serverWorkshopApi.getWorkshopsByEmail(user.email as string);
  const facultyResult = await serverFacultyApi.getFacultyByEmail(user.email as string);

  const tableData = workshopResult.data || [];
  const facultyData = facultyResult.data;

  if (!facultyData) {
    redirect("/login");
  }

  return <WorkshopsClient data={tableData} facultyData={facultyData} />;
};

export default WorkshopsNewPage;