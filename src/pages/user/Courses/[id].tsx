"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Layout from "@/components/layout";
import "../../../app/globals.css";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import ButtonComp from "@/components/button";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Submission from "@/Interfaces/submission";
import Tabs from '@mui/material/Tabs';
import toast, { Toaster } from 'react-hot-toast';
import Auth from '@/components/Auth'
import Tab from '@mui/material/Tab';
import Assignment from "@/Interfaces/assignment";
import { useStore } from "@/store";
import { CldUploadWidget } from 'next-cloudinary';
import { Box, Button, TextField, Typography, Modal, IconButton, Select, MenuItem, Chip } from "@mui/material";
import Leaderboard from "@/components/Leaderboard";

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
  const router = useRouter();
  const { query } = router
  console.log(query)
  const { id } = router.query;
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
  const courseId = id
  const { user, setUser } = useStore()
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
      console.log(courseId)
      const response = await axios.get(`/api/challenge/getchallengebycourse?CourseId=${courseId}`);
      console.log(response.data.data)
      setChallenges(response.data.data);
      console.log(challenges)
    } catch (error:any) {
      toast.error(error.response.data.error)
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`/api/assignment/getassignmentsbycourse?CourseId=${id}`);
      console.log(response.data.data)
      setassignments(response.data.data);
      console.log(assignments)
    } catch (error:any) {
      toast.error(error.response.data.error)
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
        setSubmissions(response.data.data)
        console.log(response.data.data)
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
    GetsubmissionBycourse();
  }, [courseId, yo]);

  const handleChallengeClick = (challengeId: string) => {
    router.push(`/Challenge/${challengeId}`);
  };

  return (
    <Layout>
      <Box>
        {/* <Typography variant="h4" gutterBottom>User Dashboard</Typography> */}
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
            <div className="">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                     <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer"  onClick={() => router.push(`/Assignment/user/${assignment._id}`)}>
                         <h1 className="text-3xl font-bold mb-4 flex justify-between">
                          {assignment.title}
                          <div>
                           <Chip label={assignment.status} sx={{marginRight:"1rem"}} color={assignment.status=='Open' ? "success" : "error"} variant="outlined"/>
                           <Chip label={assignment.totalPoints} />
                           </div>
                          </h1>
                         <p><strong>Assigned on:</strong> {new Date(assignment.uploadedAt).toISOString().split("T")[0]}</p>
                         <p><strong>Due date:</strong> {new Date(assignment.DueDate).toISOString().split("T")[0]}</p>
                     </div>
                ))
              ) : (
                <div className="w-full flex justify-center">No assignments found for this course.</div>
              )}
            </div>
          </>
        )}

        {value === 1 && (
          <>
            <Box sx={{ mt: 2 }}>
              {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer" onClick={() => router.push(`/Challenge/user/${challenge._id}`)}>
                  <h1 className="text-3xl font-bold mb-4 flex justify-between">
                   {challenge.title}
                   <div>
                    <Chip label={challenge.type} sx={{marginRight:"1rem"}} color="secondary" variant="outlined"/>
                    <Chip label={challenge.frequency} sx={{marginRight:"1rem"}} color={challenge.frequency=='daily' ? "primary" : "success"} variant="outlined"/>
                    <Chip label={challenge.points} />
                    </div>
                   </h1>
                  <p><strong>Start date:</strong> {new Date(challenge.startDate).toISOString().split("T")[0]}</p>
                  <p><strong>Due date:</strong> {new Date(challenge.endDate).toISOString().split("T")[0]}</p>
              </div>
                ))
              ) : (
                <div className="w-full flex justify-center">No challenges found for this course.</div>
              )}
            </Box>

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
            <Box >
              {/* <Button variant="contained" color="primary" sx={{ width: '200px' }}>
                My Submissions
              </Button> */}
              <div className="mt-10">
                    <h2 className="text-2xl font-bold m-4">Submissions</h2>
                    {submissions.length > 0 ? (
                        submissions.map((submission) => (
                            <div key={submission._id} className="bg-white rounded-lg shadow-lg p-6 w-[95%] m-6 cursor-pointer">
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
                        <p className="text-gray-600 m-4">No submissions yet.</p>
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

export default Auth(AdminPage);