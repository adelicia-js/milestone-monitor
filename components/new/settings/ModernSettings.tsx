"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {
  fetchRole,
  updateStaffGoogleScholar,
  updateStaffLinkedInURL,
  updateStaffName,
  updateStaffPW,
  updateStaffPhoneNumber,
  uploadProfilePicture,
} from "@/app/api/dbfunctions";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import { 
  Settings as SettingsIcon, 
  Edit, 
  Save, 
  User, 
  Phone, 
  Link, 
  GraduationCap,
  Camera,
  Lock,
  Upload
} from "lucide-react";
import PasswordModal from "./PasswordModal";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface SettingsState {
  name: string;
  phone_number: string;
  linkedIn_url: string;
  google_scholar: string;
}

export default function ModernSettings() {
  const [user, setUser] = useState<any>(null);
  const [facultyId, setFacultyId] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(true);
  
  const [settings, setSettings] = useState<SettingsState>({
    name: "",
    phone_number: "",
    linkedIn_url: "",
    google_scholar: "",
  });

  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({
    name: false,
    phone_number: false,
    linkedIn_url: false,
    google_scholar: false,
  });

  useEffect(() => {
    fetchRole("dummy").then((data) => {
      setUser(data);
      setSettings({
        name: data?.faculty_name || "",
        phone_number: data?.faculty_phone || "",
        linkedIn_url: data?.faculty_linkedin || "",
        google_scholar: data?.faculty_google_scholar || "",
      });
      setFacultyId(data?.faculty_id || "");
    });
  }, []);

  // Auto-save when settings change
  useEffect(() => {
    if (settings.name && typeof settings.name === 'string' && settings.name.trim() !== "") {
      updateStaffName(settings.name);
    }
  }, [settings.name]);

  useEffect(() => {
    if (settings.phone_number && typeof settings.phone_number === 'string' && settings.phone_number.trim() !== "") {
      updateStaffPhoneNumber(settings.phone_number);
    }
  }, [settings.phone_number]);

  useEffect(() => {
    if (settings.linkedIn_url && typeof settings.linkedIn_url === 'string' && settings.linkedIn_url.trim() !== "") {
      updateStaffLinkedInURL(settings.linkedIn_url);
    }
  }, [settings.linkedIn_url]);

  useEffect(() => {
    if (settings.google_scholar && typeof settings.google_scholar === 'string' && settings.google_scholar.trim() !== "") {
      updateStaffGoogleScholar(settings.google_scholar);
    }
  }, [settings.google_scholar]);

  const handleInputChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleEditClick = (field: string) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = (field: string) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadVisible(false);
    const files = Array.from(e.currentTarget.files ?? []);
    if (files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      uploadProfilePicture(facultyId, formData);
    }
  };

  const settingsFields = [
    {
      key: 'name',
      label: 'Full Name',
      icon: <User size={18} />,
      placeholder: 'Enter your full name'
    },
    {
      key: 'phone_number',
      label: 'Phone Number',
      icon: <Phone size={18} />,
      placeholder: 'Enter your phone number'
    },
    {
      key: 'linkedIn_url',
      label: 'LinkedIn Profile',
      icon: <Link size={18} />,
      placeholder: 'Enter your LinkedIn URL'
    },
    {
      key: 'google_scholar',
      label: 'Google Scholar',
      icon: <GraduationCap size={18} />,
      placeholder: 'Enter your Google Scholar URL'
    }
  ];

  return (
    <Layout>
      <Container>
        <Header>
          <GenericHeaderContainer>
            <GenericHeader>
              <SettingsIcon size={20} />
              Settings
            </GenericHeader>
          </GenericHeaderContainer>
        </Header>

        <SettingsGrid>
          {/* Profile Information Card */}
          <SettingsCard>
            <CardHeader>
              <CardTitle>
                <User size={18} />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {settingsFields.map((field) => (
                <SettingRow key={field.key}>
                  <FieldInfo>
                    <FieldIcon>{field.icon}</FieldIcon>
                    <FieldLabel>{field.label}:</FieldLabel>
                  </FieldInfo>
                  <FieldContent>
                    {isEditing[field.key] ? (
                      <FieldInput
                        value={settings[field.key as keyof SettingsState]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <FieldValue>
                        {settings[field.key as keyof SettingsState] || 'Not set'}
                      </FieldValue>
                    )}
                    <ActionButton
                      onClick={() => {
                        if (isEditing[field.key]) {
                          handleSaveClick(field.key);
                        } else {
                          handleEditClick(field.key);
                        }
                      }}
                      variant={isEditing[field.key] ? 'save' : 'edit'}
                    >
                      {isEditing[field.key] ? <Save size={16} /> : <Edit size={16} />}
                    </ActionButton>
                  </FieldContent>
                </SettingRow>
              ))}
            </CardContent>
          </SettingsCard>

          {/* Profile Picture Card */}
          <SettingsCard>
            <CardHeader>
              <CardTitle>
                <Camera size={18} />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfilePictureSection>
                {uploadVisible ? (
                  <FileInputWrapper>
                    <FileInput
                      type="file"
                      id="profilePicture"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <FileInputLabel htmlFor="profilePicture">
                      <Upload size={18} />
                      Choose Profile Picture
                    </FileInputLabel>
                  </FileInputWrapper>
                ) : (
                  <SuccessMessage>
                    <SuccessText>Upload Successful!</SuccessText>
                    <ChangeButton onClick={() => setUploadVisible(true)}>
                      <Edit size={16} />
                      Change Picture
                    </ChangeButton>
                  </SuccessMessage>
                )}
              </ProfilePictureSection>
            </CardContent>
          </SettingsCard>

          {/* Security Card */}
          <SettingsCard>
            <CardHeader>
              <CardTitle>
                <Lock size={18} />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySection>
                <SecurityInfo>
                  <SecurityText>Keep your account secure by regularly updating your password.</SecurityText>
                </SecurityInfo>
                <PasswordButton onClick={() => setIsPasswordModalOpen(true)}>
                  <Lock size={16} />
                  Change Password
                </PasswordButton>
              </SecuritySection>
            </CardContent>
          </SettingsCard>
        </SettingsGrid>

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </Container>
    </Layout>
  );
}

const Layout = styled.main`
  z-index: 0;
  position: absolute;
  height: 100vh;
  width: 92vw;
  left: 8vw;
  padding: 1rem;
  background-color: rgba(140, 242, 233, 0.35);
`;

const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const SettingsCard = styled.div`
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const SettingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(56, 68, 68, 0.05);

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FieldInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 150px;
`;

const FieldIcon = styled.div`
  color: rgba(4, 103, 112, 0.7);
`;

const FieldLabel = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
`;

const FieldContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const FieldValue = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  flex: 1;
  padding: 0.5rem 0;
`;

const FieldInput = styled.input`
  flex: 1;
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

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }
`;

const ActionButton = styled.button<{ variant: 'edit' | 'save' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'edit' && `
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(37, 99, 235, 1));
    }
  `}
  
  ${props => props.variant === 'save' && `
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
    color: white;
    
    &:hover {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(22, 163, 74, 1));
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;

const ProfilePictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FileInputWrapper = styled.div`
  position: relative;
  width: 100%;
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
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed rgba(4, 103, 112, 0.3);
  border-radius: 0.75rem;
  background: rgba(4, 103, 112, 0.05);
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(4, 103, 112, 0.5);
    background: rgba(4, 103, 112, 0.1);
    color: rgba(4, 103, 112, 1);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const SuccessText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(34, 197, 94, 0.8);
  font-size: 0.9rem;
`;

const ChangeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
    transform: translateY(-1px);
  }
`;

const SecuritySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SecurityInfo = styled.div`
  flex: 1;
`;

const SecurityText = styled.p`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
`;

const PasswordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
  }

  &:active {
    transform: translateY(0);
  }
`;