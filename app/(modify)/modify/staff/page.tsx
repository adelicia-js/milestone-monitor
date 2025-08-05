import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFacultyApi } from "@/lib/api/server-apis";
import { Metadata } from "next";
import StaffManagementClient from "./StaffManagementClient";

export const metadata: Metadata = {
  title: 'Staff Management | Milestone Monitor',
}

export const dynamic = "force-dynamic";

const StaffManagementPage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const facultyResult = await serverFacultyApi.getFacultyByEmail(user.email as string);
  const userData = facultyResult.data;
  
  if (!userData || userData.faculty_role !== "hod") {
    redirect("/404");
  }

  // Get all staff from the same department using the new API
  const staffResult = await serverFacultyApi.getStaffByDepartment(userData.faculty_department);
  const staffList = staffResult.data || [];

  return (
    <StaffManagementClient 
      initialStaffList={staffList} 
      currentUserDept={userData.faculty_department}
      userData={userData}
    />
  );
};

export default StaffManagementPage;