import React from "react";
import Navbar from "@/components/navigation/NavBar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchFacultyRole } from "@/lib/server-utils";
import "../../globals.css";

export const metadata = {
  title: "New UI | Milestone Monitor",
  description: "New UI for Milestone Monitor",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hodBool = true;
  let editorBool = true;
  let userData;

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  } else {
    //only hods and editors can access reports
    userData = await fetchFacultyRole(user.email as string);

    //conditions to check if the user is an hod, editor or regular faculty
    if (userData.faculty_role != "hod") {
      hodBool = false;
    }
    if (userData.faculty_role != "editor") {
      editorBool = false;
    }
  }

  return (
    <>
      <Navbar is_editor={editorBool} is_hod={hodBool} userData={userData} />
      <main>
        {children}
      </main>
    </>
  );
}
