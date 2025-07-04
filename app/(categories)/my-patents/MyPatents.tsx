"use client";

import React, { useState } from "react";
import { Urbanist, Inter } from "next/font/google";
import {
  updatePatents,
  addPatent,
  uploadPatentMedia,
} from "@/app/api/dbfunctions";
import CategoryHeader from "@/components/categories/CategoryHeader";
import AddNewSec from "@/components/categories/AddNewSec";
import NoData from "@/components/categories/NoData";
import { Button, Label, Modal, TextInput } from "flowbite-react";

const tableFont = Urbanist({ weight: "400", subsets: ["latin"] });
const tableBodyFont = Inter({ weight: "400", subsets: ["latin"] });

export const MyPatents = (props: any) => {
  const columns = [
    "Patent Name",
    "Patent Type",
    "Application Number",
    "Status",
    "Approval",
    "",
  ];

  return (
    <section>
      {/* Navigation Bar One */}
      <CategoryHeader name="My Patents" />

      {/* Table of existing patents, along with an edit button for each entry */}
      <section className="grid grid-rows-2 lg:h-[80vh] gap-24">
        <section
          id="table-section"
          className="bg-[#cbfef8] m-3 mt-0 p-5 sm:rounded h-[45vh]"
        >
          {props.data.length == 0 ? (
            <NoData columns={columns} />
          ) : (
            <PatentTable data={props.data} columns={columns} />
          )}
        </section>

        {/* Button to add a new patent */}
        <AddNewSec name="Patent">
          <AddPatentModal facultyData={props.facultyData} />
        </AddNewSec>
      </section>
    </section>
  );
};

const PatentTable = (props: any) => {
  return (
    <div className="overflow-x-auto shadow-md shadow-teal-800/50 sm:rounded">
      <table className={`${tableFont.className} w-full text-sm text-left`}>
        <thead className="text-lg text-teal-800 uppercase bg-teal-400/50 tracking-wider border border-transparent rounded">
          <tr>
            {props.columns.map((items: any, index: any) => {
              return (
                <th
                  scope="col"
                  className="px-6 py-3 whitespace-nowrap"
                  key={index}
                >
                  {items}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item: any, index: any) => {
            return (
              <tr
                className={`${tableBodyFont.className} tracking-normal bg-teal-50/50 text-teal-900`}
                key={index}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {item.patent_name}
                </th>
                <td className="px-6 py-4">{item.patent_type}</td>
                <td className="px-6 py-4">{item.application_no}</td>
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4">{item.is_verified}</td>
                <td className="px-6 py-4">
                  <FormElements data={item} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AddPatentModal = ({ facultyData }: { facultyData: any }) => {
  const [openModal, setOpenModal] = useState<string | undefined>();
  const propsModal = { openModal, setOpenModal };
  const [facultyID, setFacultyID] = useState(facultyData.faculty_id);
  const [patentName, setPatentName] = useState("");
  const [patentDate, setPatentDate] = useState("");
  const [patentType, setPatentType] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [status, setStatus] = useState("");
  const [patentLink, setPatentLink] = useState("");
  const [image, setImage] = useState("");

  const handleAddPatents = async () => {
    await addPatent(
      facultyID,
      patentName,
      patentDate,
      patentType,
      applicationNo,
      status,
      patentLink,
      image
    );
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = Array.from(e.currentTarget.files ?? []);
    console.log(files);
    if (files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log("files are ", formData.get("file"));
      uploadPatentMedia(facultyID, formData, patentDate);
    }
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-28 h-28 cursor-pointer hover:w-[6.8rem] hover:h-[6.8rem]"
        onClick={() => propsModal.setOpenModal("form-elements")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <Modal
        show={propsModal.openModal === "form-elements"}
        size="xl"
        popup
        onClose={() => propsModal.setOpenModal(undefined)}
        className={`${tableFont.className}`}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
              Add new patent
            </h3>

            <div>
              <div className="mb-2 block">
                <Label value="Faculty ID" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setFacultyID(e.target.value)}
                value={facultyID}
                required
                readOnly
                disabled
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Patent Name" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentName(e.target.value)}
                value={patentName}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Patent Date" />
              </div>
              <TextInput
                type="date"
                onChange={(e) => setPatentDate(e.target.value)}
                value={patentDate}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Patent Type" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentType(e.target.value)}
                value={patentType}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Application Number" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setApplicationNo(e.target.value)}
                value={applicationNo}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Status" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Patent Link" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentLink(e.target.value)}
                value={patentLink}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label value="Patent Image" />
              </div>
              <TextInput
                type="file"
                onChange={handleFileChange}
                id="file"
                name="file"
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleAddPatents}>Add Patent</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const FormElements = (props: any) => {
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [patentName, setPatentName] = useState(props.data.patent_name);
  const [patentType, setPatentType] = useState(props.data.patent_type);
  const [applicationNo, setApplicationNo] = useState(props.data.application_no);
  const [status, setStatus] = useState(props.data.status);
  const [patentLink, setPatentLink] = useState(props.data.patent_link);
  const [patentDate, setPatentDate] = useState(props.data.patent_date);
  const propsModal = { openModal, setOpenModal };

  const handlePatentUpdate = async () => {
    await updatePatents(
      patentName,
      patentDate,
      patentType,
      applicationNo,
      status,
      patentLink,
      props.data.is_verified,
      props.data.id
    );
    window.location.reload();
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
        onClick={() => propsModal.setOpenModal("form-elements")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
      <Modal
        show={propsModal.openModal === "form-elements"}
        size="xl"
        popup
        onClose={() => propsModal.setOpenModal(undefined)}
        className={`${tableFont.className}`}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
              Edit submission
            </h3>
            <div>
              <div className="mb-2 block">
                <Label value="Patent Name" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentName(e.target.value)}
                value={patentName}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Patent Type" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentType(e.target.value)}
                value={patentType}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Application Number" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setApplicationNo(e.target.value)}
                value={applicationNo}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Status" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Patent Link" />
              </div>
              <TextInput
                type="text"
                onChange={(e) => setPatentLink(e.target.value)}
                value={patentLink}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Patent Date" />
              </div>
              <TextInput
                type="date"
                onChange={(e) => setPatentDate(e.target.value)}
                value={patentDate}
                required
              />
            </div>
            <div className="flex justify-center">
              <Button onClick={handlePatentUpdate}>Update</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
