"use client"
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import '../app/globals.css';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from "next/navigation"
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Auth from '@/components/Auth'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import mongoose from 'mongoose';
import Timer from '@/components/Timer';
import { useStore } from '@/store';
import toast, { Toaster } from 'react-hot-toast';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Assignment from '@/Interfaces/assignment';

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
  _id: mongoose.Schema.Types.ObjectId,
  title: string,
  completed: boolean,
  color: string,
  course: string,
  dueDate: Date
}
const Dashboard = () => {
  const router = useRouter()
  const { user, setUser } = useStore()
  const [courses, setCourses] = useState([])
  const [pendingassignment, setpendingassignment] = useState<Assignment | null>(null);
  const [taskInput, setTaskInput] = useState({ title: "", color: "", course: "", dueDate: "", completed: false })
  const [editInput, setEditInput] = useState({ title: "", color: "", course: "", dueDate: "" })
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [progress, setProgress] = useState<Float>(0)
  const [selected, setSelected] = useState(null)
  const handleOpen = (task: any) => {
    setSelected(task)
    setEditInput({
      title: task.title,
      color: task.color,
      course: task.course,
      dueDate: task.dueDate,
    });
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const [dueTodayCount, setDueTodayCount] = useState(0);

  // Function to calculate the number of tasks due today
  const calculateDueTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return ((dueDate.getTime() === today.getTime()) && !task.completed);
    }).length;

    setDueTodayCount(count);
  };

  // useEffect to recalculate due today count on tasks change
  useEffect(() => {
    calculateDueTodayCount();
  }, [tasks]);


  useEffect(() => {
    const fetchTasks = async () => {
      try {

        const { data } = await axios.get("/api/task", { params: { userId: user._id } })
        if (data.success) {

          setTasks(data.tasks)
          if (data.tasks.length > 0) {
            let len = data.tasks.length
            let array = data.tasks.filter((task: Task) => task.completed == true)
            setProgress(Math.round(array.length * 100 * 100 / len) / 100)
          } else setProgress(0)
          console.log(data)
        }
      } catch (error) {
        toast.error(error.response.data.error)
        // console.error("Error fetching task:", error);
      }
    }
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`/api/course?userId=${user._id}`)
        if (data.success) {
          setCourses(data.courses)
          console.log(data)
        }
      } catch (error) {
        toast.error("Error fetching courses:", error.response.data.message);
      }
    }
    const fectchpendingassignments = async () => {
      try {
        const res = await axios.get(`/api/assignment/getpendingassignments-of-user?userId=${user._id}`)
        console.log(res.data.data)
        setpendingassignment(res.data.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchTasks()
    fetchCourses()
    fectchpendingassignments()
  }, [])

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setTaskInput(prev => ({ ...prev, [name]: value }));
  };
  // console.log(taskInput)
  // EDIT TASK INPUT
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setEditInput(prev => ({ ...prev, [name]: value }));
  };



  const handleAddTask = async () => {
    try {

      const { data } = await axios.post("/api/task", { task: taskInput, userId: user._id })

      if (data.success) {
        const newTasks = [...tasks, data.newTask];
        setTasks(newTasks);

        // Recalculate progress after adding a task
        const completedTasksCount = newTasks.filter(task => task.completed).length;
        setProgress(Math.round((completedTasksCount / newTasks.length) * 100));

        // Reset task input
        setTaskInput({ title: "", color: "", course: "", dueDate: "", completed: false });

      } else {
        console.error(data.error || "Task addition failed");
      }
    } catch (error) {
      toast.error(error.response.data.error)
      // console.error("Error adding task:", error);
    }
  };
  const handleCheckboxChange = async (taskId, completed) => {
    try {
      const { data } = await axios.put("/api/task", { taskId, completed: !completed, type: "checkbox" });
      if (data.success) {
        // Update local task state
        const updatedTasks = tasks.map(task =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        );

        setTasks(updatedTasks);

        // Recalculate progress based on the updated tasks
        const completedTasksCount = updatedTasks.filter(task => task.completed).length;
        setProgress(Math.round((completedTasksCount / updatedTasks.length) * 100));

        console.log(data);
      } else {
        console.error(data.error || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const handleEditTask = async (id) => {
    try {

      const { data } = await axios.put("/api/task", { taskId: id, task: editInput, type: "edit" })

      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });
        // router.refresh(); // Optionally refresh or update tasks display
        const updatedTasks = tasks.map(task => task._id == data.task._id ? data.task : task)
        setTasks(updatedTasks)
        console.log(data)

        handleClose()

      } else {
        console.error(data.error || "Task edit failed");
      }
    } catch (error) {
      toast.error(error.response.data.error)
      console.error("Error editing task:", error);
    }
  };

  const handleDeleteTask = async (id: mongoose.Schema.Types.ObjectId) => {
    try {

      const { data } = await axios.delete("/api/task", { params: { taskId: id, userId: user._id } })
      if (data.success) {
        setEditInput({ title: "", color: "", course: "", dueDate: "" });

        const taskArray = tasks.filter(task => task._id !== id);
        setTasks(taskArray);

        // Recalculate progress after deleting a task
        const completedTasksCount = taskArray.filter(task => task.completed).length;
        setProgress(Math.round((completedTasksCount / taskArray.length) * 100));
        handleClose()

      } else {
        console.error(data.error || "Task deletion failed");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <Layout>
        <div className='flex gap-2 justify-space-between items-center w-full max-h-screen h-screen bg-gradient-to-r from-blue-200 to-cyan-200'>
          <div className='tasks w-1/2 h-[90%]'>
            <div className='m-2 bg-white w-full rounded-md p-4 flex justify-between text-slate-800 font-bold text-xl'>
              
              
              <div>
                <div>Hi { user?.username}</div>
                <div>{dueTodayCount} Tasks due today</div>
              </div>


              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={progress} size="60px" />
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


            <div className='flex flex-col w-full  gap-2 items-start'>

              <div className='m-2 w-full'>
                <input
                  placeholder="Add Task"
                  name="title"
                  value={taskInput.title}
                  onChange={handleInputChange}
                  className=' p-2 rounded-md w-[100%] text-slate-600 outline-none'
                ></input>
              </div>


              <div className='w-full flex justify-between items-center'>
                <select
                  name="course"
                  value={taskInput.course}
                  onChange={handleInputChange}
                  className='p-2 m-2 rounded-md'>
                  <option value="" disabled>Select Course</option>
                  {courses?.map(course => (
                    <option key={course._id} value={course.name}>{course.name}</option>
                  ))}
                </select>

                <select
                  name="color"
                  value={taskInput.color}
                  onChange={handleInputChange}
                  className='p-2 m-2 rounded-md'>
                  <option value="" disabled>Select Color</option>
                  <option value="border-l-black">⚫ Black</option>
                  <option value="border-l-red-400">🔴 Red</option>
                  <option value="border-l-yellow-400">🟡 Yellow</option>
                  <option value="border-l-green-400">🟢 Green</option>
                  <option value="border-l-purple-400">🟣 Purple</option>
                  <option value="border-l-blue-400">🔵 Blue</option>
                </select>

                <input
                  type='date'
                  name="dueDate"
                  value={taskInput.dueDate}
                  onChange={handleInputChange}
                  className='p-1 h-9 m-2 rounded-md'
                ></input>
                <button className='bg-white p-2 rounded-full h-10 w-10 ml-2' onClick={handleAddTask}>+</button>
              </div>
            </div>


            <div className='tasks-container h-96 overflow-y-auto w-[100%]'>
              {tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`border-l-8 ${task.color} p-2 m-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out`}
                >
                  <div className="">
                    <div className="flex items-center justify-between gap-2">
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleCheckboxChange(task._id, task.completed)}
                      />
                      <div
                        className={`text-lg font-semibold px-2 w-96 truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800"
                          }`}
                      >
                        {task.title}
                      </div>
                      <IconButton onClick={() => handleOpen(task)}>
                        <MoreVertIcon />
                      </IconButton>
                    </div>


                    <div className="flex justify-between items-center space-x-4 mx-12">
                      {/* <div className="text-sm font-medium text-blue-600">{task.course}</div> */}
                      {task.course && <Chip label={task.course} />}
                      {task.dueDate && (
                        <div className="text-sm text-gray-600">
                          Due{" "}
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <TextField id="standard-basic" label="" variant="standard" sx={{ width: "100%" }} value={editInput.title} onChange={(e) => setEditInput({ ...editInput, title: e.target.value })} />
                <div className='flex'>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 100, color: "black" }}>
                    <InputLabel id="demo-simple-select-standard-label">Course</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Color"
                      value={editInput.course}
                      onChange={(e) => setEditInput({ ...editInput, course: e.target.value })}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {courses?.map(course => (
                        <MenuItem value={course.name}>{course.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120, color: "black" }}>
                    <InputLabel id="demo-simple-select-standard-label">Color</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={age}
                      onChange={handleChange}
                      label="Color"
                      value={editInput.color}
                      onChange={(e) => setEditInput({ ...editInput, color: e.target.value })}
                    >
                      <MenuItem value="border-l-black">⚫ Black</MenuItem>
                      <MenuItem value="border-l-red-400">🔴 Red</MenuItem>
                      <MenuItem value="border-l-yellow-400">🟡 Yellow</MenuItem>
                      <MenuItem value="border-l-green-400">🟢 Green</MenuItem>
                      <MenuItem value="border-l-purple-400">🟣 Purple</MenuItem>
                      <MenuItem value="border-l-blue-400">🔵 Blue</MenuItem>
                    </Select>
                  </FormControl>
                  <input
                    type='date'
                    name="dueDate"
                    value={editInput.dueDate ? new Date(editInput.dueDate).toISOString().substring(0, 10) : ""}
                    onChange={(e) => setEditInput({ ...editInput, dueDate: e.target.value })}
                    className='p-1 rounded-md'
                  ></input>
                </div>
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue={selected ? selected.description : ""}
                  variant="standard"
                  sx={{ width: 400 }}
                />
                <div className='flex justify-between my-4'>
                  <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteTask(selected._id)}>
                    Delete
                  </Button>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditTask(selected?._id)}>
                    Edit
                  </Button>
                </div>

              </Box>
            </Modal>

          </div>


          <div className="m-4 w-1/2 h-[90%] overflow-y-scroll bg-white p-4 rounded-md">
            <div className="text-slate-800 font-bold mb-4 text-2xl text-center">
              Pending Assignments
            </div>
            {pendingassignment ? (
              <div>
                {pendingassignment.map((assignment) => (
                  <div key={assignment._id} className="p-3 mb-2 shadow-md rounded-lg border border-gray-300">
                    <Typography
                      onClick={() => router.push(`/Assignment/user/${assignment._id}`)}
                      variant="subtitle1"
                      className="font-semibold cursor-pointer"
                      component="div"
                    >
                      {assignment.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Due Date:{" "}
                      {new Date(assignment.DueDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="truncate">
                      Description: {assignment.description}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No pending assignments
              </Typography>
            )}
          </div>
          <Toaster />
        </div>
      </Layout>
    </>
  )
}

export default Auth(Dashboard)