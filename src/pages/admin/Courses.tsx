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
  const [open, setOpen] = React.useState(false);
  const [challengeIdToDelete, setChallengeIdToDelete] = React.useState<string | null>(null);
  const courseId = '6729e6d6f4a82d6fedab5625';
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
  const DeleteChallenge = async () => {
    if(challengeIdToDelete){
      try {
        const response = await axios.delete(`/api/challenge/deletechallenge?Id=${challengeIdToDelete}`);
        setChallenges((prev) => prev.filter(challenge => challenge._id !== challengeIdToDelete));
        console.log(response.data)
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting challenges:", error);
    }
    }
  };

  const handleOpenModal = (id: string) => {
    setChallengeIdToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setChallengeIdToDelete(null);
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
                  <Button onClick={() => handleOpenModal(challenge._id)}>
                    Delete Challennge
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No challenges found for this course.</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" sx={{ width: '200px' }} onClick={() => router.push(`/admin/uploadchallenge/${courseId}`)} >
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
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
  sx={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 3,
    p: 4,
    outline: 'none',
    zIndex: 1300,
  }}
>
  <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
    Confirm Delete
  </Typography>
  <Typography id="modal-description" sx={{ mb: 4 }}>
    Are you sure you want to delete this challenge?
  </Typography>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button onClick={handleCloseModal} color="primary" sx={{ mr: 1 }}>
      Cancel
    </Button>
    <Button onClick={DeleteChallenge} variant="contained" color="secondary">
      Delete
    </Button>
  </Box>
</Box>

        </Modal>
      </Box>
    </Layout>
  );
};

export default AdminPage;