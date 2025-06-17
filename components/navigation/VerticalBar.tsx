"use client";

import React from "react";
import Image from "next/image";
import logoImg from "../../public/logo.webp";
import { Inconsolata } from "next/font/google";
import styled, { keyframes } from "styled-components";
import {
  Home,
  Briefcase,
  Users,
  BookOpen,
  Lightbulb,
  FileText,
} from "lucide-react";

const bodyText = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

interface VerticalBarProps {
  is_hod: boolean;
  is_editor: boolean;
}

export default function VerticalBar(props: VerticalBarProps) {
  return (
    <NavContainer className={bodyText.className}>
      <NavList>
        <LogoItem>
          <LogoItemLink>
            <LogoImage src={logoImg} alt="Logo Image" />
          </LogoItemLink>
        </LogoItem>

        <NavItem>
          <NavLink href="/">
            <IconWrapper>
              <Home size={30} />
            </IconWrapper>
            <NavText>Dashboard</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/my-workshops">
            <IconWrapper>
              <Briefcase size={30} />
            </IconWrapper>
            <NavText>Workshops</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/my-conferences">
            <IconWrapper>
              <Users size={30} />
            </IconWrapper>
            <NavText>Conferences</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/my-journals">
            <IconWrapper>
              <BookOpen size={30} />
            </IconWrapper>
            <NavText>Journals</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/my-patents">
            <IconWrapper>
              <Lightbulb size={30} />
            </IconWrapper>
            <NavText>Patents</NavText>
          </NavLink>
        </NavItem>

        {(props.is_hod || props.is_editor) && <ReportSubComp />}
      </NavList>
    </NavContainer>
  );
}

const ReportSubComp = () => {
  return (
    <NavItem>
      <NavLink href="/reports">
        <IconWrapper>
          <FileText size={30} />
        </IconWrapper>
        <NavText>Reports</NavText>
      </NavLink>
    </NavItem>
  );
};

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const NavContainer = styled.section`
  z-index: 10;
  background-color: rgba(20, 154, 184, 0.77);
  width: 8vw;
  height: 100%;
  position: fixed;
  top: 0;
  visibility: hidden;
  border-right: 1px solid rgba(4, 47, 46, 0.29);

  @media (min-width: 640px) {
    visibility: visible;
  }
`;

const NavList = styled.ul`
  color: rgb(216, 236, 236);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 640px) {
    font-size: 0.6rem;
  }

  @media (min-width: 1024px) {
    font-size: 0.875rem;
  }
`;

const LogoItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -1.5rem;
  margin-bottom: -1.5rem;
`;

const LogoItemLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled(Image)`
  width: 40%;
  height: 40%;

  @media (min-width: 768px) {
    width: 60%;
    height: 60%;
  }

  &:hover {
    cursor: pointer;
    animation: ${pulse} 0.5s ease-in-out;
  }
`;

const NavItem = styled.li`
width: 100%;

&:hover {
    color: rgba(3, 78, 90, 0.53);
    animation: ${pulse} 0.5s ease-in-out;
    shadow: 0 0 10px rgba(3, 78, 90, 0.53), 0 0 20px rgba(3, 78, 90, 0.53), 0 0 40px rgba(3, 78, 90, 0.53), 0 0 80px rgba(3, 78, 90, 0.53), 0 0 120px rgba(3, 78, 90, 0.53), 0 0 160px rgba(3, 78, 90, 0.53);
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 2.5rem;
    height: 2.5rem;

    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
    }

    @media (min-width: 768px) {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`;

const NavText = styled.p`
  margin: 0;
`;
