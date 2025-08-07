"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {
  GenericCard,
  GenericHeader,
  GenericHeaderContainer,
  LoadingContainer,
  LoadingText,
} from "@/components/ui/GenericStyles";
import Loader from "@/components/ui/Loader";
import { useGetUser } from "@/lib/hooks/useGetUser";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ProfileCardProps {
  imageURL?: string;
}

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function ProfileCard(props: ProfileCardProps) {
  const [hasProfileImage, setHasProfileImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { userDetails, fetchUserDetails, loading } = useGetUser();

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Generate profile image URL based on faculty_id
  useEffect(() => {
    if (!userDetails?.faculty_id) return;

    const supabase = createClientComponentClient();
    const facultyId = userDetails.faculty_id;

    // Try the most common extension first (jpg)
    const { data } = supabase.storage
      .from("staff-media")
      .getPublicUrl(`profilePictures/${facultyId}.jpg`);

    if (data.publicUrl) {
      setProfileImageUrl(data.publicUrl);
      setHasProfileImage(true);
    }
  }, [userDetails?.faculty_id]);

  // Also check for provided imageURL prop
  useEffect(() => {
    if (props.imageURL) {
      setProfileImageUrl(props.imageURL);
      setHasProfileImage(true);
    }
  }, [props.imageURL]);

  if (loading) {
    return (
      <Card>
        <GenericHeaderContainer>
          <GenericHeader>Your Profile</GenericHeader>
        </GenericHeaderContainer>
        <LoadingContainer style={{ width: "100%" }}>
          <Loader customHeight="h-fit" />
          <LoadingText>Loading profile details...</LoadingText>
        </LoadingContainer>
      </Card>
    );
  }

  const profileDetails = [
    { label: "Name", value: userDetails?.faculty_name ?? "New Faculty" },
    {
      label: "Department",
      value: userDetails?.faculty_department ?? "General",
    },
    {
      label: "Faculty Role",
      value: userDetails?.faculty_role.toUpperCase() ?? "faculty",
    },
    { label: "Faculty ID", value: userDetails?.faculty_id ?? "TBD" },
  ];

  return (
    <Card>
      <GenericHeaderContainer>
        <GenericHeader>Your Profile</GenericHeader>
      </GenericHeaderContainer>
      <ProfilePictureCard>
        {hasProfileImage && profileImageUrl ? (
          <ProfileImage
            src={profileImageUrl}
            alt="Profile picture"
            onError={() => {
              setHasProfileImage(false);
              setProfileImageUrl(null);
            }}
          />
        ) : (
          <PlaceholderContainer>
            <svg width="120" height="120" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="14" fill="rgba(56, 68, 68, 0.2)" />
              <path
                d="M16 70C16 58 26.745 48 40 48C53.255 48 64 58 64 70"
                fill="rgba(56, 68, 68, 0.2)"
              />
            </svg>
          </PlaceholderContainer>
        )}
      </ProfilePictureCard>
      <ProfileDetailsCard>
        {profileDetails.map((detail, index) => (
          <ProfileDetailTextBox key={index}>
            <ProfileDetailText>{detail.label} </ProfileDetailText>
            <ProfileValueText>{detail.value}</ProfileValueText>
          </ProfileDetailTextBox>
        ))}
      </ProfileDetailsCard>
    </Card>
  );
}

const Card = styled(GenericCard)`
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
`;

const ProfilePictureCard = styled.div`
  margin-top: 1.5rem;
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    120deg,
    rgba(213, 235, 238, 0.34),
    rgba(179, 224, 228, 0.32)
  );
  border-radius: 1rem;
  font-weight: 400;
  box-shadow: 0 0.1px 15px rgba(0, 188, 212, 0.3),
    0 0.1px 2px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 0.1px solid rgba(0, 131, 143, 0.27);

  @media (min-width: 1024px) {
    height: 70%;
  }

  @media (min-width: 1280px) {
    height: 80%;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 154, 184, 0.1);
  border-radius: 0.5rem;
`;

const ProfileDetailsCard = styled.div`
  margin-top: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    width: 70%;
  }

  @media (min-width: 1280px) {
    width: 80%;
  }
`;

const ProfileDetailTextBox = styled.div`
  height: 5vh;
  width: 100%;
  display: grid;
  grid-template-columns: 0.6fr 1.2fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    120deg,
    rgba(213, 235, 238, 0.34),
    rgba(0, 131, 143, 0.32)
  );
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
  color: rgba(0, 131, 143, 0.99);
  font-weight: 400;
  text-shadow: 0.1px 0.1px 2px rgba(193, 243, 243, 0.3);
  box-shadow: 0 0.1px 10px rgba(0, 188, 212, 0.3), 0 2px 5px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 0.1px solid rgba(0, 131, 143, 0.27);

  @media (min-width: 1024px) {
    grid-template-columns: 0.8fr 1fr;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 0.6fr 1.2fr;
  }
`;

const ProfileDetailText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(0, 131, 143, 0.6);
  font-size: clamp(0.75rem, 0.3056rem + 0.6944vw, 1rem);
`;

const ProfileValueText = styled(ProfileDetailText)`
  font-weight: 600;
  color: rgb(0, 131, 143);

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
  }
`;
