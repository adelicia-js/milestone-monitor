import React from "react";
import { Urbanist } from "next/font/google";

const tableFont = Urbanist({ weight: "400", subsets: ["latin"] });

interface AddNewSecProps {
  name: string;
  children: React.ReactNode;
}

export default function AddNewSec(props: AddNewSecProps) {
  return (
      <section
        id="add-new-section"
        className={`${tableFont.className} lg:h-[20rem] tracking-wide bg-[#cbfef8] m-3 p-5 sm:rounded flex flex-col items-center justify-center`}
      >
        <p className="text-teal-800 text-2xl">Add a new {props.name}</p>
        <div className="text-teal-800 flex w-28 h-28 justify-center content-center">
        {props.children}
        </div>
      </section>
  );
}
