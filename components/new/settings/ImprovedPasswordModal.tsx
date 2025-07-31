"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useSettings } from "@/lib/hooks/useSettings";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ImprovedPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordValidation {
  length: boolean;
  match: boolean;
}

export default function ImprovedPasswordModal({ isOpen, onClose }: ImprovedPasswordModalProps) {
  const { updatePassword, loading, error, success } = useSettings();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validation: PasswordValidation = {
    length: newPassword.length >= 6,
    match: newPassword === confirmPassword && newPassword.length > 0,
  };

  const isFormValid = validation.length && validation.match;

  const handlePasswordChange = async () => {
    setLocalError(null);

    if (!newPassword.trim()) {
      setLocalError("Please enter a new password");
      return;
    }

    if (!isFormValid) {
      setLocalError("Please fix the validation errors before continuing");
      return;
    }

    try {
      const result = await updatePassword({
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        // Reset form and close modal
        handleClose();
      }
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLocalError(null);
    onClose();
  };

  if (!isOpen) return null;

  const displayError = localError || error;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderInfo>
            <ModalTitle>
              <Lock size={20} />
              Change Password
            </ModalTitle>
            <ModalSubtitle>Choose a strong password to keep your account secure</ModalSubtitle>
          </HeaderInfo>
          <CloseButton onClick={handleClose} disabled={loading}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Success Message */}
          {success && (
            <MessageCard variant="success">
              <CheckCircle size={18} />
              <span>{success}</span>
            </MessageCard>
          )}

          {/* Error Message */}
          {displayError && (
            <MessageCard variant="error">
              <AlertCircle size={18} />
              <span>{displayError}</span>
            </MessageCard>
          )}

          <FormGroup>
            <Label>New Password</Label>
            <PasswordWrapper>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </ToggleButton>
            </PasswordWrapper>
            
            {/* Password Requirements */}
            <ValidationList>
              <ValidationItem isValid={validation.length}>
                <ValidationIcon>
                  {validation.length ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                </ValidationIcon>
                At least 6 characters long
              </ValidationItem>
            </ValidationList>
          </FormGroup>

          <FormGroup>
            <Label>Confirm New Password</Label>
            <PasswordWrapper>
              <PasswordInput
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </ToggleButton>
            </PasswordWrapper>
            
            {/* Password Match Validation */}
            {confirmPassword && (
              <ValidationList>
                <ValidationItem isValid={validation.match}>
                  <ValidationIcon>
                    {validation.match ? (
                      <CheckCircle size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                  </ValidationIcon>
                  Passwords match
                </ValidationItem>
              </ValidationList>
            )}
          </FormGroup>

          {/* Password Strength Indicator */}
          <PasswordStrength>
            <StrengthLabel>Password Strength:</StrengthLabel>
            <StrengthBar>
              <StrengthFill strength={getPasswordStrength(newPassword)} />
            </StrengthBar>
            <StrengthText>{getPasswordStrengthText(newPassword)}</StrengthText>
          </PasswordStrength>
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleClose} disabled={loading}>
            Cancel
          </CancelButton>
          <ConfirmButton 
            onClick={handlePasswordChange} 
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}
            {loading ? "Updating..." : "Update Password"}
          </ConfirmButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

// Helper functions
function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  
  let strength = 0;
  
  // Length
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 4);
}

function getPasswordStrengthText(password: string): string {
  const strength = getPasswordStrength(password);
  
  switch (strength) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
}

// Styled Components
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(107, 114, 128, 0.8);
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

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    color: rgba(239, 68, 68, 1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MessageCard = styled.div<{ variant: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  
  ${props => props.variant === 'success' && `
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
    color: rgba(22, 163, 74, 0.9);
  `}
  
  ${props => props.variant === 'error' && `
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: rgba(220, 38, 38, 0.9);
  `}
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-right: 3rem;
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

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: rgba(107, 114, 128, 0.6);
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover:not(:disabled) {
    color: rgba(4, 103, 112, 0.8);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ValidationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ValidationItem = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  transition: color 0.3s ease;
  
  color: ${props => props.isValid 
    ? 'rgba(22, 163, 74, 0.9)' 
    : 'rgba(107, 114, 128, 0.6)'
  };
`;

const ValidationIcon = styled.div`
  display: flex;
  align-items: center;
`;

const PasswordStrength = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StrengthLabel = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(107, 114, 128, 0.8);
`;

const StrengthBar = styled.div`
  height: 0.5rem;
  background: rgba(107, 114, 128, 0.2);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const StrengthFill = styled.div<{ strength: number }>`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 0.25rem;
  
  width: ${props => (props.strength / 4) * 100}%;
  
  ${props => {
    if (props.strength <= 1) return 'background: rgba(239, 68, 68, 0.8);';
    if (props.strength === 2) return 'background: rgba(245, 158, 11, 0.8);';
    if (props.strength === 3) return 'background: rgba(59, 130, 246, 0.8);';
    return 'background: rgba(34, 197, 94, 0.8);';
  }}
`;

const StrengthText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => {
    const text = props.children as string;
    if (text === 'Weak') return 'color: rgba(239, 68, 68, 0.8);';
    if (text === 'Fair') return 'color: rgba(245, 158, 11, 0.8);';
    if (text === 'Good') return 'color: rgba(59, 130, 246, 0.8);';
    return 'color: rgba(34, 197, 94, 0.8);';
  }}
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
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

  &:hover:not(:disabled) {
    background: rgba(107, 114, 128, 0.1);
    border-color: rgba(107, 114, 128, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button`
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