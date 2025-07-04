import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Urbanist } from "next/font/google";
import Settings from "@/components/settings/Settings";
import { Metadata } from "next";

const bodyText = Urbanist({
  weight: "400",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'User Settings | Milestone Monitor',
}

const page = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }
  return (
    <section>
      <section id="small-settings-wrapper" className="lg:hidden text-center">
        <h1 className="break-words">
          Please view this page on a laptop/desktop view.
        </h1>
      </section>
      <section
        id="settings-wrapper"
        className={`invisible lg:visible lg:p-4 ${bodyText.className} grid grid-cols-4 justify-center items-center lg:h-[90vh] bg-teal-500/40`}
      >
        <Settings openModal={undefined} setOpenModal={() => {}} />
      </section>
    </section>
  );
};

export default page;
