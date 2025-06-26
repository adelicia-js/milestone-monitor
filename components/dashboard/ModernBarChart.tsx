import React, { useState, useEffect } from "react";
import { getMilestoneNumbers } from "@/app/api/dbfunctions";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModernBarChart = () => {
  const [statArr, setStatArr] = useState<(number | null)[]>([0, 0, 0, 0]);
  
  useEffect(() => {
    getMilestoneNumbers().then((data) => {
      setStatArr(data);
    });
  }, []);

  const createGradient = (ctx: CanvasRenderingContext2D, color1: string, color2: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  const statsData = {
    labels: ["Conferences", "Workshops", "Journals", "Patents"],
    datasets: [
      {
        label: "Milestones Achieved",
        data: statArr,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradients = [
            createGradient(ctx, '#00BCD4', '#00838F'),
            createGradient(ctx, '#8BC34A', '#689F38'),
            createGradient(ctx, '#E91E63', '#880E4F'),
            createGradient(ctx, '#9C27B0', '#6A1B9A')
          ];
          return gradients[context.dataIndex];
        },
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `Count: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 11,
            weight: '500',
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 11,
          },
          stepSize: 1,
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '1rem' }}>
      <Bar data={statsData} options={options} />
    </div>
  );
};

export default ModernBarChart;