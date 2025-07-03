import styled from "styled-components";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

export const GenericCard = styled.div`
  position: relative;
  height: 100%;
  width: 50%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  display: flex;
  flex-direction: row;
`

export const GenericHeaderContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 1rem;
  left: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

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

export const GenericHeader = styled.p`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(4, 103, 112, 0.99);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-shadow: 0.1px 0.1px 2px rgba(47, 227, 227, 0.45);

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    font-size: 1rem;
  }
`;
