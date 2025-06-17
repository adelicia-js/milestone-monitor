"use client";

import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { Inconsolata } from "next/font/google";
import { Settings, LogOut } from "lucide-react";

const bodyText = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

export default function HeaderBar() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <HeaderContainer>
      {/* Large Screens Navigation */}
      <LargeScreenNav>
          <ActionItem>
            <IconLink href="/settings">
              <StyledSettings />
            </IconLink>
          </ActionItem>

          <ActionItem>
            <IconButton onClick={handleSignOut}>
              <StyledLogOut />
            </IconButton>
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
  width: 100%;
  margin: 0;
  position: fixed;
  top: 0;
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
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
  
  &:active {
    background-color: rgba(239, 68, 68, 0.2);
  }
`;

// Styled icon components
const StyledSettings = styled(Settings)`
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  color: #374151;
  
  &:hover {
    animation: ${rotate} 0.8s ease-in-out;
    color:rgb(142, 141, 141);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
`;

const StyledLogOut = styled(LogOut)`
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  color: #374151;
  
  &:hover {
    color: #ef4444;
    transform: translateX(2px);
    filter: drop-shadow(0 4px 6px rgba(239, 68, 68, 0.2));
  }
`;