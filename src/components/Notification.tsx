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
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Notification() {
  const {user,setUser} = useStore()
  const handleInvite = async(approval:Boolean,mail)=>{
      try{
        const {data} = await axios.post("/api/team/invitation",{approval,userId:user._id,teamId:mail.teamId,mail})
        console.log(data) 
        // setUser((prevUser) => ({
        //   ...prevUser,
        //   inbox: prevUser.inbox.filter((notif) => notif._id !== mail._id),
        // }));
        toast.success(data.message)
    }catch(e){
        toast.error(e.response.data.error)
        console.log(e)
      }
  }
  console.log(user.inbox)

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
        {user?.inbox?.length>0 ? user.inbox.map(notif=>(
            <ListItem>
            <ListItemAvatar>
            <Avatar>
                <GroupsIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={notif.message} secondary={new Date(notif.date).toISOString().split('T')[0]} />
            <div><CheckCircleOutlineIcon color="success" sx={{cursor:"pointer"}} onClick={()=>handleInvite(true,notif)}/><CancelOutlinedIcon color="error" sx={{cursor:"pointer"}} onClick={()=>handleInvite(false,notif)}/></div>
          </ListItem>
        )):(
          <div>
            You have no notifications
          </div>
        )}
    </List>
      </Popover>
    </div>
  );
}
