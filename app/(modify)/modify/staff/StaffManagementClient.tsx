"use client";

import React, { useState } from "react";
import StaffManagementWrapper from "@/components/staff/StaffManagementWrapper";
import { Faculty } from "@/lib/types";
import { facultyApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface StaffManagementClientProps {
  initialStaffList: Faculty[];
  currentUserDept: string;
  userData: any;
}

export default function StaffManagementClient({
  initialStaffList,
  currentUserDept,
  userData
}: StaffManagementClientProps) {
  const [staffList, setStaffList] = useState<Faculty[]>(initialStaffList);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshStaffList = async () => {
    try {
      const result = await facultyApi.getStaffByDepartment(currentUserDept);
      if (result.data) {
        setStaffList(result.data);
      }
    } catch (err) {
      console.error('Error refreshing staff list:', err);
    }
  };

  const handleAddStaff = async (staffData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyApi.addStaff({
        faculty_name: staffData.faculty_name,
        faculty_id: staffData.faculty_id,
        faculty_department: staffData.faculty_department,
        faculty_role: staffData.faculty_role,
        faculty_phone: staffData.faculty_phone || null,
        faculty_email: staffData.faculty_email,
        password: staffData.password
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh the staff list to show the new member
      await refreshStaffList();
    } catch (err) {
      console.error('Error adding staff:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add staff member. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = async (staffData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updates = {
        faculty_name: staffData.faculty_name,
        faculty_id: staffData.faculty_id,
        faculty_department: staffData.faculty_department,
        faculty_role: staffData.faculty_role,
        faculty_phone: staffData.faculty_phone || null
      };
      
      const result = await facultyApi.updateStaff(staffData.faculty_email, updates);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh the staff list to show the updated details
      await refreshStaffList();
    } catch (err) {
      console.error('Error editing staff:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit staff member. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyApi.deleteStaff(staffEmail);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh the staff list to remove the deleted member
      await refreshStaffList();
    } catch (err) {
      console.error('Error deleting staff:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete staff member. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffManagementWrapper
      staffList={staffList}
      currentUserDept={currentUserDept}
      onAddStaff={handleAddStaff}
      onEditStaff={handleEditStaff}
      onDeleteStaff={handleDeleteStaff}
      loading={loading}
      error={error}
    />
  );
}