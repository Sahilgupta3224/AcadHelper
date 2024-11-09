// GroupPage.tsx
"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Layout from '@/components/layout';
import Settings from './Settings'; // Adjusted for default import
import { useParams } from 'next/navigation'
import axios from 'axios';
import { Button, Checkbox, Container, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '@/store';
import { Types } from 'mongoose';
import Auth from '@/components/Auth'
interface Task {
  _id: Types.ObjectId
  text: string;
  completed: boolean;
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function GroupPage() {
  const [value, setValue] = React.useState(0);
  const {user,setUser} = useStore()
  const [newTask, setNewTask] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const params = useParams<{ groupId:string }>()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(()=>{
    const fetchTeam = async()=>{
      try{
        const res = await axios.get(`/api/team/${params?.groupId}`,{params:{type:"Team"}})
        console.log(res?.data?.team)
        setTasks(res.data.team.tasks || []);
      }catch(e){
        console.log(e)
      }
    }
    fetchTeam()
  },[])
  console.log(newTask)

  // Function to add a new task
  const addTask = async() => {
      try{
      const {data} = await axios.post("/api/team/tasks",{task:{text:newTask,completed:false},userId:user._id,teamId:params?.groupId})
      if(data.success){
      setTasks([...tasks, { text: newTask, completed: false, _id: data.task._id }]);
      setNewTask("");
      }
      }catch(error){
        console.log(error)
      }
    
  };

  // Function to toggle task completion
  const toggleComplete = async(currTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task._id === currTask._id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    try{
      const {data} = await axios.put("/api/team/tasks",{taskId:currTask._id,teamId:params?.groupId,completed:!currTask.completed})
    }catch(e){
      console.log(e)
    }
    
  };
  // Function to delete a task
  const deleteTask = async(id:Types.ObjectId) => { 
    try{
      const {data} = await axios.delete("/api/team/tasks",{params:{teamId:params?.groupId,taskId:id}})
      if(data.success){
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.filter(task => task._id!== id);
          return updatedTasks;
        });
      }
    }catch(e){
      console.log("Error deleting task",e)
    }
    
  };

  return (
    <Layout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Group Tasks" {...a11yProps(0)} />
          <Tab label="Settings" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className='text-center w-full text-2xl font-bold mt-4 mb-6 mx-4'>Start collaborating with your group right away!</div>
      <Container maxWidth="sm">
      <div className='flex'>
      <TextField
        sx={{width:"80%",marginLeft:"1rem"}}
        variant="outlined"
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTask()}
      />
      <Button variant="outlined" color="primary" onClick={addTask} sx={{marginX:"10px",height:"55px"}}>
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
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Settings/>
      </CustomTabPanel>
    </Box>
    </Layout>
  );
}

export default Auth(GroupPage);