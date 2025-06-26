"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { Inconsolata } from "next/font/google";
import { Settings, LogOut, MoonIcon, SunIcon } from "lucide-react";

const bodyText = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

export default function HeaderBar() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [lightMode, setMode] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleDarkMode = () => {
    setMode(!lightMode);
  };

  return (
    <HeaderContainer>
      {/* Large Screens Navigation */}
      <LargeScreenNav>
        <ActionItem>
          {lightMode ? (
            <DarkModeButton onClick={toggleDarkMode}>
              <MoonIcon />
            </DarkModeButton>
          ) : (
            <LightModeButton onClick={toggleDarkMode}>
              <SunIcon />
            </LightModeButton>
          )}
        </ActionItem>

        <ActionItem>
          <SettingsLink href="/settings">
            <Settings />
          </SettingsLink>
        </ActionItem>

        <ActionItem onClick={handleSignOut}>
          <LogOutButton>
            <LogOut />
          </LogOutButton>
        </ActionItem>
      </LargeScreenNav>
    </HeaderContainer>
  );
}

// Animations
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const HeaderContainer = styled.section`
  z-index: 10;
  width: 100%;
  margin: 0;
  position: fixed;
  top: 0;
  right: 2.5rem;
  margin-right: 0.5%;
  height: 10vh;
  font-family: ${bodyText.style.fontFamily};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LargeScreenNav = styled.ul`
  visibility: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  @media (min-width: 640px) {
    visibility: visible;
  }
`;

const ActionItem = styled.li`
  display: none;
  list-style: none;

  @media (min-width: 640px) {
    display: inline-block;
  }
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  border: 0 solid transparent;
  width: 40px;
  height: 40px;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  border: 0 solid transparent;
  width: 40px;
  height: 40px;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

// Styled icon components
const SettingsLink = styled(IconLink)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(0, 131, 143, 0.8);

  &:hover {
    color: rgb(59, 130, 246);
    background-color: rgba(59, 130, 246, 0.15);
    border: 0.1px solid rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  }

  &:hover svg {
    animation: ${rotate} 0.8s ease-in-out;
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
  }
`;

const LogOutButton = styled(IconButton)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(0, 131, 143, 0.8);

  &:hover {
    color: rgb(239, 68, 68);
    background-color: rgba(239, 68, 68, 0.1);
    border: 0.1px solid rgba(239, 68, 68, 0.1);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  }

  &:hover svg {
    transform: translateX(3px);
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
  }
`;

const DarkModeButton = styled(IconButton)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(0, 131, 143, 0.8);

  &:hover {
    color: rgb(87, 11, 175);
    background-color: rgba(46, 14, 160, 0.2);
    box-shadow: 0 0 20px rgba(87, 11, 175, 0.4);
  }

  &:hover svg {
    filter: drop-shadow(0 0 8px rgba(87, 11, 175, 0.6));
    animation: pulse 1.5s ease-in-out infinite;
  }
`;

const LightModeButton = styled(IconButton)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(0, 131, 143, 0.8);

  &:hover {
    color: rgb(206, 117, 34);
    background-color: rgba(206, 117, 34, 0.1);
    border: 0.1px solid rgba(206, 117, 34, 0.1);
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
  }

  &:hover svg {
    filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.8));
    animation: pulse 1.5s ease-in-out infinite;
  }
`;
