"use client"
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import '../app/globals.css';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {useRouter} from "next/navigation"
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import mongoose from 'mongoose';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface Task {
  _id:mongoose.Schema.Types.ObjectId,
  title:String,
  completed:Boolean,
  color:String,
  course:String,
  dueDate:Date
}
const Dashboard = () => {
  const router = useRouter()

  const [taskInput,setTaskInput] = useState({title:"",color:"",course:"",dueDate:""})
  //CHANGE ITS INITIAL STATE TO REFLECT SELECTED TASK DETAILS
  const [editInput,setEditInput] = useState({title:"",color:"",course:"",dueDate:""})
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [age, setAge] = React.useState('');
  const [progress,setProgress] = useState(60)

  useEffect(()=>{
     const fetchTasks = async()=>{
      try{
        const userId="tempuserid"
        const {data} = await axios.get("/api/task",{params:{userId:userId}})
        if(data.success){
          setTasks(data.tasks)
          let len=data.tasks.length
          let array = data.tasks.filter((task:Task)=>task.completed==true)
          setProgress(array.length*100/len)
        }
      }catch(error){
        console.error("Error adding task:", error);
      }
     }
     fetchTasks()
  },[])

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setTaskInput(prev => ({ ...prev, [name]: value }));
  };

    // EDIT TASK INPUT
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      setEditInput(prev => ({ ...prev, [name]: value }));
    };
    

  const handleAddTask = async() => {
    try {
      // if(!taskInput.title)alert("Title cannot be empty")
      const userId = "your-user-id"; // Use actual user ID here

      const {data} = await axios.post("/api/task",{task:taskInput,userId:userId})

      if (data.success) {
        setTaskInput({ title: "", color: "", course: "", dueDate: "" });
        router.refresh(); // Optionally refresh or update tasks display

      } else {
        console.error(data.error || "Task addition failed");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async() => {
    try {

      const {data} = await axios.put("/api/task",{task:editInput})

      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });
        router.refresh(); // Optionally refresh or update tasks display

      } else {
        console.error(data.error || "Task edit failed");
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDeleteTask = async(id:mongoose.Schema.Types.ObjectId) => {
    try {
      const userID="replace-with-user-id"
      const {data} = await axios.delete("/api/task",{params:{taskId:id,userId:userID}})

      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });
        router.refresh(); // Optionally refresh or update tasks display

      } else {
        console.error(data.error || "Task edit failed");
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <Layout>
        <div className=''>
          <div className='bg-blue-300 m-4 w-96 rounded-md p-4 flex justify-between text-slate-200 font-bold text-xl'>
          <div>
          <div>Hi Khanak</div>
          <div>0 Tasks due today</div>
          </div>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant="determinate" value={progress} size="60px"/>
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ color: 'text.secondary' }}
                >{`${progress}%`}</Typography>
              </Box>
            </Box>
          </div>
          
          <div className='m-4 w-96'>
          <input 
          placeholder="Add Task" 
          name="title"
          value={taskInput.title}
          onChange={handleInputChange}
          className='bg-slate-200 p-2 rounded-md w-[87%] text-slate-600 outline-none'
          ></input>
          <button className='bg-slate-200 p-2 rounded-full h-10 w-10 ml-2' onClick={handleAddTask}>+</button>
          </div>
          <select 
          name="course" 
          value={taskInput.course}
          onChange={handleInputChange}
          className='p-2 ml-4 mb-4 bg-slate-200 rounded-md'>
            <option value="" disabled>Select Course</option>
            <option value="volvo">Course 1</option>
            <option value="saab">Course 2</option>
            <option value="opel">Course 3</option>
            <option value="audi">Course 4</option>
          </select>
          <select 
          name="color" 
          value={taskInput.color}
          onChange={handleInputChange}
          className='p-2 mb-4 mx-2 bg-slate-200 rounded-md'>
            <option value="black">⚫</option>
            <option value="red">🔴</option>
            <option value="yellow">🟡</option>
            <option value="green">🟢</option>
            <option value="purple">🟣</option>
            <option value="blue">🔵</option>
          </select>
          <input 
          type='date' 
          name="dueDate"
          value={taskInput.dueDate}
          onChange={handleInputChange}
          className='bg-slate-200 p-1 rounded-md'
          ></input>
          <div className='border-l-4 border-l-red-400  hover:bg-slate-100 w-96 p-2 ml-4 cursor-pointer' onClick={handleOpen}>
          <div className='flex'>
          <input type="checkbox"></input>
          <div className='px-2'>Task 1</div>
          </div>

          <div className='px-6 flex justify-between'>
            <div className='flex'>
            <div className='text-sm mr-4'>Course</div>
            
            </div>
            <div className='text-sm'>Due 1 Nov 2024</div>
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TextField id="standard-basic" label="" variant="standard" defaultValue="Task1"/>
              <div className='flex'>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 100, color:"black" }}>
                <InputLabel id="demo-simple-select-standard-label">Course</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={age}
                  onChange={handleChange}
                  label="Color"
                  defaultValue="Course 1"
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
               </FormControl>
               <FormControl variant="standard" sx={{ m: 1, minWidth: 120, color:"black" }}>
                <InputLabel id="demo-simple-select-standard-label">Color</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={age}
                  onChange={handleChange}
                  label="Color"
                  defaultValue="Course 1"
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
               </FormControl>
               <input 
                  type='date' 
                  name="dueDate"
                  value={taskInput.dueDate}
                  onChange={handleInputChange}
                  className='p-1 rounded-md'
                ></input>
                </div>
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue="Default Value"
                  variant="standard"
                  sx={{width:400}}
                />
              <div className='flex justify-between my-4'>
              <Button variant="outlined" startIcon={<DeleteIcon />} color="error">
                  Delete
              </Button>
              <Button variant="outlined" startIcon={<EditIcon />}>
                  Edit
              </Button>
              </div>

            </Box>
          </Modal>
          
        </div>
    </Layout>
  )
}

export default Dashboard