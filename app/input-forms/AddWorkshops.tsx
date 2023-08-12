import React, { useState } from "react";
import InputCard from "./InputCard";
const AddWorkshops = () => {
  const [facultyID, setFacultyID] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [noDays, setNoDays] = useState("");
  const [organisedBy, setOrganisedBy] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="">
      <form>
        <div className="grid gap-6 mb-6 ">
          <InputCard
            input_name="Faculty ID"
            input_type="text"
            input_value={facultyID}
            set_input={setFacultyID}
          />
          <InputCard
            input_name="Patent name"
            input_type="text"
            input_value={date}
            set_input={setDate}
          />
          <InputCard
            input_name="Patent Type"
            input_type="text"
            input_value={type}
            set_input={setType}
          />
          <InputCard
            input_name="Application number"
            input_type="date"
            input_value={title}
            set_input={setTitle}
          />
          <InputCard
            input_name="Status"
            input_type="text"
            input_value={noDays}
            set_input={setNoDays}
          />
          <InputCard
            input_name="Published as proceedings"
            input_type="checkbox"
            input_value={organisedBy}
            set_input={setOrganisedBy}
          />

          <input type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddWorkshops;
