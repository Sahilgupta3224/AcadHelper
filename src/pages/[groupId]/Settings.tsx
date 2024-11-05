// "use client"
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
  //DELETE THIS LATER
  const group = {
    _id:1234,
    leader:1234,
    maxteamsize:5,
    teamname:"group1",
    description:"nice group"
  }
  
export const Settings = () => {
    const params = useParams<{ groupId:string }>()
    const router = useRouter()
    const {user,setUser} = useStore()
    const [input,setInput] = useState("")
    const [team,setTeam] = useState({})
    const [groupInput,setGroupInput] = useState({maxteamsize:0,teamname:"",description:""})
    const [members,setMembers] = useState([])
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
    console.log(groupInput)
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const [openLeave, setOpenLeave] = useState(false);
    const handleOpenLeave = () => setOpenLeave(true);
    const handleCloseLeave = () => setOpenLeave(false);


    useEffect(()=>{
      const fetchTeam = async()=>{
        try{
          const res = await axios.get(`/api/team/${params.groupId}`,{params:{type:"Team"}})
          console.log(res?.data?.team)
          setTeam(res?.data?.team)
          setGroupInput({maxteamsize:res?.data?.team.maxteamsize,teamname:res?.data?.team.teamname,description:res?.data?.team.description})

        }catch(e){
          console.log(e)
        }
      }
      fetchTeam()
    },[])
  

    //  Fetching group members
    useEffect(()=>{
        const fetchGroupMembers = async()=>{
         try{
           const {data} = await axios.get(`/api/team/${params?.groupId}`,{params:{type:"Members"}})
          //  console.log(data)
          
           if(data.success){
                setMembers(data.members)
           }
         }catch(error){
           console.error("Error fetching group members:", error);
         }
        }
        fetchGroupMembers()
     },[])

    //Leave a group
    const handleLeave = async()=>{
       try{
        const res = await axios.delete(`/api/team/${params?.groupId}`,{params:{userId:user._id,groupId:params?.groupId}})
        if(res.data.success){
            router.push('/Groups')
            toast.success(res.data.message)
            console.log("Group left successfully",res.data.updatedUser)
        }

       }catch(e){
            console.log("Error leaving group",e)
       }
    }

    //Delete a group(by group admin)
    const handleDelete = async()=>{
        try{
            if(user._id!=team.leader){
                alert("You are not authorised to delete this group")
                return
            }
            const res = await axios.delete("/api/team",{params:{teamId:team._id}})
            if(res.data.success){
                console.log("Group deleted successfully",res.data.oldGroup)
                toast.success("Group deleted successfully")
                router.push('/Groups')
            }

        }catch(e){
            console.log("Error deleting group",e)
        }
    }
    console.log(team)

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
          
            if (isNaN(groupInput.maxteamsize) || groupInput.maxteamsize <= 0) {
                  toast.error("Maximum group size must be a positive integer");
                  return;
             }
            
             if(!Number.isInteger(Number(groupInput.maxteamsize))){
              toast.error("Maximum group size must be a positive integer");
              return;
             }
          
            if(groupInput){
                const res = await axios.put(`/api/team/${team._id}`,{team:groupInput})
                 if(res.data.success){
                  toast.success("Group edited successfully")
                  console.log("Group edited successfully",res.data.updatedTeam)
                  handleCloseEdit()
                }
            }
           }catch(e:any){
            toast.error(e.response.data.error)
            console.log(e)
           }
    }

    const handleAddMember = async()=>{
       try{
        if(input){
            const res = await axios.post(`/api/team/${params?.groupId}`,{email:input})
             if(res.data.success){
                toast.success("Invitation sent")
                console.log("Invitation sent",res.data.updatedTeam)
                handleClose()
                
            }
            // console.log(res.data)
        }
        else{
          toast.error("Field cannot be empty")
          return
        }

       }catch(e){
        console.log(e)
         toast.error(e.response.data.error)
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
          {members.map(member=>(
            <ListItem disablePadding id = {member._id}>
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
          <TextField id="outlined-basic-name" name="teamname" defaultValue={team.teamname} label="Group Name" variant="outlined" sx={{marginRight:"1rem"}}
          onChange={handleEditInputChange}
          />
          <TextField id="outlined-basic-name" name="maxteamsize" defaultValue={team.maxteamsize} label="Size limit" variant="outlined"
          onChange = {handleEditInputChange}
          />
          </div>
          <TextField id="outlined-basic-desc" name="description" defaultValue={team.description} label="Group Description" variant="outlined" multiline rows={4} sx={{width:"100%"}}
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

