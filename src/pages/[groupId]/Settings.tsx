"use client"
import Layout from '@/components/layout'
import {useState,useEffect} from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { useStore } from '@/store';
import Team from '@/utils/Interfaces/teamInterface';
import User from '@/utils/Interfaces/userInterface';
import Auth from '@/components/Auth'
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
  
export const Settings = () => {
    const router = useRouter()
    const params = useParams();
    const {user,setUser} = useStore()
    const [input,setInput] = useState("")
    const [team,setTeam] = useState<Team|null>(null)
    const [groupInput,setGroupInput] = useState({maxteamsize:0,teamname:"",description:""})
    const [members,setMembers] = useState<User[]>([])
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
    const handleOpenLeave = () => setOpenLeave(true);
    const handleCloseLeave = () => setOpenLeave(false);

    // Fetching group details
    useEffect(()=>{
      const fetchTeam = async()=>{
        try{
          const res = await axios.get(`/api/team/${params?.groupId}`,{params:{type:"Team"}})
          setTeam(res?.data?.team)
          setGroupInput({maxteamsize:res?.data?.team.maxteamsize,teamname:res?.data?.team.teamname,description:res?.data?.team.description})

        }catch(e:any){
          toast.error(e.response.data.error)
        }
      }
      fetchTeam()
    },[])
  

    //  Fetching group members
    useEffect(()=>{
        const fetchGroupMembers = async()=>{
         try{
           const {data} = await axios.get(`/api/team/${params?.groupId}`,{params:{type:"Members"}})
           if(data.success){
                setMembers(data.members)
                toast.success("Loaded members")
           }
         }catch(e:any){
          toast.error(e.response.data.error)
         }
        }
        fetchGroupMembers()
     },[])

    //Leave a group
    const handleLeave = async()=>{
       try{
        const res = await axios.delete(`/api/team/${params?.groupId}`,{params:{userId:user?._id,groupId:params?.groupId}})
        if(res.data.success){
            router.push('/Groups')
            toast.success("Group left successfully")
        }
       }catch(e:any){
            toast.error(e.response.data.error);
       }
    }

    //Delete a group(by group admin)
    const handleDelete = async()=>{
        try{
            if(user?._id!=team?.leader.toString()){
                toast.error("You are not authorised to delete this group")
                return
            }
            const res = await axios.delete("/api/team",{params:{teamId:team?._id}})
            if(res.data.success){
                toast.success("Group deleted successfully")
                router.push('/Groups')
            }

        }catch(e:any){
            toast.error(e.response.data.error)
        }
    }

    //Edit group details
    const handleEditGroup = async()=>{
        try{
            if(!groupInput.teamname){
              toast.error("Group name cannot be empty")
              return
          }
            if(!groupInput.maxteamsize){
              toast.error("Maximum group size cannot be empty")
              return
          }
          
            if (isNaN(groupInput.maxteamsize) || groupInput.maxteamsize <= 0 ||groupInput.maxteamsize<=10) {
                  toast.error("Maximum group size must be a positive integer and should be less than or equal to 10");
                  return;
             }
            
             if(!Number.isInteger(Number(groupInput.maxteamsize))){
              toast.error("Maximum group size must be a positive integer <=10");
              return;
             }
          
            if(groupInput){
                const res = await axios.put(`/api/team/${team?._id}`,{team:groupInput})
                 if(res.data.success){
                  toast.success("Group edited successfully")
                  handleCloseEdit()
                }
            }
           }catch(e:any){
            toast.error(e.response.data.error)
           }
    }
    
    // Add member to group
    const handleAddMember = async()=>{
       try{
        if(input){
            const res = await axios.post(`/api/team/${params?.groupId}`,{email:input})
             if(res.data.success){
                toast.success("Invitation sent")
                handleClose()
            }
        }
        else{
          toast.error("Field cannot be empty")
          return
        }

       }catch(e:any){
         toast.error(e.response.data.error)
       }
    }
    

  return (
    <>
   <div className='flex justify-evenly'>
    
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
      <Typography id="modal-modal-title" variant="h6" component="h2">
         Members
      </Typography>


        <List>
          {members.map(member=>(
            <ListItem key={member._id} disablePadding id = {member._id}>
            <ListItemButton>
              <ListItemIcon>
              <Avatar alt={member.username} src="/static/images/avatar/2.jpg" />
              </ListItemIcon>
              <ListItemText primary={member?.username} />
            </ListItemButton>
          </ListItem>
          ))}
        </List>
      </nav>
     
    </Box>
    {team?.leader.toString()==user?._id ?(
    <div className='flex flex-col w-40 '>
    <Button variant="outlined" onClick={handleOpen}>Add member</Button>
    <Button variant="outlined" onClick={handleOpenEdit} sx={{marginY:"10px"}}>Edit Group</Button>
    <Button variant="outlined" onClick={handleOpenDelete} color='error'>Delete Group</Button>
    </div>
    ):(
    <Button variant="outlined" onClick={handleOpenLeave} color="error" sx={{height:"3rem"}}>Leave Group</Button>
    )
    }
    </div>

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
          <TextField id="outlined-basic-name" name="teamname" defaultValue={team?.teamname} label="Group Name" variant="outlined" sx={{marginRight:"1rem"}}
          onChange={handleEditInputChange}
          />
          <TextField id="outlined-basic-name" name="maxteamsize" defaultValue={team?.maxteamsize} label="Size limit" variant="outlined"
          onChange = {handleEditInputChange}
          />
          </div>
          <TextField id="outlined-basic-desc" name="description" defaultValue={team?.description} label="Group Description" variant="outlined" multiline rows={4} sx={{width:"100%"}}
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
          <div className='w-full mt-4 flex justify-end' ><Button onClick = {handleLeave} variant="outlined">Leave</Button></div>
        </Box>
      </Modal>
      <Toaster />
    </>
)
}

export default Auth(Settings)