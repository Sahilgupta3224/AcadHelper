import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "@/components/layout";
import "../app/globals.css";
import {
  sampleAssignments,
  sampleChapters,
  UserLoggedIn,
} from "../utils/Sample Data/Sample";
import Link from "next/link";
import {
  FilledTextFieldProps,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedTextFieldProps,
  Select,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditAssignmentModal from "@/components/EditAssignment";
import SidebarDrawer from "@/components/SidebarDrawer";
import { Dayjs } from "dayjs";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useStore } from "@/store";
import { useEffect } from "react";
import axios from "axios";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import toast, { Toaster } from "react-hot-toast";

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

export default function Courses() {
  const {user,setUser} = useStore()
  const [enrolledCourses,setEnrolledCourses] = React.useState([])
  const [adminCourses,setAdminCourses] = React.useState([])
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedChapter, setSelectedChapter] = React.useState(null);
  const [selectedAssignment, setSelectedAssignment] = React.useState(null);
  const [assignmentType, setAssignmentType] = React.useState("normal");
  const [dueDate, setDueDate] = React.useState<Dayjs | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [file, setFile] = React.useState<File|null>(null);
  const [open, setOpen] = React.useState(false);
  const [openJoin,setOpenJoin]=React.useState(false);
  const [value, setValue] = React.useState(0);
  const [courseInput,setCourseInput] = React.useState({name:"",description:"",userId:user._id})
  const [code,setCode] = React.useState("")
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCourseInput(prev => ({ ...prev, [name]: value }));
  };

  const handleJoinCourse = async(e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault()
    console.log(code)
      try {
        if(!code){
          toast.error("Course code cannot be empty")
          return
        }
    
        const {data} = await axios.post("/api/course",{code,userId:user._id})
  
        if (data.success) {
          console.log(data)
          setCourseInput({name:"",description:"",userId:user._id});
          handleCloseJoin()
  
        } else {

          console.error(data.error || "Course addition failed");
        }
      } catch (error) {
        toast.error(error.response.data.error)
        console.error("Error adding course", error);
      }
  }
  
  const handleAddCourse = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(courseInput)
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
          console.log(data)
          setCourseInput({name:"",description:"",userId:user._id});
          handleClose()
  
        } else {

          console.error(data.error || "Course addition failed");
        }
      } catch (error) {
        toast.error(error.response.data.error)
        console.error("Error adding course", error);
      }
    };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenJoin = () => setOpenJoin(true);
  const handleCloseJoin = () => setOpenJoin(false);

  useEffect(()=>{
    const fetchEnrolledCourse = async()=>{
      try{
        const {data} = await axios.post("/api/course/getCourses",{type:"enrolled",userId:user._id})
        if(data.success){
          setEnrolledCourses(data.courses)
        }
    }catch(e){
        console.log(e)
      }
    }
    const fetchAdminCourse = async()=>{
      try{
        const {data} = await axios.post("/api/course/getCourses",{type:"admin",userId:user._id})
        if(data.success){
          setAdminCourses(data.courses)
        }
    }catch(e){
        console.log(e)
      }
    }
    fetchEnrolledCourse()
    fetchAdminCourse()
  },[])

  console.log(enrolledCourses,adminCourses)

  // Toggle drawer function
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  // Sample data
  // const user = UserLoggedIn;
  const chapters = sampleChapters;
  const assignments = sampleAssignments;
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
        { enrolledCourses.length>0 ? enrolledCourses.map(course=>(
          <Link href = {`/user/Courses/${course._id}`}>
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
      { adminCourses.length>0 ? adminCourses.map(course=>(
          <Link href = {`/admin/Courses/${course._id}`}>
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
