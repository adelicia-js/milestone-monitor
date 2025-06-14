import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";
import Account from "@/components/dashboard/Account";
import Events from "@/components/dashboard/Events";
import { redirect } from "next/navigation";
import { fetchRole } from "../api/dbfunctions";
import Stats  from "@/components/dashboard/Stats";

const bodyText = Montserrat({
  weight: "400",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

// Function to find the first available profile image with supported extensions
async function findProfileImage(supabase: any, facultyId: string) {
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
  
  for (const ext of extensions) {
    try {
      const { data: imgData } = supabase.storage
        .from('staff-media')
        .getPublicUrl(`profilePictures/${facultyId}.${ext}`);
      
      // Check if the image actually exists by making a HEAD request
      const response = await fetch(imgData.publicUrl, { method: 'HEAD' });
      if (response.ok) {
        return imgData.publicUrl;
      }
    } catch (error) {
      // Continue to next extension if this one fails
      continue;
    }
  }
  
  return null; // No image found
}

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });
  let hodBool =true
  let editorBool = true;
  let userData, profileImageUrl;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }else{
    userData = await fetchRole(user.email as string);
    if(userData.faculty_role!="hod"){
      hodBool = false;
      
    }
    if(userData.faculty_role!="editor"){
      editorBool = false;
    }

    profileImageUrl = await findProfileImage(supabase, userData.faculty_id);
  }

  return (
    <section
      id="dashboard"
      className={`invisible lg:visible ${bodyText.className} grid grid-cols-2 grid-rows-2 gap-8 md:h-[85vh] lg:h-[90vh] bg-teal-500/40 lg:p-8`}
    >
      <Account userData={userData} profileImageUrl={profileImageUrl}/>
      <Stats/>
     
 <Events is_hod={hodBool} is_editor={editorBool}/>
    </section>
  );
}
