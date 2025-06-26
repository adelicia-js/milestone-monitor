"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {
  GenericCard,
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";

interface ProfileCardProps {
  imageURL: string;
  name: string;
  department: string;
  facultyRole: string;
  facultyID: string;
}

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function ProfileCard(props: ProfileCardProps) {
  const [hasProfileImage, setHasProfileImage] = useState(false);

  useEffect(() => {
    if (props.imageURL) {
      setHasProfileImage(true);
    }
  }, [props.imageURL]);

  const profileDetails = [
    { label: "Name", value: props.name ?? "New Faculty" },
    { label: "Department", value: props.department ?? "General" },
    { label: "Faculty Role", value: props.facultyRole ?? "Staff" },
    { label: "Faculty ID", value: props.facultyID ?? "TBD" },
  ];

  return (
    <Card>
      <GenericHeaderContainer>
        <GenericHeader>Your Profile</GenericHeader>
      </GenericHeaderContainer>
      <ProfilePictureCard>
        {hasProfileImage ? (
          <ProfileImage src={props.imageURL} alt="Profile picture" />
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

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
  }
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

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    height: 100%;
  }

  @media (min-width: 1025px) {
    height: 80%;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
  }
`;

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 154, 184, 0.1);
  border-radius: 0.5rem;

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
  }
`;

const ProfileDetailsCard = styled.div`
  margin-top: 1.5rem;
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 1rem;

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
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

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
  }
`;

const ProfileDetailText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(0, 131, 143, 0.6);

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    font-size: 0.85rem;
  }
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
