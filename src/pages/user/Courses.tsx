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
import Submission from "@/Interfaces/submission";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Assignment from "@/Interfaces/assignment";
import { useStore } from "@/store";
import { CldUploadWidget } from 'next-cloudinary';
import { Box, Button, TextField, Typography, Modal, IconButton, Select, MenuItem } from "@mui/material";
import Leaderboard from "../../components/Leaderboard";

function sortUsersByCoursePoints(users, targetCourseId) {
  return users.sort((a, b) => {
    // Find points for the target course in each user
    const aPoints = a.Totalpoints.find(course => course.courseId === targetCourseId)?.points || 0;
    const bPoints = b.Totalpoints.find(course => course.courseId === targetCourseId)?.points || 0;

    // Sort in descending order
    return bPoints - aPoints;
  });
}
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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
  const [enrolledUsers,setEnrolledUsers] = useState([])

  // Get all users in a course
  useEffect(()=>{
    const fetchEnrolledUsers=async ()=>{
      try {
        const response=await axios.get('/api/course/get-enrolled',{
          params:{
            courseId
          }
        })
        
        const sortedUsers = sortUsersByCoursePoints(response.data.users, courseId);
        setEnrolledUsers(sortedUsers)
    
      } catch (error) {
        console.log("Error while fetching all the enrolled users of the course",error);
        return;
      }
    }
    fetchEnrolledUsers()
  },[])


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
  const GetsubmissionBycourse = async () => {
    if (courseId) {
      try {
        const response = await axios.get(`/api/submission/getsubmissionbycourseanduser?CourseId=${courseId}&userId=${user._id}`);
        // setSubmissions(response.data)
        console.log(response.data)
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
        <Typography variant="h4" gutterBottom>User Dashboard</Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Assignments" />
          <Tab label="Challenges" />
          <Tab label="Leaderboard" />
          <Tab label="My submissions" />
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
                      onClick={() => router.push(`/Assignment/user/${assignment._id}`)}
                    >
                      View Details
                    </Button>
                    <div>
                    {assignment.status}
                    </div>
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
                      onClick={() => router.push(`/Challenge/user/${challenge._id}`)}
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
                {/* <TextField fullWidth label="Document Link" value={challengeDoc} onChange={(e) => setChallengeDoc(e.target.value)} sx={{ mb: 2 }} /> */}
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
          <div className="text-center ">
          <Leaderboard users={enrolledUsers}/>
          </div>
          </>
        )}

        {value === 3 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex', mb: 2 }}>
              {/* <Button variant="contained" color="primary" sx={{ width: '200px' }}>
                My Submissions
              </Button> */}
              <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Submissions</h2>
                    {submissions.length > 0 ? (
                        submissions.map((submission) => (
                            <div key={submission._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        {/* <p><strong>Submitted By:</strong> {submission.user.name}</p> */}
                                        <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        View Submission
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No submissions yet.</p>
                    )}
                </div>
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