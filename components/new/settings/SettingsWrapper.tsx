"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { useSettings } from "@/lib/hooks/useSettings";
import {
  GenericHeader,
  LoadingContainer,
  LoadingText,
} from "@/components/ui/GenericStyles";
import Loader from "@/components/ui/Loader";
import {
  Edit,
  Save,
  User,
  Phone,
  Link,
  GraduationCap,
  Camera,
  Lock,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader as LoaderIcon,
  X,
  Heart,
  Rocket,
} from "lucide-react";
import PasswordModal from "./PasswordModal";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface EditingState {
  [key: string]: boolean;
}

interface FormState {
  faculty_name: string;
  faculty_phone: string;
  faculty_linkedin: string;
  faculty_google_scholar: string;
}

export default function SettingsWrapper() {
  const {
    profile,
    loading,
    error,
    success,
    updateProfileField,
    uploadProfilePicture,
    clearMessages,
  } = useSettings();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(true);
  const [isEditing, setIsEditing] = useState<EditingState>({});
  const [formData, setFormData] = useState<FormState>({
    faculty_name: profile?.faculty_name || "",
    faculty_phone: profile?.faculty_phone || "",
    faculty_linkedin: profile?.faculty_linkedin || "",
    faculty_google_scholar: profile?.faculty_google_scholar || "",
  });

  // Update form data when profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({
        faculty_name: profile.faculty_name || "",
        faculty_phone: profile.faculty_phone || "",
        faculty_linkedin: profile.faculty_linkedin || "",
        faculty_google_scholar: profile.faculty_google_scholar || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (field: string) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    clearMessages();
  };

  const handleSaveClick = async (field: keyof FormState) => {
    const value = formData[field];

    try {
      const result = await updateProfileField(field, value);
      if (result.success) {
        setIsEditing((prev) => ({ ...prev, [field]: false }));
      }
    } catch (err) {
      console.error(`Error saving ${field}:`, err);
    }
  };

  const handleCancelEdit = (field: keyof FormState) => {
    // Reset to original value
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        [field]: profile[field] || "",
      }));
    }
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    clearMessages();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadVisible(false);

    const files = Array.from(e.currentTarget.files ?? []);
    if (files.length > 0) {
      const file = files[0];

      try {
        const result = await uploadProfilePicture(file);
        if (!result.success) {
          setUploadVisible(true); // Show upload button again on error
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadVisible(true);
      }
    }
  };

  const settingsFields = [
    {
      key: "faculty_name" as keyof FormState,
      label: "Full Name",
      icon: <User size={18} />,
      placeholder: "Enter your full name",
      required: true,
    },
    {
      key: "faculty_phone" as keyof FormState,
      label: "Phone Number",
      icon: <Phone size={18} />,
      placeholder: "Enter your phone number",
      required: false,
    },
    {
      key: "faculty_linkedin" as keyof FormState,
      label: "LinkedIn Profile",
      icon: <Link size={18} />,
      placeholder: "Enter your LinkedIn URL",
      required: false,
    },
    {
      key: "faculty_google_scholar" as keyof FormState,
      label: "Google Scholar",
      icon: <GraduationCap size={18} />,
      placeholder: "Enter your Google Scholar URL",
      required: false,
    },
  ];

  if (loading.profile && !profile) {
    return (
      <Layout>
        <Container>
          <LoadingContainer>
            <Loader customHeight="h-fit" />
            <LoadingText>Loading your settings...</LoadingText>
          </LoadingContainer>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <HeaderWrapper>
          <HeaderText>Your Settings</HeaderText>
        </HeaderWrapper>

        {/* Global Messages */}
        {error && (
          <MessageCard variant="error">
            <MessageIcon>
              <AlertCircle size={18} />
            </MessageIcon>
            <MessageText>{error}</MessageText>
            <CloseButton onClick={clearMessages}>
              <X size={16} />
            </CloseButton>
          </MessageCard>
        )}

        {success && (
          <MessageCard variant="success">
            <MessageIcon>
              <CheckCircle size={18} />
            </MessageIcon>
            <MessageText>{success}</MessageText>
            <CloseButton onClick={clearMessages}>
              <X size={16} />
            </CloseButton>
          </MessageCard>
        )}

        <SettingsGrid>
          {/* Profile Information Card */}
          <SettingsCard>
            <CardHeader>
              <CardTitle>
                <User size={18} />
                Profile Information
              </CardTitle>
              {profile && (
                <ProfileMeta>
                  <MetaItem>ID: {profile.faculty_id}</MetaItem>
                  <MetaItem>Email: {profile.faculty_email}</MetaItem>
                  <MetaItem>Department: {profile.faculty_department}</MetaItem>
                  <RoleBadge role={profile.faculty_role}>
                    {profile.faculty_role.toUpperCase()}
                  </RoleBadge>
                </ProfileMeta>
              )}
            </CardHeader>
            <CardContent>
              {settingsFields.map((field) => (
                <SettingRow key={field.key}>
                  <FieldInfo>
                    <FieldIcon>{field.icon}</FieldIcon>
                    <FieldLabel>
                      {field.label}
                      {field.required && <RequiredMark>*</RequiredMark>}:
                    </FieldLabel>
                  </FieldInfo>
                  <FieldContent>
                    {isEditing[field.key] ? (
                      <EditingWrapper>
                        <FieldInput
                          value={formData[field.key]}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          disabled={loading.profileField}
                        />
                        <ActionGroup>
                          <ActionButton
                            onClick={() => handleSaveClick(field.key)}
                            variant="save"
                            disabled={loading.profileField}
                          >
                            {loading.profileField ? (
                              <LoaderIcon size={16} className="animate-spin" />
                            ) : (
                              <Save size={16} />
                            )}
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleCancelEdit(field.key)}
                            variant="cancel"
                            disabled={loading.profileField}
                          >
                            <X size={16} />
                          </ActionButton>
                        </ActionGroup>
                      </EditingWrapper>
                    ) : (
                      <>
                        <FieldValue>
                          {formData[field.key] || (
                            <PlaceholderText>
                              {field.required
                                ? "Required - click to add"
                                : "Not set - click to add"}
                            </PlaceholderText>
                          )}
                        </FieldValue>
                        <ActionButton
                          onClick={() => handleEditClick(field.key)}
                          variant="edit"
                          disabled={loading.profileField}
                        >
                          <Edit size={16} />
                        </ActionButton>
                      </>
                    )}
                  </FieldContent>
                </SettingRow>
              ))}
            </CardContent>
          </SettingsCard>

          {/* Right Column */}
          <RightColumn>
            {/* Profile Picture Card */}
            <SettingsCard>
              <CardHeader>
                <CardTitle style={{ margin: "0 0 0 0" }}>
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
                        disabled={loading.profilePicture}
                      />
                      <FileInputLabel htmlFor="profilePicture">
                        {loading.profilePicture ? (
                          <LoaderIcon size={18} className="animate-spin" />
                        ) : (
                          <Upload size={18} />
                        )}
                        {loading.profilePicture
                          ? "Uploading..."
                          : "Choose Profile Picture"}
                      </FileInputLabel>
                      <FileHint>JPEG, PNG, or WebP • Max 5MB</FileHint>
                    </FileInputWrapper>
                  ) : (
                    <SuccessMessage>
                      <SuccessText>Upload Successful!</SuccessText>
                      <ChangeButton
                        onClick={() => setUploadVisible(true)}
                        disabled={loading.profilePicture}
                      >
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
                <CardTitle style={{ margin: "0 0 0 0" }}>
                  <Lock size={18} />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecuritySection>
                  <SecurityInfo>
                    <SecurityText>Keep your account secure.</SecurityText>
                    <SecurityText>
                      Choose a strong password with at least 6 characters.
                    </SecurityText>
                  </SecurityInfo>
                  <PasswordButton
                    onClick={() => setIsPasswordModalOpen(true)}
                    disabled={loading.password}
                  >
                    <Lock size={16} />
                    Change Password
                  </PasswordButton>
                </SecuritySection>
              </CardContent>
            </SettingsCard>
          </RightColumn>
        </SettingsGrid>

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          loading={loading.password}
        />
        
        {/* Made with love footer */}
        <Footer>
          <FooterContent>
            <FooterText>Made with</FooterText>
            <HeartIcon>
              <Heart size={16} fill="currentColor" />
            </HeartIcon>
            <FooterText>by</FooterText>
            <CreatorName>Supastrssd</CreatorName>
            <RocketIcon>
              <Rocket size={16} />
            </RocketIcon>
          </FooterContent>
        </Footer>
      </Container>
    </Layout>
  );
}

// Styled Components (keeping the existing styling but enhancing it)
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

const HeaderWrapper = styled.div`
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;
`;

const HeaderText = styled(GenericHeader)`
  z-index: 20;
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
`;

const MessageCard = styled.div<{ variant: "success" | "error" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  margin-bottom: 0.5rem;

  ${(props) =>
    props.variant === "success" &&
    `
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
    color: rgba(22, 163, 74, 0.9);
  `}

  ${(props) =>
    props.variant === "error" &&
    `
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: rgba(220, 38, 38, 0.9);
  `}
`;

const MessageIcon = styled.div`
  flex-shrink: 0;
`;

const MessageText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  flex: 1;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const SettingsGrid = styled.div`
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SettingsCard = styled.div`
  background-color: rgba(244, 253, 252, 0.75);
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  border-radius: 1rem;
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
  margin: 0 0 0.75rem 0;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const MetaItem = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  color: rgba(107, 114, 128, 0.8);
  background: rgba(107, 114, 128, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
`;

const RoleBadge = styled.span<{ role: string }>`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;

  ${(props) =>
    props.role.toLowerCase() === "hod" &&
    `
    background: rgba(239, 68, 68, 0.1);
    color: rgba(220, 38, 38, 0.9);
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}

  ${(props) =>
    props.role.toLowerCase() === "editor" &&
    `
    background: rgba(59, 130, 246, 0.1);
    color: rgba(37, 99, 235, 0.9);
    border: 1px solid rgba(59, 130, 246, 0.2);
  `}
  
  ${(props) =>
    props.role.toLowerCase() === "faculty" &&
    `
    background: rgba(34, 197, 94, 0.1);
    color: rgba(22, 163, 74, 0.9);
    border: 1px solid rgba(34, 197, 94, 0.2);
  `}
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

const RequiredMark = styled.span`
  color: rgba(239, 68, 68, 0.8);
  margin-left: 0.2rem;
`;

const FieldContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const EditingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FieldValue = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  flex: 1;
  padding: 0.5rem 0;
`;

const PlaceholderText = styled.span`
  color: rgba(107, 114, 128, 0.6);
  font-style: italic;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }
`;

const ActionButton = styled.button<{ variant: "edit" | "save" | "cancel" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === "edit" &&
    `
    background: linear-gradient(135deg, rgba(122, 194, 226, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover:not(:disabled) {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}

  ${(props) =>
    props.variant === "save" &&
    `
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
    color: white;
    
    &:hover:not(:disabled) {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(22, 163, 74, 1));
    }
  `}
  
  ${(props) =>
    props.variant === "cancel" &&
    `
    background: linear-gradient(135deg, rgba(107, 114, 128, 0.8), rgba(75, 85, 99, 0.8));
    color: white;
    
    &:hover:not(:disabled) {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(107, 114, 128, 1), rgba(75, 85, 99, 1));
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
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

  &:disabled {
    cursor: not-allowed;
  }
`;

const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
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

const FileHint = styled.span`
  font-size: 0.8rem;
  color: rgba(107, 114, 128, 0.6);
  text-align: center;
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
  font-size: 0.85rem;
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
    transform: none;
  }
`;

const SecuritySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: column;
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
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.2),
    rgba(0, 131, 143, 1)
  );
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0 1rem 0;
  margin-top: auto;
  width: 100%;
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(244, 253, 252, 0.8);
  border: 0.1px solid rgba(56, 68, 68, 0.2);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
    background: rgba(244, 253, 252, 0.95);
  }
`;

const FooterText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(4, 103, 112, 0.8);
`;

const HeartIcon = styled.div`
  color: rgba(239, 68, 68, 0.8);
  animation: heartbeat 2s ease-in-out infinite;
  
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const CreatorName = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 1);
  background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RocketIcon = styled.div`
  color: rgba(251, 146, 60, 0.8);
  animation: rocket 3s ease-in-out infinite;
  
  @keyframes rocket {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(5deg); }
    75% { transform: translateY(-1px) rotate(-3deg); }
  }
`;
