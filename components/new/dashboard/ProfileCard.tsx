"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";

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
      <ProfilePictureCard>
        {hasProfileImage && props.imageURL ? (
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
            <ProfileDetailText>{detail.label}</ProfileDetailText>
            <ProfileValueText>{detail.value}</ProfileValueText>
          </ProfileDetailTextBox>
        ))}
      </ProfileDetailsCard>
    </Card>
  );
}

const Card = styled.div`
  height: 100%;
  width: 50%;
  border: 0.1px solid rgba(56, 68, 68, 0.14);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.79);
  display: flex;
  flex-direction: row;
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
  width: 40%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px 0 rgba(48, 55, 55, 0.1);

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
  border: 0.1px solid rgba(56, 68, 68, 0.14);
  background-color: rgba(20, 154, 184, 0.1);
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 0.65fr 1.2fr;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 0.5rem;
  justify-content: space-between;
  box-shadow: 0 1px 4px 0 rgba(48, 55, 55, 0.1);

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
