import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverPatentApi, serverFacultyApi } from "@/lib/api/server-apis";
import { Metadata } from "next";
import PatentsClient from "./PatentsClient";

export const metadata: Metadata = {
  title: 'Patents | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const PatentsNewPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const patentResult = await serverPatentApi.getPatentsByEmail(user.email as string);
  const facultyResult = await serverFacultyApi.getFacultyByEmail(user.email as string);

  const tableData = patentResult.data || [];
  const facultyData = facultyResult.data;

  if (!facultyData) {
    redirect("/login");
  }

  return <PatentsClient data={tableData} facultyData={facultyData} />;
};

export default PatentsNewPage;