"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import logo from "../../../public/logo.webp";
import { Urbanist } from "next/font/google";
import "../../globals.css";
import { useAuth } from "@/lib/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";
import toast from "react-hot-toast";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

const generalText = Urbanist({
  weight: "500",
  subsets: ["latin"],
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <>
      <MobileAdvisory />
      <LoginContainer>
        <BackgroundContainer>
          <ContentWrapper>
            <LogoImage src={logo} width={150} height={150} alt="logo" />

            {isLoading ? (
              <LoadingWrapper>
                <LoadingContainer>
                  <Loader customHeight="h-fit" />
                  <LoadingText>Signing in...</LoadingText>
                </LoadingContainer>
              </LoadingWrapper>
            ) : (
              <LoginForm onSubmit={handleSignIn}>
                <InputLabel htmlFor="email-input-sign-in">Email</InputLabel>
                <InputField
                  id="email-input-sign-in"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />

                <InputLabel htmlFor="password-input-sign-in">
                  Password
                </InputLabel>
                <PasswordContainer>
                  <InputField
                    id="password-input-sign-in"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  {password.length > 0 && (
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </PasswordToggle>
                  )}
                </PasswordContainer>

                <ButtonContainer>
                  <SignInButton disabled={isLoading}>Sign In</SignInButton>
                  {!isLoading && (
                    <SignUpLink href="/sign-up">
                      Not Registered? Sign Up!
                    </SignUpLink>
                  )}
                </ButtonContainer>
              </LoginForm>
            )}
          </ContentWrapper>
        </BackgroundContainer>
      </LoginContainer>
    </>
  );
}

const LoginContainer = styled.div`
  font-family: ${generalText.style.fontFamily};
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  background: #3b9b9b;
  height: 100vh;
  width: 100vw;
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }

  @media (min-width: 768px) {
    padding: 3rem 4rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 8rem;
  }

  @media (min-width: 1280px) {
    padding: 4rem 16rem;
  }

  @media (min-width: 1536px) {
    padding: 4rem 24rem;
  }
`;

const BackgroundContainer = styled.div`
  background: url("/login-bg.svg") center/150% no-repeat;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;  
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoImage = styled(Image)`
  align-self: center;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
`;

const LoginForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  justify-content: center;
  gap: 0.5rem;
  color: inherit;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  color: #065f46;
  text-transform: uppercase;
`;

const InputField = styled.input`
  caret-color: #047857;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  background: inherit;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(45, 212, 191, 0.2);
  width: 100%;
  color: #237a70;

  &:focus {
    outline: none;
    border-color: #047857;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 33.33%;
  transform: translateY(-50%);
  color: #065f46;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SignInButton = styled.button`
  background: #0f766e;
  text-align: center;
  width: 10vw;
  min-width: 120px;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  color: #a7f3d0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #14b8a6;
    box-shadow: 0 4px 6px -1px rgba(45, 212, 191, 0.5);
    color: #a0f0ed;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignUpLink = styled(Link)`
  text-align: center;
  padding: 0.5rem 0;
  color: #0f766e;
  text-decoration: none;

  &:hover {
    color: #14b8a6;
    text-decoration: underline;
    text-underline-offset: 0.125rem;
    cursor: pointer;
  }
`;
