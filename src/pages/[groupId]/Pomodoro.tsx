"use client"
import Layout from '@/components/layout'
import {ChangeEvent, useState,KeyboardEvent, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../app/globals.css';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useStore } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import Auth from '@/components/Auth'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
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
  
    const Pomodoro = () => {
    const [value, setValue] = useState(0);
    const [tasks, setTasks] = useState([]);
    const {user,setUser} = useStore()
    const [newTask, setNewTask] = useState<string>("");
    const params = useParams()
    const [timer,setTimer] = useState({pomodoro:25,short:5,long:15})
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [time, setTime] = useState({pomodoro:timer.pomodoro*60,short:timer.short*60,long:timer.long*60}); // Time in seconds
    const handleTimerChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setTimer(prev => ({ ...prev, [name]: value }));
        setTime(prev=>({...prev,[name]:value*60}));
    };
    const [isActive, setIsActive] = useState({pomodoro:false,short:false,long:false}); // Timer status (active or not)
    const [paused,setPaused] = useState<boolean>(true) // Pause status
    useEffect(()=>{
      const fetchTeam = async()=>{
        try{
          const res = await axios.get(`/api/team/${params.groupId}`,{params:{type:"Team"}})
          console.log(res?.data?.team)
          setTasks(res.data.team.tasks || []);
        }catch(e){
          console.log(e)
        }
      }
      fetchTeam()
    },[])

    // Convert minutes input to seconds and start the timer
    const startTimer = () => {
        const tabName = value === 0 ? "pomodoro" : value === 1 ? "short" : "long";
        if (!isActive[tabName]) {
            let seconds = 0;
            let name = ""
            if (value === 0){
                 seconds = timer.pomodoro * 60;
                 name="pomodoro"
            }
            else if (value === 1){
                seconds = timer.short * 60;
                name="short"
            }
            else if (value === 2){
                 seconds = timer.long * 60;
                 name="long"
            }
    
            if (seconds > 0) {
                setTime(prev=>({...prev,[name]:seconds}));
                setIsActive(prev=>({...prev,[tabName]:true}));
                setPaused(false)
            } else {
                alert("Please enter a valid number of minutes");
            }
        }
    };    

    const toggleTimer = () => {
        setPaused(prevState => !prevState); // Toggle between active and paused
    };

    // Reset the timer to initial state
    const resetTimer = () => {
        setIsActive({pomodoro:false,short:false,long:false});
        setPaused(true)
        setTime({pomodoro:timer.pomodoro*60,short:timer.short*60,long:timer.long*60});
        setTimer(prev=>({...prev,pomodoro:25}));
    };

    // Update the timer countdown
    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
    
        // Only start the timer if it matches the current tab
        const currentTimer =
            value === 0 ? time.pomodoro : value === 1 ? time.short : time.long;

        const tabName = value === 0 ? "pomodoro" : value === 1 ? "short" : "long";
    
        if (isActive[tabName] && !paused && currentTimer > 0) {
            timerInterval = setInterval(() => {
                setTime(prevTime => {
                    const newTime = { ...prevTime };
                    if (value === 0) newTime.pomodoro -= 1;
                    else if (value === 1) newTime.short -= 1;
                    else if (value === 2) newTime.long -= 1;
                    return newTime;
                });
            }, 1000);
        } else if (currentTimer === 0) {
            setIsActive({pomodoro:false,short:false,long:false});
            setPaused(true);
        }
    
        // Clear timer interval when unmounting or changing tabs
        return () => clearInterval(timerInterval);
    }, [isActive, time, paused, value]);
    

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


  // Function to add a new task
  const addTask = async() => {
    // console.log(newTask)
      try{
      const {data} = await axios.post("/api/team/tasks",{task:{text:newTask,completed:false},userId:user._id,teamId:params.groupId})
      if(data.success){
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
      }
      }catch(error){
        console.log(error)
      }
    
  };

  // Function to toggle task completion
  const toggleComplete = async(currTask) => {
    const updatedTasks = tasks.map(task =>
      task._id === currTask._id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    try{
      const {data} = await axios.put("/api/team/tasks",{taskId:currTask._id,teamId:params.groupId,completed:!currTask.completed})
      console.log(data)
    }catch(e){
      console.log(e)
    }
    
  };
  // Function to delete a task
  const deleteTask = async(id) => { 
    try{
      const {data} = await axios.delete("/api/team/tasks",{params:{teamId:params.groupId,taskId:id}})
      if(data.success){
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.filter(task => task._id!== id);
          console.log("Updated tasks after deletion:", updatedTasks); 
          return updatedTasks;
        });
      }
    }catch(e){
      console.log("Error deleting task",e)
    }
    
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
  <>
    <div className='text-center'>
    <div className='text-xl m-1'>Welcome to Virtual Room</div>
    <div className='text-xl'>Stay Focused and increase your productivity</div>
    </div>
    <div className='flex justify-center'>
        <div className='bg-gradient-to-r from-blue-200 to-cyan-200 rounded-md w-[50%] m-6'>
          <Box sx={{ }}>
          <div className='w-full flex justify-center'>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Pomodoro" {...a11yProps(0)} />
              <Tab label="Short Break" {...a11yProps(1)} />
              <Tab label="Long Break" {...a11yProps(2)} />
          </Tabs>
          </div>
          </Box>
          <CustomTabPanel value={value} index={0}>
              <div className='flex justify-center'>
                  <div className='h-36 w-36 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-4xl font-bold text-slate-800'>
                  {/* {timer.pomodoro}:00 */}
                  {formatTime(time.pomodoro)}
                  </div>
              </div>
                  <div className='flex justify-center'>
                      {isActive.pomodoro ?<Button onClick={resetTimer}>Reset Timer</Button>:<Button onClick={startTimer}>Start Timer</Button>}
                      {isActive.pomodoro && <Button onClick={toggleTimer}>{!paused ? 'Pause' : 'Resume'}</Button> }
                      <Button onClick={handleOpen}>Edit Timer</Button>
                  </div>
              
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
          <div className='flex justify-center'>
                  <div className='h-36 w-36 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-4xl font-bold text-slate-800'>
                  {formatTime(time.short)}
                  </div>
              </div>
                  <div className='flex justify-center'>
                      {isActive.short ?<Button onClick={resetTimer}>Reset Timer</Button>:<Button onClick={startTimer}>Start Timer</Button>}
                      {isActive.short && <Button onClick={toggleTimer}>{!paused ? 'Pause' : 'Resume'}</Button> }
                      <Button onClick={handleOpen}>Edit Timer</Button>
                  </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
          <div className='flex justify-center'>
                  <div className='h-36 w-36 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-4xl font-bold text-slate-800'>
                  {formatTime(time.long)}
                  </div>
              </div>
                  <div className='flex justify-center'>
                      {isActive.long ?<Button onClick={resetTimer}>Reset Timer</Button>:<Button onClick={startTimer}>Start Timer</Button>}
                      {isActive.long && <Button onClick={toggleTimer}>{!paused ? 'Pause' : 'Resume'}</Button> }
                      <Button onClick={handleOpen}>Edit Timer</Button>
                  </div>
          </CustomTabPanel>
        </div>
    </div>
    <Container maxWidth="sm">
      <div className='flex'>
      <TextField
        sx={{width:"80%"}}
        variant="outlined"
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTask()}
      />
      <Button variant="outlined" color="primary" onClick={addTask} sx={{marginX:"10px"}}>
        +
      </Button>
      </div>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index}>
            <Checkbox checked={task.completed} tabIndex={-1} disableRipple  onClick={() => toggleComplete(task)}/>
            <ListItemText
              primary={task.text}
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            />
            <IconButton edge="end" onClick={() => deleteTask(task._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           Set Timer 
          </Typography>
          <div className='flex my-4 justify-center'>
          <TextField id="outlined-basic-name" name="pomodoro" label="Pomodoro" variant="outlined" defaultValue={timer.pomodoro} sx={{marginRight:"2rem",width:"6rem"}}
          onChange={handleTimerChange}
          />
          <TextField id="outlined-basic-name" name="short" label="Short Break" variant="outlined" defaultValue={timer.short} sx={{marginRight:"2rem",width:"6rem"}}
          onChange = {handleTimerChange}
          />
          <TextField id="outlined-basic-desc" name="long" label="Long Break" variant="outlined" defaultValue={timer.long} sx={{width:"6rem"}}
          onChange={handleTimerChange}/>
          </div>

          {/* <div className='w-full mt-4 flex justify-end'><Button onClick={handle}>Edit</Button></div> */}
        </Box>
      </Modal>
  </>
  )
}

export default Auth(Pomodoro)