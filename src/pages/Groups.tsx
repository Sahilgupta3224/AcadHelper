import Layout from '@/components/layout'
import {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../app/globals.css'
import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

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
const Groups = () => {
    const router = useRouter()

    const [groups,setGroups] = useState([])
    const [groupInput,setGroupInput] = useState({leader:"user-id",maxteamsize:5,teamname:"",description:""})
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setGroupInput(prev => ({ ...prev, [name]: value }));
    };

    // Fetching all groups of a user
    // useEffect(()=>{
    //     const fetchGroups = async()=>{
    //      try{
    //        const userId="tempuserid"
    //        const {data} = await axios.get("/api/team",{params:{userId:userId}})
    //        if(data.success){
    //          setGroups(data.teams)
    //        }
    //      }catch(error){
    //        console.error("Error fetching groups:", error);
    //      }
    //     }
    //     fetchGroups()
    //  },[])

    const handleAddGroup = async() => {
        try {
          if(!groupInput.teamname){
            alert("Group name cannot be empty")
            return
        }
          if(!groupInput.maxteamsize){
            alert("Maximum group size cannot be empty")
            return
        }
          if (isNaN(groupInput.maxteamsize) || groupInput.maxteamsize <= 0) {
                alert("Maximum group size must be a positive number");
                return;
           }
          
          const userId = "your-user-id"; // Use actual user ID here
    
          const {data} = await axios.post("/api/team",{team:groupInput,userId:userId})
    
          if (data.success) {
            setGroups(data.teams)
            setGroupInput({leader:"user-id",maxteamsize:5,teamname:"",description:""});
            router.refresh(); // Optionally refresh or update groups display
    
          } else {
            console.error(data.error || "Group addition failed");
          }
        } catch (error) {
          console.error("Error adding group", error);
        }
      };

  return (
    <Layout>
        <div className="font-bold text-2xl m-4">Groups</div>
        <div className='grid grid-cols-3'>
           <Link href="/123/GroupPage"> <Card sx={{ maxWidth: 345,margin:"2rem" }}>
            <CardMedia
                sx={{ height: 140 }}
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGK3diR3Zi-mnOXEaj-3ewmFyRYVxGzVzZw&s"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Group 1
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                 Khanak, Sahil, Shikhar
                </Typography>
            </CardContent>
            </Card>
            </Link>
        </div>
        <Fab color="primary" aria-label="add" sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
        }}
        onClick={handleOpen}
        >
            <AddIcon />
        </Fab>
        <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Group 
          </Typography>
          <div className='flex my-4'>
          <TextField id="outlined-basic-name" label="Group Name" variant="outlined" sx={{marginRight:"1rem"}}
          onChange={handleInputChange}
          />
          <TextField id="outlined-basic-name" label="Size limit" variant="outlined"
          onChange = {handleInputChange}
          />
          </div>
          <TextField id="outlined-basic-desc" label="Group Description" variant="outlined" multiline rows={4} sx={{width:"100%"}}
          onChange={handleInputChange}/>
          <div className='w-full mt-4 flex justify-end' onClick = {handleAddGroup}><Button>Add</Button></div>
        </Box>
      </Modal>
    </div>
    
    </Layout>
  );
};

export default Groups;