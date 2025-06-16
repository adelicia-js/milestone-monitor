import React from "react";
import { Urbanist, Inter } from "next/font/google";
import NoData from "@/components/reports/NoData";
import { DisplayData } from "@/lib/hooks/useReport";
import { Faculty } from "@/lib/types";

interface TableProps {
  tableData: DisplayData[];
  staffDetails: Faculty[] | null;
}

const headerFont = Urbanist({ weight: "400", subsets: ["latin"] });

const tableFont = Inter({ weight: "400", subsets: ["latin"] });

const GeneralTable = (props: TableProps) => {
  return (
    <div className="h-[80vh] overflow-y-auto mb-4 border border-transparent border-r-teal-700/50">
      {props.tableData.length == 0 ? (
        <NoData
          columns={[
            "Faculty ID",
            "Faculty Name",
            "Entry Type",
            "Date",
            "Title",
            "Verification Status",
          ]}
        />
      ) : (
        <DisplayTable
          tableData={props.tableData}
          staffDetails={props.staffDetails}
        />
      )}
    </div>
  );
};

const DisplayTable = (props: TableProps) => {
  if (!props.staffDetails) {
    return null;
  }

  const getfacultyname = (id: string) => {
    const faculty = props.staffDetails?.find(
      (f: Faculty) => f.faculty_id == id
    );
    return faculty ? faculty.faculty_name : "";
  };

  return (
    <section id="table-section" className="m-3 p-5 sm:rounded min-h-[25rem]">
      <div className="overflow-x-auto shadow-md shadow-teal-800/10 sm:rounded-lg border border-teal-500/30">
        <table
          className={`${headerFont.className} text-teal-800 w-full text-sm text-center`}
        >
          <thead className="text-lg text-center uppercase tracking-wide bg-teal-400/50">
            <tr>
              <th className="py-2 px-2 whitespace-nowrap border border-teal-500/30">
                Faculty ID
              </th>
              <th className="py-2 px-2 whitespace-nowrap border border-teal-500/30">
                Faculty Name
              </th>
              <th className="py-2 px-2 whitespace-nowrap border border-teal-500/30">
                Entry Type
              </th>
              <th className="py-2 border border-teal-500/30">Date</th>
              <th className="py-2 border border-teal-500/30">Title</th>
              <th className="py-2 px-4 whitespace-nowrap border border-teal-500/30">
                Status
              </th>
            </tr>
          </thead>
          <tbody className={`${tableFont.className} text-teal-700`}>
            {props.tableData.map((item: DisplayData, index: number) => {
              return (
                <tr key={index}>
                  <td className="py-2 px-4 border border-teal-500/30">
                    {item.faculty_id}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border border-teal-500/30">
                    {getfacultyname(item.faculty_id)}
                  </td>
                  <td className="py-2 px-4 border border-teal-500/30">
                    {item.entry_type}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border border-teal-500/30">
                    {item.date}
                  </td>
                  <td className="py-2 px-4 border border-teal-500/30">
                    {item.title}
                  </td>
                  <td className="py-2 px-4 border border-teal-500/30">
                    {item.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default GeneralTable;
