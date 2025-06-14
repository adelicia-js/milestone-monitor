import React from "react";
import { Urbanist } from "next/font/google";

const headerFont = Urbanist({weight: "400", subsets: ['latin'], });

interface NoDataProps {
  columns: string[];
}

export default function NoData(props: NoDataProps) {
    return(
      <div className="">
        <table className={`${headerFont.className} m-4 p-5 w-full text-sm text-center text-black border border-teal-500/30 rounded`}>
                <thead className="text-lg text-teal-800 uppercase bg-teal-400/50">
                  <tr>
                  {props.columns.map((items:string, index:number)=>{
                    return(
                      <th scope="col" className="whitespace-nowrap p-4 border border-teal-500/30" key={`${index}-${items}`}>
                            {items  }
                        </th>
                    );
                  })}
                    </tr>
                </thead>
        </table>
        <div className={`${headerFont.className} min-h-full w-full text-center text-3xl p-28 uppercase text-teal-800`}>No entries found</div>  
      </div>
    )
  }