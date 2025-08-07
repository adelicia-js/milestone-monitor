"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { X, Save, Upload } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface FormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "file" | "number";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface CategoryModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, string | number | boolean | null | undefined>;
  isLoading?: boolean;
}

export default function CategoryModal<T>({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  isLoading = false,
}: CategoryModalProps<T>) {
  const [formData, setFormData] = useState(initialData);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [dateErrors, setDateErrors] = useState<{ [key: string]: string }>({});

  // Update formData when initialData changes (for editing)
  useEffect(() => {
    setFormData(initialData);
    setDateErrors({});
  }, [initialData]);

  // Validate date field
  const validateDate = (key: string, value: string, field: FormField) => {
    if (field.type !== 'date' || !value) {
      setDateErrors((prev) => ({ ...prev, [key]: '' }));
      return true;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today for comparison
    
    // Check if date is in the future (not allowed for most academic records)
    if (selectedDate > today) {
      setDateErrors((prev) => ({ 
        ...prev, 
        [key]: `${field.label} cannot be in the future` 
      }));
      return false;
    }
    
    // Check if date is too far in the past (reasonable validation)
    const minDate = new Date('1900-01-01');
    if (selectedDate < minDate) {
      setDateErrors((prev) => ({ 
        ...prev, 
        [key]: `${field.label} cannot be before 1900` 
      }));
      return false;
    }

    setDateErrors((prev) => ({ ...prev, [key]: '' }));
    return true;
  };

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    
    // Validate date fields
    const field = fields.find(f => f.key === key);
    if (field && field.type === 'date' && typeof value === 'string') {
      validateDate(key, value, field);
    }
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any date validation errors
    const hasDateErrors = Object.values(dateErrors).some(error => error !== '');
    if (hasDateErrors) {
      return; // Don't submit if there are validation errors
    }
    
    onSubmit({ ...formData, files } as T);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {fields.map((field) => (
              <FormGroup key={field.key}>
                <Label>
                  {field.label}
                  {field.required && <Required>*</Required>}
                </Label>

                {field.type === "textarea" ? (
                  <TextArea
                    value={String(
                      formData[field.key as keyof typeof formData] || ""
                    )}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={(() => {
                      const fieldValue = formData[field.key as keyof typeof formData];
                      if (fieldValue === null || fieldValue === undefined) return "";
                      // Handle boolean values properly for select fields
                      if (typeof fieldValue === "boolean") return String(fieldValue);
                      return String(fieldValue);
                    })()}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : field.type === "file" ? (
                  <FileInputWrapper>
                    <FileInput
                      type="file"
                      id={field.key}
                      onChange={(e) =>
                        handleFileChange(field.key, e.target.files?.[0] || null)
                      }
                      required={field.required}
                    />
                    <FileInputLabel htmlFor={field.key}>
                      <Upload size={16} />
                      {files[field.key]
                        ? files[field.key]?.name
                        : `Choose ${field.label}`}
                    </FileInputLabel>
                  </FileInputWrapper>
                ) : (
                  <Input
                    type={field.type}
                    value={String(
                      formData[field.key as keyof typeof formData] || ""
                    )}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    max={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                  />
                )}
                {field.type === 'date' && dateErrors[field.key] && (
                  <DateError>{dateErrors[field.key]}</DateError>
                )}
              </FormGroup>
            ))}
          </FormGrid>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton 
              type="submit" 
              disabled={isLoading || Object.values(dateErrors).some(error => error !== '')}
            >
              <Save size={16} />
              {isLoading ? "Saving..." : "Save"}
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

  /* Custom scrollbar styling - properly aligned inside modal */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 131, 143, 0.1);
    border-radius: 3px;
    margin: 8px; /* Add margin to keep scrollbar inside the modal border */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 131, 143, 0.25);
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 131, 143, 0.4);
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 131, 143, 0.25) rgba(0, 131, 143, 0.1);
  scroll-behavior: smooth;
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
  
  @media (max-width: 1024px) {
    font-size: 1.15rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
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
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
  
  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
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
  }

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
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
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px dashed rgba(56, 68, 68, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(4, 103, 112, 0.5);
    background: rgba(255, 255, 255, 0.8);
    color: rgba(4, 103, 112, 0.8);
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
  background: linear-gradient(
    135deg,
    rgba(4, 103, 112, 0.9),
    rgba(6, 95, 70, 0.9)
  );
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      rgba(4, 103, 112, 1),
      rgba(6, 95, 70, 1)
    );
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DateError = styled.div`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.75rem;
  color: rgba(239, 68, 68, 0.9);
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(254, 242, 242, 0.8);
  border: 1px solid rgba(252, 165, 165, 0.4);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "⚠️";
    font-size: 0.75rem;
  }
`;
