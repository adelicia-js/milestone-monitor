import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LoadingContainer, LoadingText } from "../ui/GenericStyles";
import { getMilestoneNumbers } from "@/app/api/dbfunctions";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Loader from "@/components/ui/Loader";
import { Inter } from "next/font/google";

ChartJS.register(ArcElement, Tooltip, Legend);

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

const StatsDoughNutChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statArr, setStatArr] = useState<(number | null)[]>([0, 0, 0, 0]);
  useEffect(() => {
    getMilestoneNumbers().then((data) => {
      setStatArr(data);
      setIsLoading(false);
    });
  }, []);

  const statsData = {
    labels: [
      `Conferences (${statArr[0] || 0})`,
      `Workshops (${statArr[1] || 0})`,
      `Journals (${statArr[2] || 0})`,
      `Patents (${statArr[3] || 0})`,
    ],
    datasets: [
      {
        label: "Attended/Published",
        data: statArr,
        backgroundColor: [
          "rgba(0, 187, 212, 0.45)",
          "rgba(139, 195, 74, 0.45)",
          "rgba(233, 30, 99, 0.45)",
          "rgba(156, 39, 176, 0.45)",
        ],
        borderColor: [
          "rgba(0, 188, 212, 0.5)",
          "rgba(139, 195, 74, 0.5)",
          "rgba(233, 30, 99, 0.5)",
          "rgba(156, 39, 176, 0.5)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(0, 188, 212, 0.75)",
          "rgba(139, 195, 74, 0.75)",
          "rgba(233, 30, 99, 0.75)",
          "rgba(156, 39, 176, 0.75)",
        ],
        hoverBorderColor: [
          "rgba(163, 220, 227, 0.5)",
          "rgba(205, 235, 171, 0.5)",
          "rgba(237, 155, 183, 0.5)",
          "rgba(227, 160, 239, 0.5)",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          color: "rgba(4, 103, 112, 0.99)",
          font: {
            size: 12,
          },
          boxWidth: 4,
          boxHeight: 6,
          padding: 15,
        },
      },
      animation: {
        animateScale: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Loader customHeight="h-fit" />
        <LoadingText>Loading your stats...</LoadingText>
      </LoadingContainer>
    );
  }

  // Check if all stats are zero or empty
  const hasData = statArr.some((stat) => stat && stat > 0);

  if (!hasData) {
    return (
      <EmptyDataContainer>
        <EmptyDataIcon>📊</EmptyDataIcon>
        <EmptyDataHeader>No Data Available</EmptyDataHeader>
        <EmptyDataDesc>
          Start adding your achievements to see statistics here
        </EmptyDataDesc>
      </EmptyDataContainer>
    );
  }

  return (
    <div
      style={{
        width: "80%",
        height: "80%",
        marginTop: "1.5rem",
      }}
    >
      <Doughnut data={statsData} options={options} />
    </div>
  );
};

export default StatsDoughNutChart;

const EmptyDataContainer = styled.div`
  font-family: ${bodyText.style.fontFamily};
  width: 80%;
  height: 80%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyDataIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const EmptyDataHeader = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.8);
  text-align: center;
`;

const EmptyDataDesc = styled.div`
  font-size: 0.875rem;
  color: rgba(107, 114, 128, 0.8);
  text-align: center;
  max-width: 50%
`;
