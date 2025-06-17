import React from "react";
import HeaderBar from "./HeaderBar";
import VerticalBar from "./VerticalBar";

interface NavbarProps {
  userData: {
    faculty_name: string;
    faculty_department: string;
    faculty_id: string;
  };
  is_hod: boolean;
  is_editor: boolean;
}
export default function Navbar(props: NavbarProps) {
  return (
    <header>
      <HeaderBar />
      <VerticalBar is_hod={props.is_hod} is_editor={props.is_editor} />
    </header>
  );
}
