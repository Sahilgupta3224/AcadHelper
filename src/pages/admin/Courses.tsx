import * as React from "react";
import { Box, Button, TextField, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Layout from "@/components/layout";
import "../../app/globals.css";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import ButtonComp from "@/components/button";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Assignment from "@/Interfaces/assignment";

const AdminPage: React.FC = () => {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [assignments, setassignments] = React.useState<Assignment[]>([]);
  const [value, setValue] = React.useState(0);
  const courseId = '6726042138ea22ecca513fc0';
  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`/api/challenge/getchallengebycourse?CourseId=${courseId}`);
      console.log(response.data.data)
      setChallenges(response.data.data);
      console.log(challenges)
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`/api/assignment/getassignmentsbycourse?CourseId=${courseId}`);
      console.log(response.data.data)
      setassignments(response.data.data);
      console.log(assignments)
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  React.useEffect(() => {
    fetchChallenges();
    fetchAssignments();
  }, [courseId]);

  const handleChallengeClick = (challengeId: string) => {
    router.push(`/Challenge/${challengeId}`);
  };

  return (
    <Layout>
      <Box sx={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Assignments" />
        <Tab label="Challenges" />
        <Tab label="Basic Operations" />
      </Tabs>
      {value === 0 && (
        <>
        <Box sx={{ mt: 2 }}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Box key={assignment._id} sx={{ mb: 1, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
              <Typography variant="h6">{assignment.title}</Typography>
              <Button
                variant="contained"
                onClick={() => router.push(`/challenge/${assignment._id}`)}
              >
                View Details
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No assignments found for this course.</Typography>
        )}
      </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" sx={{ width: '200px' }}>
              Upload Assignment
            </Button>
          </Box>
          </>
        )}

        {value === 1 && (
          <>
          <Box sx={{ mt: 2 }}>
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
                <Box key={challenge._id} sx={{ mb: 1, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                  <Typography variant="h6">{challenge.title}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/Challenge/${challenge._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No challenges found for this course.</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" sx={{ width: '200px' }}>
              Add Challenge
            </Button>
          </Box>
        </>
        )}

        {value === 2 && (
          <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" color="primary" sx={{ width: '200px' }}>
            All Users
          </Button>
        </Box>
        </>
        )}
        
      </Box>
    </Layout>
  );
};

export default AdminPage;