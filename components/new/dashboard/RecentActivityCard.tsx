"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import Loader from "@/components/ui/Loader";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { useRecentActivity } from "@/lib/hooks/useRecentActivity";
import { useGetUser } from "@/lib/hooks/useGetUser";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

const getActivityIcon = (category: string) => {
  switch (category) {
    case "approval":
      return CheckCircle;
    case "pending":
      return Clock;
    case "rejection":
      return XCircle;
    case "upload":
    case "edit":
    default:
      return FileText;
  }
};

const getActivityColors = (category: string) => {
  switch (category) {
    case "approval":
      return {
        iconColor: "rgba(128, 210, 35, 0.9)",
        bgColor: "rgba(128, 210, 35, 0.1)",
      };
    case "pending":
      return {
        iconColor: "rgba(255, 152, 0, 0.9)",
        bgColor: "rgba(255, 152, 0, 0.1)",
      };
    case "rejection":
      return {
        iconColor: "rgba(244, 67, 54, 0.9)",
        bgColor: "rgba(244, 67, 54, 0.1)",
      };
    case "upload":
    case "edit":
    default:
      return {
        iconColor: "rgba(0, 188, 212, 0.9)",
        bgColor: "rgba(0, 188, 212, 0.1)",
      };
  }
};

export default function RecentActivityCard() {
  const { userDetails, fetchUserDetails, loading: userLoading } = useGetUser();
  const {
    activities,
    loading: activitiesLoading,
    error,
  } = useRecentActivity(userDetails?.faculty_id, 5);

  useEffect(() => {
    if (!userDetails) {
      fetchUserDetails();
    }
  }, [userDetails, fetchUserDetails]);

  // Show loading if either user details are loading OR activities are loading OR we don't have userDetails yet
  const isLoading = userLoading || activitiesLoading || !userDetails;

  if (isLoading) {
    return (
      <ActivityWrapper>
        <LoadingContainer>
          <Loader customHeight="h-fit" />
          <LoadingText>Loading recent activities...</LoadingText>
        </LoadingContainer>
      </ActivityWrapper>
    );
  }

  if (error) {
    return (
      <ActivityWrapper>
        <ErrorContainer>
          <ErrorText>Failed to load recent activities</ErrorText>
        </ErrorContainer>
      </ActivityWrapper>
    );
  }

  if (!activities.length) {
    return (
      <ActivityWrapper>
        <EmptyContainer>
          <EmptyText>No recent activities</EmptyText>
          <EmptySubtext>
            Your recent submissions and updates will appear here
          </EmptySubtext>
        </EmptyContainer>
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper>
      <ActivityList>
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.category);
          const colors = getActivityColors(activity.category);
          return (
            <ActivityItem key={activity.id}>
              <Timeline>
                <IconContainer
                  $iconColor={colors.iconColor}
                  $bgColor={colors.bgColor}
                >
                  <Icon size={16} />
                </IconContainer>
                {index < activities.length - 1 && <TimelineLine />}
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
  font-family: ${bodyText.style.fontFamily};
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

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: rgba(244, 67, 54, 0.8);
  margin: 0;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: rgba(0, 131, 143, 0.7);
  margin: 0;
  font-weight: 500;
`;

const EmptySubtext = styled.p`
  font-size: 0.75rem;
  color: rgba(0, 131, 143, 0.5);
  margin: 0;
  text-align: center;
`;
