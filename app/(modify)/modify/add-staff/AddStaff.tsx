"use client";

import React from "react";
import { addStaff } from "@/app/api/dbfunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Poppins } from "next/font/google";
import LogoutButton from "@/components/LogoutButton";

const bodyText = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const AddStaff = () => {
  const router = useRouter();
  const [facultyID, setFacultyID] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [dept, setDept] = useState("Computer Science");
  const [role, setRole] = useState("");
  const [phno, setPhno] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addStaff(facultyName, facultyID, dept, role, phno, email, pwd);
    router.push("/");
  };
  return (
    <div className="h-screen bg-[#3b9b9b] flex justify-center items-center">
      <div className="flex justify-center items-center bg-[#c2fafa] py-5 px-96 rounded-3xl">
        <form
          className={`flex flex-col ${bodyText.className} text-lg`}
          onSubmit={handleSubmit}
        >
          <label className="mb-1">Faculty ID</label>
          <input
            type="text"
            required
            value={facultyID}
            onChange={(e) => setFacultyID(e.target.value)}
            className="mb-5 rounded p-1"
          />
          <label className="mb-1">Name</label>
          <input
            type="text"
            required
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            className="mb-5 rounded p-1"
          />
          <label className="mb-1">Department</label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="mb-5 rounded p-1 bg-white"
          >
            <option value="Computer Science" selected>
              Computer Science
            </option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Botany">Botany</option>
            {/* .....lets add more if needed later  */}
          </select>
          <label className="mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-5 rounded p-1 bg-white"
          >
            <option value="hod">Head of the Department</option>
            <option value="staff">Staff</option>
            <option value="editor">Editor</option>
          </select>
          <label className="mb-1">Phone Number</label>
          <input
            type="text"
            required
            value={phno}
            onChange={(e) => setPhno(e.target.value)}
            className="mb-5 rounded p-1"
          />
          <label className="mb-1">University Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 rounded p-1"
          />
          <label className="mb-1">Password for user</label>
          <input
            type="text"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="mb-5 rounded p-1"
          />
          <button
            type="submit"
            className="bg-[#3b9b9b] hover:bg-[#338585] text-white p-3 rounded-lg"
          >
            Create Staff Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
