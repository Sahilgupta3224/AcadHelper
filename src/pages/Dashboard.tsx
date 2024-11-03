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
import Timer from '@/components/Timer';

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

  // useEffect(()=>{
  //    const fetchTasks = async()=>{
  //     try{
  //       const userId="tempuserid"
  //       const {data} = await axios.get("/api/task",{params:{userId:userId}})
  //       if(data.success){
  //         setTasks(data.tasks)
  //         let len=data.tasks.length
  //         let array = data.tasks.filter((task:Task)=>task.completed==true)
  //         setProgress(array.length*100/len)
  //       }
  //     }catch(error){
  //       console.error("Error adding task:", error);
  //     }
  //    }
  //    fetchTasks()
  // },[])

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
      {/* <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Task Management Dashboard
        </Typography>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {["pending", "completed"].map((status) => (
              <Grid item xs={6} key={status}>
                <Typography variant="h6">
                  {status === "pending" ? "Pending Tasks" : "Completed Tasks"}
                </Typography>

                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 200,
                        padding: 1,
                        backgroundColor: "#f4f4f4",
                        borderRadius: 1,
                      }}
                    >
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: 2,
                                  marginBottom: 1,
                                  backgroundColor: "#ffffff",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {task.title}
                                </Typography>
                                {isEditing === task.id ? (
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                  />
                                ) : (
                                  <Typography variant="body2">
                                    {task.description}
                                  </Typography>
                                )}

                                <Box
                                  display="flex"
                                  justifyContent="flex-end"
                                  gap={1}
                                  mt={1}
                                >
                                  {isEditing === task.id ? (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleSaveEdit(task.id)}
                                    >
                                      Save
                                    </Button>
                                  ) : (
                                    <IconButton
                                      onClick={() => handleEdit(task)}
                                      size="small"
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={() => handleDelete(task.id)}
                                    size="small"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Box> */}
       <DndExample />

    </Layout>
  );
}

export default Dashboard;
 