"use client"
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  TextField,
  LinearProgress,
  CardContent,
  Card,
} from '@mui/material';
import Auth from '@/components/Auth'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Layout from '@/components/layout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import demoChallenges, { Badges, tasks } from '@/utils/Sample Data/Sample';
import PomodoroUsageChart from '@/components/charts/PomodaroUsageChart';
import CompletedTasksChart from '@/components/charts/CompleteTaskChart';
import IncompleteTasksChart from '@/components/charts/IncompleteTaskChart'
import { useRouter } from 'next/router';
import axios from 'axios';
function Profile() {
  const tasksRequired = tasks;
  const challenges = demoChallenges;

  const [fetchedUser,setFetchedUser]=React.useState(null)

   // State to handle the currently displayed set of badges
   const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
   const badgesToShow = 3;
   const badges=Badges

   const router = useRouter();
  
    const { id } = router.query;

   const fetchUserDetails=async ()=>{
    try {
        const response= await axios.get(`/api/user`,{
            params:{
                "Id":id
            }
        })
        
        setFetchedUser(response.data.data);
        console.log(fetchedUser)
    } catch (error) {
        console.log("Error while fetching user details",error)
        return;
    }
   }
    
   useEffect(()=>{
    fetchUserDetails();
   },[id])


   const handleNext = () => {
     setCurrentBadgeIndex((prevIndex) =>
       (prevIndex + badgesToShow) % badges.length
     );
   };
 
   const handlePrevious = () => {
     setCurrentBadgeIndex((prevIndex) =>
       (prevIndex - badgesToShow + badges.length) % badges.length
     );
   };

  return (
    <Layout>
      <Box p={3}>
        {/* Profile Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <TextField
              label="Username"
              value={fetchedUser?.username}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <TextField
              label="Email"
              value={fetchedUser?.email}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <TextField
              label="Year of Study"
              value="Sophomore" // Replace with dynamic value if available
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <TextField
              label="Field of Study"
              value="Computer Science" // Replace with dynamic value if available
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Box>
          <Avatar
            sx={{ width: 200, height: 200 }}
            src="profile.png" 
          />
        </Box>

        <Divider />

        {/* My Statistics */}
        <Box mt={4}>
          <Box display="flex" justifyItems="space-between" alignItems="center" gap={6}>
            <Typography variant="h4" gutterBottom>My Statistics</Typography>
            <Avatar sx={{ width: 220, height: 220 }} src="rectangleGraph.png" />
          </Box>
          <Grid container mt={2} spacing={3}>
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Pending Tasks</Typography>
                <AccountCircleIcon fontSize="large" color="action" />
                <Box
                  mt={2}
                  sx={{
                    minHeight: '500px',
                    maxHeight: '500px', // Restrict max height
                    overflowY: 'auto', // Enable vertical scrolling
                    textAlign:"left" 
                  }}
                >
                  {tasksRequired.filter(task => !task.completed).map((task) => (
                   
                    <Paper
                    key={task._id}
                    sx={{
                      p: 2, // Increased padding for better spacing
                      mb: 1,
                      backgroundColor: '#FFA872',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start', // Align items to start of the column
                      alignItems: 'stretch', // Ensure children take full width
                      height: '100%', // Optional: to fill the parent's height
                      textAlign:"left"
                    }}
                  >
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        mt: 2, // Add margin-top for spacing above the progress bar
                        borderRadius: 1, // Optional: add rounded corners to the progress bar
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>Progress: {task.progress}%</Typography>
                    <Typography variant="caption">Deadline: {new Date(task.deadline).toLocaleString()}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Completed Tasks</Typography>
                <AccountCircleIcon fontSize="large" color="action" />
                <Box
                  mt={2}
                  sx={{
                    minHeight: '500px',
                    maxHeight: '500px', // Restrict max height
                    overflowY: 'auto', // Enable vertical scrolling
                  }}
                >
                  {tasksRequired.filter(task => task.completed).map((task) => (
                    <Paper
                    key={task._id}
                    sx={{
                      p: 2, // Increased padding for better spacing
                      mb: 1,
                      backgroundColor: '#7AC97A',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start', // Align items to start of the column
                      alignItems: 'stretch', // Ensure children take full width
                      height: '100%', // Optional: to fill the parent's height
                      textAlign:"left"
                    }}
                  >
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        mt: 2, // Add margin-top for spacing above the progress bar
                        borderRadius: 1, // Optional: add rounded corners to the progress bar
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>Progress: {task.progress}%</Typography>
                    <Typography variant="caption">Deadline: {new Date(task.deadline).toLocaleString()}</Typography>
                    </Paper>
                  
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Challenges</Typography>
                <AccountCircleIcon fontSize="large" color="action" />
                <Box
                  mt={2}
                  sx={{
                    minHeight: '500px',
                    maxHeight: '500px', // Restrict max height
                    overflowY: 'auto', // Enable vertical scrolling
                  }}
                >
                  {challenges.map((challenge, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 1, backgroundColor: '#FFA872' }}>
                      <Typography variant="subtitle1">{challenge.title}</Typography>
                      <Typography variant="body2">{challenge.description}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </Box>

        {/* Points Section */}
        <Box mt={2} >
          <Typography variant="h4">Points</Typography>
       
          <Box display="flex" flexDirection="column" justifyItems="center" alignItems="start" mt={2}>
            <TextField label="Total Points" value="1000" fullWidth margin="normal" InputProps={{ readOnly: true }} variant="outlined" />
            <TextField label="Points Earned Through Challenge" value="shikhar" fullWidth margin="normal" InputProps={{ readOnly: true }} variant="outlined" />
            <TextField label="Points Earned Through Task Completion" value="shikhar" fullWidth margin="normal" InputProps={{ readOnly: true }} variant="outlined" />
            <TextField label="Username" value="shikhar" fullWidth margin="normal" InputProps={{ readOnly: true }} variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Rewards Section with Card Slider */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Rewards</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <IconButton onClick={handlePrevious}>
                      <ArrowBackIosIcon />
                    </IconButton>
                    <Grid container spacing={2} justifyContent="center">
                    {Badges.slice(currentBadgeIndex, currentBadgeIndex + badgesToShow).map((badge, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3,minHeight:250,maxHeight:250 }}>
                            <CardContent>
                                <Avatar sx={{ bgcolor: '#FFD700', width: 60, height: 60, mx: 'auto', mb: 2 }} src={badge.photo}/>
                                <Typography variant="h6">{badge.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                {badge.description}
                                </Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                    <IconButton onClick={handleNext}>
                        <ArrowForwardIosIcon />
                    </IconButton>
          </Box>

         
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Graphical Analytics Section */}
        <Box>
          <Typography variant="h5" gutterBottom>Graphical Analytics</Typography>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">Assignments and tasks historical insights</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Task Complete Per Week</Typography>
                <CompletedTasksChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Task Incomplete Per Week</Typography>
                <IncompleteTasksChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Pomodoro Timer Usage Variation</Typography>
                <PomodoroUsageChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Pomodoro Timer Usage Variation</Typography>
                <PomodoroUsageChart />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export default Auth(Profile);
