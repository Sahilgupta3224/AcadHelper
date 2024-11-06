"use client"
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from 'axios';
import toast from 'react-hot-toast';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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


export default function Fire() {
  const {user,setUser} = useStore()
  const [daily,setDaily] = useState([])
  const [weekly,setWeekly] = useState([])
  useEffect(()=>{
    const fetchDaily = async()=>{
      try{
        const {data} = await axios.post("/api/challenge/get-challengeByFreq",{frequency:"daily",userId:user._id})
        if(data.success){
          setDaily(data.data)
        }
    }catch(e){
        console.log(e)
      }
    }
    const fetchWeekly = async()=>{
      try{
        const {data} = await axios.post("/api/challenge/get-challengeByFreq",{frequency:"weekly",userId:user._id})
        if(data.success){
          setDaily(data.data)
        }
    }catch(e){
        console.log(e)
      }
    }
    fetchDaily()
    fetchWeekly()
  },[])
  console.log(daily,weekly)
  

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <IconButton size="large" color="inherit" onClick={handleClick}>
              <Badge badgeContent={17} color="error">
                <LocalFireDepartmentIcon />
              </Badge>
            </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
          <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Daily challenge" {...a11yProps(0)} />
              <Tab label="Weekly challenge" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            Item One
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
        </Box>
    {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {user?.inbox?.length>0 ? user.inbox.map(notif=>(
            <ListItem>
            <ListItemAvatar>
            <Avatar>
                <GroupsIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={notif.message} secondary={new Date(notif.date).toISOString().split('T')[0]} />
            {notif.type == "group invite" && <div>
              <CheckCircleOutlineIcon color="success" sx={{cursor:"pointer"}} onClick={()=>handleInvite(true,notif)}/>
              <CancelOutlinedIcon color="error" sx={{cursor:"pointer"}} onClick={()=>handleInvite(false,notif)}/>
            </div>}
          </ListItem>
        )):(
          <div>
            You have no notifications
          </div>
        )}
    </List> */}
      </Popover>
    </div>
  );
}
