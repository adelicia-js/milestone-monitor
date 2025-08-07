"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Courgette } from "next/font/google";
import { GenericHeader } from "@/components/ui/GenericStyles";

const fancyText = Courgette({
  weight: "400",
  subsets: ["latin"],
});

const greetings = [
  "What have you been up to? 🚀",
  "Ready to achieve greatness? ⭐",
  "Let's make today count! 💪",
  "Time to shine! ✨",
  "Your milestones await! 🎯",
  "Another day, another milestone! 🏆",
  "Keep pushing forward! 🔥",
  "Excellence is a habit! 💎",
  "Progress over perfection! 📈",
  "You've got this! 🌟",
];

export default function DashboardHeader({ userName }: { userName?: string }) {
  const [currentGreeting, setCurrentGreeting] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setCurrentGreeting(greetings[randomIndex]);
  }, []);

  return (
    <DashboardHeaderText>
      <span>Hey, {!userName && " you"}!</span>
      {userName && <span id="fancy-user-text">{userName ?? ""}!</span>}{" "}
      {currentGreeting && <span id="changing-greeting">{currentGreeting}</span>}
    </DashboardHeaderText>
  );
}

const DashboardHeaderText = styled(GenericHeader)`
  font-size: 1.05rem;
  position: absolute;
  top: 1.5rem;
  margin-left: 0.5%;
  text-transform: none;
  letter-spacing: 0;

  #fancy-user-text {
    font-family: ${fancyText.style.fontFamily};
  }

  #changing-greeting {
    display: inline-block;
    opacity: 0;
    animation: slideInFade 0.8s ease-out forwards;
    animation-delay: 0.3s;
  }

  @keyframes slideInFade {
    from {
      opacity: 0;
      transform: translateX(10px);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
      filter: blur(0);
    }
  }
`;
