"use client"
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useStore } from '@/store';
import { useEffect } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function Notification() {
  const {user,setUser} = useStore()
  const handleAccept = ()=>{

  }

  const handleReject = ()=>{
    
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton size="large" color="inherit" onClick={handleClick}>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
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
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {user?.inbox?.map(notif=>(
            <ListItem>
            <ListItemAvatar>
            <Avatar>
                <GroupsIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={notif.message} secondary={new Date(notif.date).toISOString().split('T')[0]} />
            <div><CheckCircleOutlineIcon color="success" sx={{cursor:"pointer"}} onClick={handleAccept}/><CancelOutlinedIcon color="error" sx={{cursor:"pointer"}} onClick={handleReject}/></div>
          </ListItem>
        ))}
    </List>
      </Popover>
    </div>
  );
}
