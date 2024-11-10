import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Layout from "@/components/layout";
import '../../app/globals.css';

import {
  sampleAssignments,
  sampleChapters,
} from "@/utils/Sample Data/Sample";
import Auth from '@/components/Auth'
import Link from "next/link";
import {
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Dayjs } from "dayjs";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useStore } from "@/store";
import { useEffect } from "react";
import axios from "axios";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import toast, { Toaster } from "react-hot-toast";
import Course from "@/utils/Interfaces/coursesInterface";

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

  function Courses() {
  const {user,setUser} = useStore()
  const [enrolledCourses,setEnrolledCourses] = React.useState([])
  const [adminCourses,setAdminCourses] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [openJoin,setOpenJoin]=React.useState(false);
  const [value, setValue] = React.useState(0);
  const [courseInput,setCourseInput] = React.useState({name:"",description:"",userId:user?._id})
  const [code,setCode] = React.useState("")
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCourseInput(prev => ({ ...prev, [name]: value }));
  };

  // Join course
  const handleJoinCourse = async(e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault()
      try {
        if(!code){
          toast.error("Course code cannot be empty")
          return
        }
    
        const {data} = await axios.post("/api/course",{code,userId:user?._id})
  
        if (data.success) {
          setCourseInput({name:"",description:"",userId:user?._id});
          handleCloseJoin()
  
        }
      } catch (error:any) {
        toast.error(error.response.data.error)
      }
  }
  

  // Adding course
  const handleAddCourse = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
      try {
        if(!courseInput.name){
          toast.error("Course name cannot be empty")
          return
        }
        if(!courseInput.description){
          toast.error("Course description cannot be empty")
          return
        }
        const {data} = await axios.post("/api/course/createcourse",courseInput)
  
        if (data.success) {
          setCourseInput({name:"",description:"",userId:user?._id});
          handleClose()
  
        }
      } catch (error:any) {
        toast.error(error.response.data.error)
      }
    };


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenJoin = () => setOpenJoin(true);
  const handleCloseJoin = () => setOpenJoin(false);


  // Fetching enrolled and admin courses
  useEffect(()=>{
    const fetchEnrolledCourse = async()=>{
      try{
        const {data} = await axios.post("/api/course/getCourses",{type:"enrolled",userId:user?._id})
        if(data.success){
          setEnrolledCourses(data.courses)
        }
    }catch(e){
        toast.error("Failed to fetch courses")
      }
    }


    const fetchAdminCourse = async()=>{
      try{
        const {data} = await axios.post("/api/course/getCourses",{type:"admin",userId:user?._id})
        if(data.success){
          setAdminCourses(data.courses)
        }
    }catch(e){
        toast.error("Failed to fetch courses")
      }
    }
    fetchEnrolledCourse()
    fetchAdminCourse()
  },[])

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <Layout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Enrolled Courses" {...a11yProps(0)} />
          <Tab label="Admin Courses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="grid grid-cols-3 gap-4">
        { enrolledCourses.length>0 ? enrolledCourses.map((course:Course)=>(
          <Link key={course._id.toString()} href = {`/user/Courses/${course._id}`}>
              <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                title={course.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.name}
                </Typography>
              </CardContent>
              </Card>
              </Link>
        ))
         : (
          <div>
            You are not enrolled in any course yet
          </div>
         )
      }
      </div>

      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className="grid grid-cols-3 gap-4">
      { adminCourses.length>0 ? adminCourses.map((course:Course,idx)=>(
          <Link key={`${course._id}`+idx*2} href = {`/admin/Courses/${course._id}`}>
              <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="data:image/jpeg;base64,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"
                title={course.name}
             />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.name}
                </Typography>
              </CardContent>
              </Card>
              </Link>
        ))  : (
          <div>
            You are not the admin of any course yet 
          </div>
        )
      }
      </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
    <Fab color="primary" aria-label="add" sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
        }}
        onClick={value==1 ? handleOpen:handleOpenJoin}
        >
            <AddIcon />
        </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Course
          </Typography>
          <TextField id="outlined-basic-name" label="Course Name" name="name" variant="outlined"
          onChange={handleInputChange}
          />
          <TextField id="outlined-basic-name" label="Description" name="description" multiline rows={3} variant="outlined"
          onChange = {handleInputChange}
          />
          <div className='w-full mt-4 flex justify-end' ><Button type="button" onClick = {handleAddCourse}>Create</Button></div>
        </Box>
      </Modal>
      <Modal
        open={openJoin}
        onClose={handleCloseJoin}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Join Course
          </Typography>
          <TextField id="outlined-basic-name" label="Course Name" name="name" variant="outlined"
          onChange={(e)=>setCode(e.target.value)}
          />
          <div className='w-full mt-4 flex justify-end'><Button type="button" onClick = {handleJoinCourse}>Join</Button></div>
        </Box>
      </Modal>
      <Toaster/>
    </Layout>
  );
}

export default Auth(Courses)