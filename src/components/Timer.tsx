import React from 'react'
import { useState,useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, Modal, TextField } from '@mui/material';
import '../app/globals.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
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

const Timer = () => {
    const [value, setValue] = useState(0);
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

   // Convert minutes input to seconds and start the timer
    const startTimer = () => {
        resetTimer()
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

    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        const startTime = Date.now(); // Store start time when the timer starts
        let savedTime = time;
    
        // Track elapsed time
        const updateTime = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setTime((prevTime) => {
                const newTime = { ...prevTime };
                const remainingTime = Math.max(savedTime.pomodoro - elapsed, 0);
                newTime.pomodoro = remainingTime;
                if (remainingTime <= 0) {
                    setIsActive({ pomodoro: false, short: false, long: false });
                    setPaused(true);
                }
                return newTime;
            });
        };
    
        const updateShort = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setTime((prevTime) => {
                const newTime = { ...prevTime };
                const remainingTime = Math.max(savedTime.short - elapsed, 0);
                newTime.short = remainingTime;
                if (remainingTime <= 0) {
                    setIsActive({ pomodoro: false, short: false, long: false });
                    setPaused(true);
                }
                return newTime;
            });
        };
    
        const updateLong = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setTime((prevTime) => {
                const newTime = { ...prevTime };
                const remainingTime = Math.max(savedTime.long - elapsed, 0);
                newTime.long = remainingTime;
                if (remainingTime <= 0) {
                    setIsActive({ pomodoro: false, short: false, long: false });
                    setPaused(true);
                }
                return newTime;
            });
        };
    
        // Handle when tab visibility changes (i.e., user switches tabs or navigates away)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                savedTime = time; // Save the current time when tab is hidden
                clearInterval(timerInterval); // Stop the timer
            } else {
                // If the page is back in focus, calculate the elapsed time and continue the timer
                savedTime = time; 
                if (isActive.pomodoro && !paused) {
                    timerInterval = setInterval(updateTime, 1000); // Start the timer again
                } else if (isActive.short && !paused) {
                    timerInterval = setInterval(updateShort, 1000);
                } else if (isActive.long && !paused) {
                    timerInterval = setInterval(updateLong, 1000);
                }
            }
        };
    
        // Start the timer if the corresponding timer is active and not paused
        if (isActive.pomodoro && !paused) {
            timerInterval = setInterval(updateTime, 1000);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
        if (isActive.short && !paused) {
            timerInterval = setInterval(updateShort, 1000);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
        if (isActive.long && !paused) {
            timerInterval = setInterval(updateLong, 1000);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
    
        return () => {
            clearInterval(timerInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isActive, paused, time, value]);
    

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

      // Load timer state from localStorage on mount
useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('acadhelperTimer');
    if (saved) {
      try {
        const { value: sv, timer: st, time: stime, isActive: sa, paused: sp, savedAt: sat } = JSON.parse(saved);
        const now = Date.now();
        const elapsed = Math.floor((now - (sat || now)) / 1000);
        // Only adjust the currently active timer by elapsed time
        if (!sp) {
          const tabName = sv === 0 ? 'pomodoro' : sv === 1 ? 'short' : 'long';
          if (sa[tabName]) {
            stime[tabName] = Math.max(stime[tabName] - elapsed, 0);
          }
        }
        setValue(sv);
        setTimer(st);
        setTime(stime);
        setIsActive(sa);
        setPaused(sp);
      } catch {};
    }
  }
}, []);

// Persist timer state to localStorage on changes
useEffect(() => {
  // Persist snapshot when start, pause/resume or timer config changes
  if (typeof window !== 'undefined') {
    const state = { value, timer, time, isActive, paused, savedAt: Date.now() };
    localStorage.setItem('acadhelperTimer', JSON.stringify(state));
  }
}, [value, timer, isActive, paused]);

  return (
    <div className='pomodoro'>
           <div className='bg-gradient-to-r from-blue-200 to-cyan-200 rounded-md h-[100vh] w-[100%]'>
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
                  <div className='h-96 w-96 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-6xl font-bold text-slate-800'>
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
                  <div className='h-96 w-96 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-6xl font-bold text-slate-800'>
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
                  <div className='h-96 w-96 m-2 rounded-full bg-sky-100 p-10 flex justify-center items-center text-6xl font-bold text-slate-800'>
                  {formatTime(time.long)}
                  </div>
              </div>
                  <div className='flex justify-center'>
                      {isActive.long ?<Button onClick={resetTimer}>Reset Timer</Button>:<Button onClick={startTimer}>Start Timer</Button>}
                      {isActive.long && <Button onClick={toggleTimer}>{!paused ? 'Pause' : 'Resume'}</Button> }
                      <Button onClick={handleOpen}>Edit Timer</Button>
                  </div>
          </CustomTabPanel>
          <Modal open={open} onClose={handleClose} aria-labelledby="edit-timer-modal">
        <Box sx={style}>
            <div className='flex'>
          <TextField
            label="Pomodoro (minutes)"
            type="number"
            name="pomodoro"
            value={timer.pomodoro}
            onChange={handleTimerChange}
            sx={{marginRight:2}}
          />
          <TextField
            label="Short Break (minutes)"
            type="number"
            name="short"
            value={timer.short}
            onChange={handleTimerChange}
            sx={{marginRight:2}}
          />
          <TextField
            label="Long Break (minutes)"
            type="number"
            name="long"
            value={timer.long}
            onChange={handleTimerChange}
            sx={{marginRight:2}}
          />
          <Button variant="outlined" onClick={handleClose}>Save</Button>
          </div>
        </Box>
      </Modal>
        </div>
        </div>
  )
}

export default Timer