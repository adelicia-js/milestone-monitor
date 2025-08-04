"use client";

import React from "react";
import styled from "styled-components";
import {
  GenericCard,
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import {
  Users,
  BookOpen,
  Lightbulb,
  Briefcase,
  Plus,
  UserCog,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function QuickActionsCard() {
  const router = useRouter();

  const handleAddConference = () => {
    router.push("/conferences?action=add");
  };
  
  const handleAddJournal = () => {
    router.push("/journals?action=add");
  };
  
  const handleAddPatent = () => {
    router.push("/patents?action=add");
  };
  
  const handleAddWorkshop = () => {
    router.push("/workshops?action=add");
  };

  return (
    <Card>
      <GenericHeaderContainer>
        <GenericHeader>Quick Actions</GenericHeader>
      </GenericHeaderContainer>
      <ActionsList>
        <ActionButton onClick={handleAddConference} title="Add Conference">
          <IconWrapper>
            <Users />
            <PlusIcon>
              <Plus size={16} />
            </PlusIcon>
          </IconWrapper>
          <ActionLabel>Conference</ActionLabel>
        </ActionButton>

        <ActionButton onClick={handleAddJournal} title="Add Journal">
          <IconWrapper>
            <BookOpen />
            <PlusIcon>
              <Plus size={16} />
            </PlusIcon>
          </IconWrapper>
          <ActionLabel>Journal</ActionLabel>
        </ActionButton>

        <ActionButton onClick={handleAddPatent} title="Add Patent">
          <IconWrapper>
            <Lightbulb />
            <PlusIcon>
              <Plus size={16} />
            </PlusIcon>
          </IconWrapper>
          <ActionLabel>Patent</ActionLabel>
        </ActionButton>

        <ActionButton onClick={handleAddWorkshop} title="Add Workshop">
          <IconWrapper>
            <Briefcase />
            <PlusIcon>
              <Plus size={16} />
            </PlusIcon>
          </IconWrapper>
          <ActionLabel>Workshop</ActionLabel>
        </ActionButton>

        <ActionButton
          onClick={() => router.push("/modify/staff")}
          title="Edit Users"
        >
          <IconWrapper>
            <UserCog />
          </IconWrapper>
          <ActionLabel>Edit Users</ActionLabel>
        </ActionButton>

        <ActionButton
          onClick={() => router.push("/modify/approvals")}
          title="View Approvals"
        >
          <IconWrapper>
            <CheckCircle />
          </IconWrapper>
          <ActionLabel>Approvals</ActionLabel>
        </ActionButton>
      </ActionsList>
    </Card>
  );
}

const Card = styled(GenericCard)`
  height: 35%;
  width: 100%;
`;

const ActionsList = styled.ul`
  width: 100%;
  height: 100%;
  padding: 1.5rem 1.5rem 0 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(244, 253, 252, 0.8);
  border: 0.1px solid rgba(0, 131, 143, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100px;
  height: 100px;
  flex: 0 0 auto;

  &:hover {
    background: rgba(0, 188, 212, 0.1);
    border-color: rgba(0, 188, 212, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 0.2px 10px rgba(0, 188, 212, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 131, 143, 0.9);
  width: 40px;
  height: 40px;

  svg {
    transition: all 0.3s ease;
    width: 24px;
    height: 24px;
  }

  ${ActionButton}:hover & svg {
    transform: scale(1.1);
    // color: rgba(0, 188, 212, 1);
  }
`;

const PlusIcon = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: rgba(128, 210, 35, 0.6);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.1px 4px rgba(128, 210, 35, 0.2);

  svg {
    color: white;
  }

  ${ActionButton}:hover & {
    background: rgba(128, 210, 35, 1);
    transform: scale(1.15);
  }
`;

const ActionLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(4, 103, 112, 0.99);
  letter-spacing: 0.02emI;
  text-align: center;
  line-height: 1.2;
  max-width: 80px;
  letter-spacing: 0.5px;
  font-family: ${bodyText.style.fontFamily};
  `;
