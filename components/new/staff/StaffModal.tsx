"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { X, Save, User, Mail, Phone, Building, Shield, Key } from "lucide-react";
import { Faculty } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants/departments";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  mode: 'add' | 'edit';
  initialData?: Faculty | null;
  defaultDepartment: string;
  isLoading?: boolean;
}

export default function StaffModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  defaultDepartment,
  isLoading = false
}: StaffModalProps) {
  const [formData, setFormData] = useState({
    faculty_id: '',
    faculty_name: '',
    faculty_email: '',
    faculty_phone: '',
    faculty_department: defaultDepartment,
    faculty_role: 'faculty',
    password: ''
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        faculty_id: initialData.faculty_id || '',
        faculty_name: initialData.faculty_name || '',
        faculty_email: initialData.faculty_email || '',
        faculty_phone: initialData.faculty_phone || '',
        faculty_department: initialData.faculty_department || defaultDepartment,
        faculty_role: initialData.faculty_role || 'faculty',
        password: '' // Don't populate password for security
      });
    } else {
      setFormData({
        faculty_id: '',
        faculty_name: '',
        faculty_email: '',
        faculty_phone: '',
        faculty_department: defaultDepartment,
        faculty_role: 'faculty',
        password: ''
      });
    }
  }, [mode, initialData, defaultDepartment, isOpen]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {mode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>
                <User size={16} />
                Faculty ID
                <Required>*</Required>
              </Label>
              <Input
                type="text"
                value={formData.faculty_id}
                onChange={(e) => handleInputChange('faculty_id', e.target.value)}
                placeholder="Enter faculty ID"
                required
                disabled={mode === 'edit'} // Don't allow editing ID
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <User size={16} />
                Full Name
                <Required>*</Required>
              </Label>
              <Input
                type="text"
                value={formData.faculty_name}
                onChange={(e) => handleInputChange('faculty_name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Mail size={16} />
                Email Address
                <Required>*</Required>
              </Label>
              <Input
                type="email"
                value={formData.faculty_email}
                onChange={(e) => handleInputChange('faculty_email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Phone size={16} />
                Phone Number
              </Label>
              <Input
                type="tel"
                value={formData.faculty_phone}
                onChange={(e) => handleInputChange('faculty_phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Building size={16} />
                Department
                <Required>*</Required>
              </Label>
              <Select
                value={formData.faculty_department}
                onChange={(e) => handleInputChange('faculty_department', e.target.value)}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Shield size={16} />
                Role
                <Required>*</Required>
              </Label>
              <Select
                value={formData.faculty_role}
                onChange={(e) => handleInputChange('faculty_role', e.target.value)}
                required
              >
                <option value="faculty">Faculty</option>
                <option value="editor">Editor</option>
                <option value="hod">HOD</option>
              </Select>
            </FormGroup>

            {(mode === 'add' || formData.password) && (
              <FormGroup>
                <Label>
                  <Key size={16} />
                  {mode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password'}
                  {mode === 'add' && <Required>*</Required>}
                </Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={mode === 'edit' ? "Leave blank to keep current password" : "Enter password"}
                  required={mode === 'add'}
                  minLength={6}
                />
              </FormGroup>
            )}
          </FormGrid>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              <Save size={16} />
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Staff' : 'Add Staff'}
            </SubmitButton>
          </ModalFooter>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(244, 253, 252, 0.95);
  backdrop-filter: blur(10px);
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const ModalTitle = styled.h2`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: rgba(239, 68, 68, 1);
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:last-child {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
`;

const Required = styled.span`
  color: rgba(239, 68, 68, 0.8);
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &:disabled {
    background: rgba(249, 250, 251, 0.8);
    color: rgba(107, 114, 128, 0.8);
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  option {
    background: rgba(255, 255, 255, 0.95);
    color: rgba(31, 41, 55, 0.9);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(56, 68, 68, 0.1);
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(107, 114, 128, 0.1);
    border-color: rgba(107, 114, 128, 0.5);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;