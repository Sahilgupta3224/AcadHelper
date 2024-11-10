"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Link from '@mui/material/Link';
import Challenge from "@/Interfaces/challenge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import demoChallenges, { Badges, tasks } from "@/utils/Sample Data/Sample";
import PomodoroUsageChart from "@/components/charts/PomodaroUsageChart";
import CompletedTasksChart from "@/components/charts/CompleteTaskChart";
import IncompleteTasksChart from "@/components/charts/IncompleteTaskChart";
import { useRouter } from "next/router";
import axios from "axios";
import "../../styles/globals.css";
import User from "@/Interfaces/user";
import toast from "react-hot-toast";
import Auth from "@/components/Auth";
import Task from "@/utils/Interfaces/taskInterface";
import { useStore } from "@/store";
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
function Profile() {

  const [loading, setLoading] = useState<boolean>(false);
  const { user, setUser } = useStore()
  const [fetchedUser, setFetchedUser] = React.useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [tasksRequired, setTasksRequired] = useState<Task[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [submissions, setSubmissions] = useState([])
  const [totalChallenges, setTotalChallenges] = useState([])
  const [points, setPoints] = useState<number>(0)
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const badgesToShow = 3;
  const badges = Badges;
  const router = useRouter();
  const id = router.query.id;
  const calculateTotalPoints = (user: any) => {
    if (!user?.Totalpoints) {
      return 0;
    }
    if (Array.isArray(user.Totalpoints)) {
      return user.Totalpoints.reduce((total: any, course: any) => total + course.points, 0);
    }
    return 0;
  };
  const totalPoints = calculateTotalPoints(user);

  const calTotalPoints = () => {
    let points: number = 0;

    if (!fetchedUser) {
      return;
    }

    const totalPointsArray = fetchedUser.Totalpoints

    totalPointsArray.map((item) => {
      points = points + (item.points.default || 0);
    })

    setPoints(points);
  }

  const calPointsOfChallenges = async () => {
    try {

      let points = 0;



    } catch (error) {
      toast.error("Error while calculating the points")
    }
  }

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/api/user?Id=${id}`);
      setFetchedUser(response.data.data);

      if (fetchedUser) {
        setEmail(fetchedUser.email);
        setUsername(fetchedUser.username);
        setChallenges(response.data.data.challengessolved)
      }
    } catch (error: any) {
      toast.error(error.response.data.error)
      return;
    }
  };


  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/task", {
        params: {
          userId: id,
        },
      });
      setTasksRequired(response.data.tasks);
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  };

  const fetchSubmissions = async () => {
    try {
      if (!id) {
        throw new Error("User ID is not defined");
      }

      const response = await axios.get('/api/submission/get-all-submissions', {
        params: {
          userId: id,
        },
      });

      console.log(response.data.submissions);
      setSubmissions(response.data.submissions);

    } catch (error: any) {
      toast.error("Error while fetching the submissions");
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error while fetching the submission:", error.message);
      }
    }
  };

  useEffect(() => {

    console.log(router)
    fetchUserDetails();
    fetchTasks();
    calTotalPoints();
    calPointsOfChallenges();
    setLoading(true)
    fetchSubmissions();
  }, [router.isReady, router.query.id]);

  const handleNext = () => {
    setCurrentBadgeIndex(
      (prevIndex) => (prevIndex + badgesToShow) % badges.length
    );
  };

  const handlePrevious = () => {
    setCurrentBadgeIndex(
      (prevIndex) => (prevIndex - badgesToShow + badges.length) % badges.length
    );
  };


  // if(loading===false)
  // {
  //   return (
  //     <LinearProgress color="secondary" />
  //   )
  // }

  return (
    <Layout>
      <Box p={3}>
        {/* Profile Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>

            <TextField
              label="Username"
              value={(fetchedUser) ? fetchedUser.username : "username"}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />

            <TextField
              label="Email"
              value={(fetchedUser) ? fetchedUser.email : "email"}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Box>
          <Avatar sx={{ width: 200, height: 200 }} src="/profile.png" />
        </Box>

        <Divider />

        {/* My Statistics */}
        <Box mt={4}>
          <Box
            display="flex"
            justifyItems="space-between"
            alignItems="center"
            gap={6}
          >
            <Typography variant="h4" gutterBottom>
              My Statistics
            </Typography>
            {/* <Avatar
              sx={{ width: 220, height: 220 }}
              src="/rectangleGraph.png"
            /> */}
          </Box>
          <Grid container mt={2} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignContent="center"
                >
                  <Typography variant="h6">Pending Tasks</Typography>
                  <AccountCircleIcon fontSize="large" color="action" />
                </Box>
                <Box
                  mt={2}
                  sx={{
                    minHeight: "500px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    textAlign: "left",
                  }}
                >
                  {tasksRequired.length > 0 && tasksRequired.map((task) => {
                    const color = task.color;

                    return (
                      <Paper
                        key={task._id.toString()}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: '#f2f9ff',
                          border: `2px solid ${color}`,
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                          textAlign: 'left',
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >

                        <div
                          style={{
                            width: '8px',
                            backgroundColor: color,
                            borderRadius: '8px 0 0 8px',
                          }}
                        ></div>

                        <div style={{ flexGrow: 1, paddingLeft: '8px' }}>
                          <Typography variant="subtitle1">{task.title}</Typography>
                          <Typography variant="body2">{task.course}</Typography>
                          <Typography variant="caption">
                            Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "N/A"}
                          </Typography>
                        </div>
                      </Paper>
                    );
                  })}

                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Box display="flex" justifyContent="space-between" alignContent="center">
                  <Typography variant="h6">My Submissions</Typography>
                  <AccountCircleIcon fontSize="large" color="action" />
                </Box>
                <Box
                  mt={2}
                  sx={{
                    minHeight: "500px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    textAlign: "left",
                  }}
                >
                  {submissions.length > 0 ? (
                    submissions.map((submission, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: '8px',
                          backgroundColor: "#FAF3E0", // Lighter shade for visibility
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        }}
                      >
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {submission?.documentLink ? (
                              <Link href={submission.documentLink} target="_blank" rel="noopener noreferrer" underline="hover">
                                Document Link
                              </Link>
                            ) : (
                              "Document not available"
                            )}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(submission.submittedAt).toLocaleString() || "Date"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" mt={1}>
                          Marks Obtained: {submission.marksObtained || 0}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No submissions available.
                    </Typography>
                  )}
                </Box>

              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Points Section */}
        <Box mt={2}>
          <Typography variant="h4">Points</Typography>

          <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="start"
            mt={2}
          >
            <TextField
              label="Total Points"
              value={totalPoints}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              variant="outlined"
            />

            <TextField
              label="Username"
              value={user?.username}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Rewards Section with Card Slider */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            My Rewards
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <IconButton onClick={handlePrevious}>
              <ArrowBackIosIcon />
            </IconButton>
            <Grid container spacing={2} justifyContent="center">
              {(user.badges.length > 0) ? user.badges.slice(
                currentBadgeIndex,
                currentBadgeIndex + badgesToShow
              ).map((badge, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      boxShadow: 3,
                      minHeight: 250,
                      maxHeight: 250,
                    }}
                  >
                    <CardContent>
                      <Avatar
                        sx={{
                          bgcolor: "#FFD700",
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                        }}
                        src={`/` + badge.photo}
                      />
                      <Typography variant="h6">{badge.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {badge.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
                : (<Box>
                  No Badge earned till now
                </Box>)}
            </Grid>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            All Rewards
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <IconButton onClick={handlePrevious}>
              <ArrowBackIosIcon />
            </IconButton>
            <Grid container spacing={2} justifyContent="center">
              {Badges.slice(
                currentBadgeIndex,
                currentBadgeIndex + badgesToShow
              ).map((badge, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      boxShadow: 3,
                      minHeight: 250,
                      maxHeight: 250,
                    }}
                  >
                    <CardContent>
                      <Avatar
                        sx={{
                          bgcolor: "#FFD700",
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                        }}
                        src={`/` + badge.photo}
                      />
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
          <Typography variant="h5" gutterBottom>
            Graphical Analytics
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Assignments and tasks historical insights
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle1">
                  Task Complete Per Week
                </Typography>
                <CompletedTasksChart tasks={tasksRequired || []} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle1">
                  Task Incomplete Per Week
                </Typography>
                <IncompleteTasksChart tasks={tasksRequired} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export default Auth(Profile);