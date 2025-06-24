"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface ProfileCardProps {
  imageURL: string;
  name: string;
  department: string;
  facultyRole: string;
  facultyID: string;
}

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
          <ProfileImage
            src={props.imageURL}
            alt="Profile picture"
          />
        ) : (
          <PlaceholderContainer>
            <svg width="120" height="120" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="14" fill="rgba(56, 68, 68, 0.2)"/>
              <path d="M16 70C16 58 26.745 48 40 48C53.255 48 64 58 64 70" fill="rgba(56, 68, 68, 0.2)"/>
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
  padding: 1.5rem;
  gap: 1rem;
`;

const ProfilePictureCard = styled.div`
  height: 100%;
  width: 40%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgba(244, 253, 252, 0.5);
  border-radius: 0.5rem;
`

const ProfileDetailsCard = styled.div`
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0 1rem;
`;

const ProfileDetailTextBox = styled.div`
  height: 5vh;
  width: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.14);
  background: rgba(255, 255, 255, 0.56);
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 0.65fr 1.2fr;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 0.5rem;
`;

const ProfileDetailText = styled.span`
  font-size: 0.75rem;
`;

const ProfileValueText = styled(ProfileDetailText)`
  font-size: 0.75rem;
  font-weight: 600;
`;
