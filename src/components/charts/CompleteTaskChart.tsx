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

// Function to get the week number from a date
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};

// Function to process tasks for completed tasks by week
const processCompletedTaskData = (tasks = []) => {
  if (!Array.isArray(tasks)) {
    console.error('Expected tasks to be an array, but got:', tasks);
    return [];
  }

  const completedTaskCount = {};
  tasks.forEach((task) => {
    if (task.completed) {
      const createdDate = new Date(task.createdAt);
      const weekNumber = getWeekNumber(createdDate);
      const year = createdDate.getFullYear();
      const weekKey = `${year}-W${weekNumber}`;
      completedTaskCount[weekKey] = (completedTaskCount[weekKey] || 0) + 1;
    }
  });
  return Object.entries(completedTaskCount).map(([weekKey, count]) => ({ weekKey, count }));
};

// Function to process tasks for completed tasks by month
const processCompletedTaskDataByMonth = (tasks = []) => {
  if (!Array.isArray(tasks)) {
    console.error('Expected tasks to be an array, but got:', tasks);
    return [];
  }

  const completedTaskCount = {};
  tasks.forEach((task) => {
    if (task.completed) {
      const createdDate = new Date(task.createdAt);
      const monthKey = `${createdDate.getFullYear()}-${createdDate.getMonth() + 1}`; // "YYYY-MM"
      completedTaskCount[monthKey] = (completedTaskCount[monthKey] || 0) + 1;
    }
  });
  return Object.entries(completedTaskCount).map(([monthKey, count]) => ({ weekKey: monthKey, count }));
};

// Function to process tasks for completed tasks by day
const processCompletedTaskDataByDay = (tasks = []) => {
  if (!Array.isArray(tasks)) {
    console.error('Expected tasks to be an array, but got:', tasks);
    return [];
  }

  const completedTaskCount = {};
  tasks.forEach((task) => {
    if (task.completed) {
      const createdDate = new Date(task.createdAt);
      const dayKey = createdDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
      completedTaskCount[dayKey] = (completedTaskCount[dayKey] || 0) + 1;
    }
  });
  return Object.entries(completedTaskCount).map(([dayKey, count]) => ({ weekKey: dayKey, count }));
};

const CompletedTasksChart = ({ tasks = [] }) => {
  const [timeframe, setTimeframe] = useState('week');

  let processedData;
  switch (timeframe) {
    case 'month':
      processedData = processCompletedTaskDataByMonth(tasks);
      break;
    case 'day':
      processedData = processCompletedTaskDataByDay(tasks);
      break;
    default:
      processedData = processCompletedTaskData(tasks);
  }

  const maxCount = Math.max(...processedData.map((data) => data.count), 0);
  const axisPadding = 2;

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

export default CompletedTasksChart;
