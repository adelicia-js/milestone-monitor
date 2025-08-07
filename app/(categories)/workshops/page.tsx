import React from "react";
import { createServerClient } from "@supabase/ssr";
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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

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