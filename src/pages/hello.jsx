import * as React from "react";
import { useState, useEffect } from "react";
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
import { useStore } from "@/store";
import { CldUploadWidget } from 'next-cloudinary';
import { Box, Button, TextField, Typography, Modal, IconButton, Select, MenuItem } from "@mui/material";

const AdminPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [assignments, setassignments] = useState<Assignment[]>([]);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAssignment, setopenAssignment] = useState(false);
  const [challengeIdToDelete, setChallengeIdToDelete] = useState<string | null>(null);
  const [AssignmentIdToDelete, setAssignmentIdToDelete] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDoc, setChallengeDoc] = useState("");
  const [type, setType] = useState("individual");
  const [frequency, setFrequency] = useState("daily");
  const [points, setPoints] = useState<number | undefined>();
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openUploadAssignmentModal, setOpenUploadAssignmentModal] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDoc, setAssignmentDoc] = useState("");
  const [assignmentPoints, setAssignmentPoints] = useState<number | undefined>();
  const [yo, setyo] = useState(false)
  const courseId = '6729e6d6f4a82d6fedab5625';
  const { user, setUser } = useStore()
  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleUpload = (result: any) => {
    if (result && result.info) {
      setAssignmentDoc(result.info.url);
      console.log("Upload result info:", result.info);
    } else {
      console.error("Upload failed or result is invalid.");
    }
  };

  const handleUploadChallenge =(result:any)=>{
    if (result && result.info) {
      setChallengeDoc(result.info.url);
      console.log("Upload result info:", result.info);
    } else {
      console.error("Upload failed or result is invalid.");
    }
  }

  const handleSubmitChallenge = async () => {
    try {
      let End = new Date(startDate);
      if (frequency === "daily") {
        End.setDate(End.getDate() + 1)
      }
      if (frequency === "weekly") {
        End.setDate(End.getDate() + 7)
      }
      const response = await axios.post("/api/challenge/uploadchallenge", {
        title,
        description,
        startDate,
        endDate: End.toISOString().split('T')[0],
        challengeDoc,
        type,
        frequency,
        points,
        createdBy: user._id,
        courseId,
      });
      setChallenges((prev) => [...prev, response.data.Challenge]);
      setOpenUploadModal(false);
      setyo(!yo)
    } catch (error) {
      console.error("Error uploading challenge:", error);
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      const response = await axios.post("/api/assignment/upload-assignment", {
        title: assignmentTitle,
        description: assignmentDescription,
        DueDate: assignmentDueDate,
        AssignmentDoc: assignmentDoc,
        totalPoints: assignmentPoints,
        CourseId: courseId,
        uploadedAt: Date.now(),
        status: "Open"
      });
      console.log("Assignment uploaded successfully:", response.data);
      setOpenUploadAssignmentModal(false);
      setyo(!yo)
    } catch (error) {
      console.error("Error uploading assignment:", error);
    }
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
    if (challengeIdToDelete) {
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
  const DeleteAssignment = async () => {
    if (AssignmentIdToDelete) {
      try {
        const response = await axios.delete(`/api/assignment/delete-assignment?Id=${AssignmentIdToDelete}`);
        setassignments((prev) => prev.filter(assignment => assignment._id !== AssignmentIdToDelete));
        console.log(response.data)
        handleCloseAssignmentModal();
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
  const handleOpenAssignmentModal = (id: string) => {
    setAssignmentIdToDelete(id);
    setopenAssignment(true);
  };

  const handleCloseAssignmentModal = () => {
    setopenAssignment(false);
    setAssignmentIdToDelete(null);
  };

  useEffect(() => {
    fetchChallenges();
    fetchAssignments();
  }, [courseId, yo]);

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
                      onClick={() => router.push(`/Assignment/admin/${assignment._id}`)}
                    >
                      View Details
                    </Button>
                    <Button onClick={() => handleOpenAssignmentModal(assignment._id)}>
                      Delete Assignment
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No assignments found for this course.</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" color="primary" sx={{ width: '200px' }} onClick={() => setOpenUploadAssignmentModal(true)} >
                Upload Assignment
              </Button>

              <Modal open={openUploadAssignmentModal} onClose={() => setOpenUploadAssignmentModal(false)}>
                <Box
                  sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
                  }}
                >
                  <Typography variant="h6" gutterBottom>Add New Assignment</Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Description"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Due Date"
                    value={assignmentDueDate}
                    onChange={(e) => setAssignmentDueDate(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <CldUploadWidget
                    uploadPreset="acad_helper_pdf	"
                    onSuccess={handleUpload}
                  >
                    {({ open }) => (
                      <Button onClick={() => open()} variant="outlined" color="primary" fullWidth>
                        Select File
                      </Button>
                    )}
                  </CldUploadWidget>

                  <TextField
                    fullWidth
                    type="number"
                    label="Points"
                    value={assignmentPoints}
                    onChange={(e) => setAssignmentPoints(parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={handleSubmitAssignment}>
                    Submit Assignment
                  </Button>
                </Box>
              </Modal>

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
              <Button variant="contained" color="primary" sx={{ width: '200px' }} onClick={() => setOpenUploadModal(true)} >
                Add Challenge
              </Button>
            </Box>

            <Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
              <Box
                sx={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
                }}
              >
                <Typography variant="h6" gutterBottom>Add New Challenge</Typography>
                <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline label="Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                <CldUploadWidget
                    uploadPreset="acad_helper_pdf	"
                    onSuccess={handleUploadChallenge}
                  >
                    {({ open }) => (
            <Button onClick={() => open()} variant="outlined" color="primary" fullWidth>
              Select File
            </Button>
          )}
                  </CldUploadWidget>
                <Select fullWidth value={type} onChange={(e) => setType(e.target.value as string)} sx={{ mb: 2 }}>
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                </Select>
                <Select fullWidth value={frequency} onChange={(e) => setFrequency(e.target.value as string)} sx={{ mb: 2 }}>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
                <TextField fullWidth type="number" label="Points" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} sx={{ mb: 2 }} />
                <Button variant="contained" color="primary" onClick={handleSubmitChallenge}>
                  Submit Challenge
                </Button>
              </Box>
            </Modal>

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


        <Modal
          open={openAssignment}
          onClose={handleCloseAssignmentModal}
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
              Are you sure you want to delete this assignment?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseAssignmentModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={DeleteAssignment} variant="contained" color="secondary">
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