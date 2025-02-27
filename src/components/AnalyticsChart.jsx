﻿import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from './theme';
import Chart from 'chart.js/auto';
import { useUser } from '@clerk/clerk-react';
function AnalyticsChart() {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const storedProfile = localStorage.getItem('studentProfile'+user.firstName);
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      let grades = profile.academicProfile?.currentGrades;
      
      if (Array.isArray(grades)) {
        // Join array into a string, then process it
        grades = grades.join(', ');
      }
      
      if (typeof grades === 'string') {
        // Convert the string format "subject-score" into an object
        const gradeEntries = grades.split(/,\s*|\n/)
          .map(entry => entry.split('-').map(item => item.trim()))
          .filter(entry => entry.length === 2 && !isNaN(entry[1])); // Remove invalid entries

        grades = Object.fromEntries(gradeEntries);
      }
      
      if (!grades || Object.keys(grades).length === 0) {
        setChartData({ labels: [], datasets: [] });
        return;
      }
      
      const labels = Object.keys(grades);
      const scores = Object.values(grades).map(score => parseInt(score, 10) || 0);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Score',
            data: scores,
            backgroundColor: darkMode ? 'rgba(75, 192, 192, 1)' : 'rgba(53, 162, 235, 1)',
          },
        ],
      });
    }
  }, [darkMode]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
      },
      title: {
        display: true,
        text: 'Your Progress',
        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: darkMode ? '#000000' : '#ffffff',
        bodyColor: darkMode ? '#000000' : '#ffffff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Analytics</h2>
      {chartData.labels.length > 0 ? (
        <Bar options={options} data={chartData} />
      ) : (
        <div className='flex flex-row gap-2 items-center'>

        <p className="text-gray-600 dark:text-gray-400">No data available</p>
        <p className='text-xl text-blue-500 font-bold dark:text-gray-400'>{user.firstName}</p>
        </div>
      )}
    </div>
  );
}

export default AnalyticsChart;
