"use client";

import React from "react";
import styled from "styled-components";
import { CheckCircle, Clock, AlertCircle, FileText, Send } from "lucide-react";

// Dummy data for recent activities
const recentActivities = [
  {
    id: 1,
    type: "upload",
    title: "Journal Uploaded",
    description: "Machine Learning in Healthcare - IEEE Trans.",
    timestamp: "30 minutes ago",
    icon: FileText,
    iconColor: "rgba(0, 188, 212, 0.9)",
    bgColor: "rgba(0, 188, 212, 0.1)",
  },
  {
    id: 2,
    type: "approval",
    title: "Patent Approved",
    description: "AI-Powered Diagnostic System - Dr. Sarah Chen",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    iconColor: "rgba(128, 210, 35, 0.9)",
    bgColor: "rgba(128, 210, 35, 0.1)",
  },
  {
    id: 3,
    type: "edit",
    title: "Conference Updated",
    description: "ICML 2024 presentation details modified",
    timestamp: "5 hours ago",
    icon: AlertCircle,
    iconColor: "rgba(0, 131, 143, 0.9)",
    bgColor: "rgba(0, 131, 143, 0.1)",
  },
  {
    id: 4,
    type: "pending",
    title: "Workshop Pending",
    description: "Quantum Computing Workshop awaiting review",
    timestamp: "1 day ago",
    icon: Clock,
    iconColor: "rgba(255, 152, 0, 0.9)",
    bgColor: "rgba(255, 152, 0, 0.1)",
  },
  {
    id: 5,
    type: "submission",
    title: "Research Submitted",
    description: "Neural Networks Study - Prof. Kumar",
    timestamp: "2 days ago",
    icon: Send,
    iconColor: "rgba(103, 58, 183, 0.9)",
    bgColor: "rgba(103, 58, 183, 0.1)",
  },
];

export default function RecentActivityCard() {
  return (
    <ActivityWrapper>
      <ActivityList>
        {recentActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <ActivityItem key={activity.id}>
              <Timeline>
                <IconContainer
                  $iconColor={activity.iconColor}
                  $bgColor={activity.bgColor}
                >
                  <Icon size={16} />
                </IconContainer>
                {index < recentActivities.length - 1 && <TimelineLine />}
              </Timeline>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDescription>
                  {activity.description}
                </ActivityDescription>
                <ActivityTimestamp>{activity.timestamp}</ActivityTimestamp>
              </ActivityContent>
            </ActivityItem>
          );
        })}
      </ActivityList>
    </ActivityWrapper>
  );
}

const ActivityWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  scrollbar-gutter: stable;

  /* Hide scrollbar by default, show on hover when there's overflow */
  &::-webkit-scrollbar {
    width: 0;
    transition: width 0.3s ease;
  }

  &:hover::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 131, 143, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 131, 143, 0.2);
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 131, 143, 0.3);
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 131, 143, 0.2) rgba(0, 131, 143, 0.05);
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateX(1px);
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 2rem;
`;

const IconContainer = styled.div<{ $iconColor: string; $bgColor: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$iconColor};
  border: 1px solid ${(props) => props.$iconColor}33;
  z-index: 1;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(100% - 2rem);
  background: linear-gradient(
    to bottom,
    rgba(0, 131, 143, 0.15),
    rgba(0, 131, 143, 0.05)
  );
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-right: 0.5rem;
`;

const ActivityTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.99);
  margin: 0 0 0.125rem 0;
  letter-spacing: 0.01em;
`;

const ActivityDescription = styled.p`
  font-size: 0.8rem;
  color: rgba(4, 103, 112, 0.7);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
`;

const ActivityTimestamp = styled.span`
  font-size: 0.7rem;
  color: rgba(0, 131, 143, 0.5);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
