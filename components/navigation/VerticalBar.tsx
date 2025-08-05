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
  Shield,
  UserPlus,
  CheckCircle,
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
          <NavLink href="/workshops">
            <IconWrapper>
              <Briefcase size={30} />
            </IconWrapper>
            <NavText>Workshops</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/conferences">
            <IconWrapper>
              <Users size={30} />
            </IconWrapper>
            <NavText>Conferences</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/journals">
            <IconWrapper>
              <BookOpen size={30} />
            </IconWrapper>
            <NavText>Journals</NavText>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/patents">
            <IconWrapper>
              <Lightbulb size={30} />
            </IconWrapper>
            <NavText>Patents</NavText>
          </NavLink>
        </NavItem>

        {props.is_hod && <ModifySubComp />}
        {(props.is_hod || props.is_editor) && <ReportSubComp />}
      </NavList>
    </NavContainer>
  );
}

const ModifySubComp = () => {
  return (
    <NavItem>
      <NavLink style={{ cursor: "default" }}>
        <IconWrapper>
          <Shield size={30} />
        </IconWrapper>
        <NavText>Modify</NavText>
      </NavLink>
      <SubMenu>
        <SubMenuItem>
          <SubNavLink href="/modify/staff">
            <UserPlus size={18} />
            <span>Staff</span>
          </SubNavLink>
        </SubMenuItem>
        <SubMenuItem>
          <SubNavLink href="/modify/approvals">
            <CheckCircle size={18} />
            <span>Approvals</span>
          </SubNavLink>
        </SubMenuItem>
      </SubMenu>
    </NavItem>
  );
};

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
  position: relative;

  &:hover {
    color: rgba(3, 78, 90, 0.95);
    animation: ${pulse} 0.5s ease-in-out;
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

const SubMenu = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(20, 154, 184, 0.77);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(216, 236, 236, 0.2);
  border-radius: 0.75rem;
  padding: 0.5rem;
  min-height: 120px;
  min-width: 140px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;

  ${NavItem}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(0.5rem);
  }
`;

const SubMenuItem = styled.div`
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: rgba(216, 236, 236, 0.9);
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(216, 236, 236, 0.15);
    color: white;
    transform: translateX(2px);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
  }
`;
