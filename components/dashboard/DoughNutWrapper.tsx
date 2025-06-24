import React, { useState, useEffect } from "react";
import { getMilestoneNumbers } from "@/app/api/dbfunctions";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughNutWrapper = () => {
  const [statArr, setStatArr] = useState<(number | null)[]>([0, 0, 0, 0]);
  useEffect(() => {
    getMilestoneNumbers().then((data) => {
      setStatArr(data);
    });
  }, []);

  const statsData = {
    labels: ["Conferences", "Workshops", "Journals", "Patents"],
    datasets: [
      {
        label: "Attended/Published",
        data: statArr,
        backgroundColor: ["#00838f81", "#689f3861", "#880e4f6e", "#691b9a7e"],
        borderColor: ["#00838fb2", "#689f38ca", "#880e4f91", "#691b9aa7"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'left' as const,
        labels: {
          usePointStyle: true,
          color: 'rgba(56, 68, 68, 0.6)',
          font: {
            size: 12
          },
          boxWidth: 4,
          boxHeight: 6
        },
      },
      animation: {
        animateScale: false,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return <Doughnut data={statsData} options={options} />;
};

export default DoughNutWrapper;
