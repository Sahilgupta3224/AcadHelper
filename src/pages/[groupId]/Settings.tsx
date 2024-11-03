import Layout from '@/components/layout'
import {useState} from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Avatar from '@mui/material/Avatar';
import { Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const group = {
    _id:1234,
    leader:1234,
    maxteamsize:5,
    teamname:"group1",
    description:"nice group"
  }
export const Settings = () => {
    const [input,setInput] = useState("")
    const [groupInput,setGroupInput] = useState(group)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setInput(e.target.value);
    };
    // For edit group
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleEditInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setGroupInput(prev => ({ ...prev, [name]: value }));
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const [openLeave, setOpenLeave] = useState(false);
    const handleOpenLeave = () => setOpenDelete(true);
    const handleCloseLeave = () => setOpenDelete(false);

    //Leave a group
    const handleLeave = async()=>{
       try{
        let user={_id:123}
        const res = await axios.delete(`/api/team/${group._id}`,{params:{userId:user._id}})
        if(res.data.success){
            console.log("Group left successfully",res.data.updatedUser)
        }

       }catch(e){
            console.log("Error leaving group",e)
       }
    }

    //Delete a group(by group admin)
    const handleDelete = async()=>{
        try{
            
            let user={_id:123}
            if(user._id!=group.leader){
                alert("You are not authorised to delete this group")
                return
            }
            const res = await axios.delete("/api/team",{params:{teamId:group._id}})
            if(res.data.success){
                console.log("Group deleted successfully",res.data.oldGroup)
            }

        }catch(e){
            console.log("Error deleting group",e)
        }
    }

    // Fetching group members->UNCOMMENT WHEN NEEDED
    // useEffect(()=>{
    //     const fetchGroupMembers = async()=>{
    //      try{
    //        
    //        const {data} = await axios.get("/api/team",{params:{teamId:group._id}})
    //        if(data.success){
    //          setMembers(data.members)
    //        }
    //      }catch(error){
    //        console.error("Error fetching group members:", error);
    //      }
    //     }
    //     fetchGroupMembers()
    //  },[])

    //Edit group details
    const handleEditGroup = async()=>{
        try{
            //take these values as props AND CHANGE TEAM SIZE VARIABLE
            const team = {}
            if(groupInput){
                const res = await axios.put(`/api/team/${group._id}`,{team:groupInput})
                 if(res.data.success){
                    console.log("Group edited successfully",res.data.updatedTeam)
                }
            }
           }catch(e){
            console.log(e)
           }
    }

    const handleAddMember = async()=>{
       try{
        //take these values as props AND CHANGE TEAM SIZE VARIABLE
        const teamid = "team-id"
        const groupname = "group-name"
        const teamsize = 1//<-CALCULATE THIS FROM MEMBERS.LENGTH
        const maxteamsize = 2

        if(teamsize==group.maxteamsize){
            alert("Maximum team limit reached");
            return
        }
        if(input){
            const res = await axios.post(`/api/team/${group._id}`,{email:input,groupName:group.teamname})
             if(res.data.success){
                console.log("Member added successfully",res.data.updatedTeam)
            }
        }
        

       }catch(e){
        console.log(e)
       }
    }

  return (
    <>
    Members<Button variant="outlined" onClick={handleOpen}>Add member</Button>
    {/* EDIT AND DELETE SHOULD ONLY BE VISIBLE TO THE GROUP LEADER */}
    <Button variant="outlined" onClick={handleOpenEdit}>Edit Group</Button>
    <Button variant="outlined" onClick={handleOpenDelete}>Delete Group</Button>
    <Button variant="outlined" onClick={handleOpenLeave}>Leave Group</Button>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemIcon>
              <ListItemText primary="Sahil" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemIcon>
              <ListItemText primary="Shikhar" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
     
    </Box>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Member 
          </Typography>
          <TextField id="outlined-basic-name" label="Email" variant="outlined" sx={{marginTop:"2rem",width:"100%"}}
          onChange={handleInputChange}
          />
          <div className='w-full mt-4 flex justify-end' ><Button onClick = {handleAddMember} variant="outlined">Invite</Button></div>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Group
          </Typography>
          <div className='flex my-4'>
          <TextField id="outlined-basic-name" label="Group Name" variant="outlined" sx={{marginRight:"1rem"}}
          onChange={handleEditInputChange}
          />
          <TextField id="outlined-basic-name" label="Size limit" variant="outlined"
          onChange = {handleEditInputChange}
          />
          </div>
          <TextField id="outlined-basic-desc" label="Group Description" variant="outlined" multiline rows={4} sx={{width:"100%"}}
          onChange={handleEditInputChange}/>
          <div className='w-full mt-4 flex justify-end' onClick = {handleEditGroup}><Button>Edit</Button></div>
        </Box>
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete this group? 
          </Typography>
          <div className='w-full mt-4 flex justify-end' ><Button onClick = {handleDelete} variant="outlined">Delete</Button></div>
        </Box>
      </Modal>
      <Modal
        open={openLeave}
        onClose={handleCloseLeave}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to leave this group? 
          </Typography>
          <div className='w-full mt-4 flex justify-end' ><Button onClick = {handleLeave} variant="outlined">Delete</Button></div>
        </Box>
      </Modal>
    </>
)
}
