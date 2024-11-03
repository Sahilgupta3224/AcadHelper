import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Button, ButtonGroup } from '@mui/material';

// Demo data
const demoPomodoroUsageData = [
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-27" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-27" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-28" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-28" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-29" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-30" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-30" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-31" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-10-31" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-11-01" },
  { pomodaroId: "pomodaro1", DateOfUse: "2024-11-01" },
  { pomodaroId: "pomodaro2", DateOfUse: "2024-10-27" },
  { pomodaroId: "pomodaro2", DateOfUse: "2024-10-29" },
  { pomodaroId: "pomodaro2", DateOfUse: "2024-11-01" },
  { pomodaroId: "pomodaro2", DateOfUse: "2024-11-01" },
  { pomodaroId: "pomodaro2", DateOfUse: "2024-11-01" },
];

// Function to get the week number from a date
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};

// Function to process data by week
const processDataByWeek = (data) => {
  const usageCount = {};
  data.forEach(entry => {
    const date = new Date(entry.DateOfUse);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const weekKey = `${year}-W${weekNumber}`; // Key format: "YYYY-W#"

    usageCount[weekKey] = (usageCount[weekKey] || 0) + 1;
  });

  return Object.entries(usageCount).map(([weekKey, count]) => ({ weekKey, count }));
};

// Function to process data by month
const processDataByMonth = (data) => {
  const usageCount = {};
  data.forEach(entry => {
    const date = new Date(entry.DateOfUse);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // Key format: "YYYY-MM"

    usageCount[monthKey] = (usageCount[monthKey] || 0) + 1;
  });

  return Object.entries(usageCount).map(([monthKey, count]) => ({ weekKey: monthKey, count }));
};

// Function to process data by day
const processDataByDay = (data) => {
  const usageCount = {};
  data.forEach(entry => {
    const date = new Date(entry.DateOfUse);
    const dayKey = date.toISOString().split('T')[0]; // Key format: "YYYY-MM-DD"

    usageCount[dayKey] = (usageCount[dayKey] || 0) + 1;
  });

  return Object.entries(usageCount).map(([dayKey, count]) => ({ weekKey: dayKey, count }));
};

const PomodoroUsageChart = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  let processedData;
  switch (timeframe) {
    case 'month':
      processedData = processDataByMonth(demoPomodoroUsageData);
      break;
    case 'day':
      processedData = processDataByDay(demoPomodoroUsageData);
      break;
    default:
      processedData = processDataByWeek(demoPomodoroUsageData);
  }

  const maxCount = Math.max(...processedData.map(data => data.count), 0); // Maximum count for Y axis
  const axisPadding = 2; // Padding for Y axis

  return (
    <div>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => setTimeframe('week')} color={timeframe === 'week' ? 'primary' : 'default'}>
          Per Week
        </Button>
        <Button onClick={() => setTimeframe('month')} color={timeframe === 'month' ? 'primary' : 'default'}>
          Per Month
        </Button>
        <Button onClick={() => setTimeframe('day')} color={timeframe === 'day' ? 'primary' : 'default'}>
          Per Day
        </Button>
      </ButtonGroup>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weekKey" />
          <YAxis domain={[0, maxCount + axisPadding]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PomodoroUsageChart;
