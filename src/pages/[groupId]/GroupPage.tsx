"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Pomodoro } from './Pomodoro';
import Layout from '@/components/layout';
import { Settings } from './Settings';
import { useParams } from 'next/navigation'


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function GroupPage() {
  const [value, setValue] = React.useState(0);
  const params = useParams<{ groupId:string }>()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pomodoro Timer" {...a11yProps(0)} />
          <Tab label="Challenges" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Pomodoro/>
        {/* Nice */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Group Challenges
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Settings/>
      </CustomTabPanel>
    </Box>
    </Layout>
  );
}
