"use client"
import * as React from "react";
import { Box, Button, TextField, Typography, Modal, IconButton, Badge, Pagination } from "@mui/material";
import Layout from "@/components/layout";
import "../../app/globals.css";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/interfaces/challenge";
import Assignment from "@/interfaces/assignment";
import {dummyAssignments,dummyChallenges }from '@/pages/SampleData/Sample'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Link from "next/link";
import { CldUploadWidget } from 'next-cloudinary';
import AssignmentModal from "@/components/AssignmentModal";
import SearchUserModal from "@/components/SearchUser";
import KickUserModal from "@/components/KickUserModal";
import User from "@/Interfaces/user";

const AdminPage: React.FC = () => {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [assignments, setassignments] = React.useState<Assignment[]>([]);
  const [enrolledUsers,setEnrolledUsers]=React.useState<User[]>([])
  const [open,setOpen]=React.useState<boolean>(false)
  const [openSearch,setOpenSearch]=React.useState<boolean>(false);
  const [openKick,setOpenKick]=React.useState<boolean>(false);
  const [value, setValue] = React.useState(0);
  const [currentAssignmentPage, setCurrentAssignmentPage] = React.useState(1);
  const [currentChallengePage, setCurrentChallengePage] = React.useState(1);
  const [currentUserPage, setCurrentUserPage] = React.useState(1);
  const itemsPerPage = 5; 
  const courseId = '6729e6d6f4a82d6fedab5625';
  const router = useRouter();


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCurrentAssignmentPage(1);
    setCurrentChallengePage(1);
    setCurrentUserPage(1);
  };



const handleClose=()=>{
  setOpen(false);
}



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

const fetchEnrolledUsers=async ()=>{
  try {
    const response=await axios.get('/api/course/get-enrolled',{
      params:{
        courseId
      }
    })

    setEnrolledUsers(response.data.users)

  } catch (error) {
    console.log("Error while fetching all the enrolled users of the course",error);
    return;
  }
}

const kickOut=async (userData:any)=>{
  try {
    const obj = {
      userId: userData?._id,
      courseId,
    };
    console.log(obj);
    const response = await axios.delete('/api/course/kick-user', {
      params: obj,
    });
    console.log(response);
    fetchEnrolledUsers();
  } catch (error) {
    console.log("Error while kicking out the user",error)
  }
}


const paginatedAssignments = assignments.slice(
  (currentAssignmentPage - 1) * itemsPerPage,
  currentAssignmentPage * itemsPerPage
);

const paginatedChallenges = challenges.slice(
  (currentChallengePage - 1) * itemsPerPage,
  currentChallengePage * itemsPerPage
);

const paginatedUsers = enrolledUsers.slice(
  (currentUserPage - 1) * itemsPerPage,
  currentUserPage * itemsPerPage
);


const handleAssignmentPageChange = (_: React.ChangeEvent<unknown>, page: number) => {
  setCurrentAssignmentPage(page);
};

const handleChallengePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
  setCurrentChallengePage(page);
};

const handleUserPageChange = (_: React.ChangeEvent<unknown>, page: number) => {
  setCurrentUserPage(page);
};


React.useEffect(() => {
    fetchAssignments();
    fetchChallenges();
    fetchEnrolledUsers();
  }, [courseId]);

  return (
    <Layout>
      <Box sx={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>
            Admin Dashboard
        </Typography>
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
                <Box sx={{ mt:1 }}>

                        <AssignmentModal open={open} handleClose={handleClose} courseId={courseId}/>
                          <Box
                          sx={{display:"flex",width:"100%",justifyContent:"center",alignContent:"center",gap:10}}
                          >
                            <Pagination
                             count={Math.ceil(assignments.length / itemsPerPage)}
                             variant="outlined" 
                             color="secondary" 
                              page={currentAssignmentPage}
                              onChange={handleAssignmentPageChange}
                             />
                          <Button onClick={() => setOpen(true)}  variant="outlined" color="primary">
                            Upload assignment
                          </Button>
                        </Box>
                   


                            

                    {paginatedAssignments.length > 0 ? (
                        paginatedAssignments.map((assignment) => (
                        <Box
                            key={assignment._id}
                            sx={{
                                mt:1,
                                mb: 3,
                                p: 2,
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#fafafa',
                            }}
                        >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {assignment.title}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                                    Total Points:
                                </Typography>
                                <Badge badgeContent={assignment.totalPoints} color="secondary" sx={{ ml: 2 }} />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body2" sx={{ mb: 1, backgroundColor: 'aliceblue' }}>
                                <strong>Uploaded At:</strong> {new Date(assignment.uploadedAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, backgroundColor: 'aliceblue' }}>
                                <strong>Due Date:</strong> {new Date(assignment.DueDate).toLocaleString()}
                            </Typography>
                        </Box>

                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Description:</strong> <br />
                            {assignment.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent:"space-around",alignItems:"center", gap: 2, mt: 2 }}>
                            {/* Status Button */}
                            <Box
                             sx={{display:"flex",gap:2,alignContent:"center"}}
                            >
                                <Typography>
                                    Status
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    >
                                    
                                    {assignment.status}
                                </Button>
                            </Box>

                            {/* View Document Button */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                href={assignment.AssignmentDoc}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    animation: 'fadeIn 1.5s ease-in-out',
                                    '@keyframes fadeIn': {
                                        '0%': { opacity: 0 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                View Document
                            </Button>


                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => router.push(`/Challenge/${assignment._id}`)}
                            >
                                View Details
                            </Button>
                        </Box>

                        </Box>

                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                            No assignments available.
                    </Typography>
                )}
                </Box>
         
          </>
        )}





        {value === 1 && (
          <>
          <Box sx={{ mt: 2 }}>

            <Box sx={{ display: 'flex', justifyContent: 'center',alignContent:"center",gap:10, mb: 2 }}>
                  <Pagination  
                    count={Math.ceil(challenges.length / itemsPerPage)}
                    page={currentChallengePage}
                    onChange={handleChallengePageChange}
                    variant="outlined" 
                    color="secondary" />

                <Button variant="contained" color="primary" sx={{ width: '200px' }}>
                     Add Challenge
                </Button>
            </Box>

            {paginatedChallenges.length > 0 ? (

              paginatedChallenges.map((challenge) => (
                <Box
                    key={challenge._id}
                    sx={{
                        mb: 3,
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fafafa',
                    }}
                >

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        p:1
                    }}
                    >
                         <Typography variant="h5" gutterBottom>
                            {challenge.title}
                        </Typography>
                        <Box sx={{ mb: 1,display:"flex",gap:2,alignContent:"center",justifyContent:"space-between" }}>
                                <Typography variant="body2" sx={{ display: 'inline', fontWeight: 'bold' }}>
                                    Total Points:
                                </Typography>
                                <Badge badgeContent={challenge.points} color="secondary" />
                        </Box>
                    </Box>

                    <Box
                     sx={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignContent:"center",
                        gap:2,
                        width:"100%"
                     }}
                    >
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Start Date:</strong> {new Date(challenge.startDate).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>End Date:</strong> {new Date(challenge.endDate).toLocaleString()}
                        </Typography>
                    </Box>
                   
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Description: </strong><br />  {challenge.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2,display:"flex",justifyContent:"space-evenly",alignContent:"center" }}>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Type:</strong> {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Frequency:</strong> {challenge.frequency.charAt(0).toUpperCase() + challenge.frequency.slice(1)}
                        </Typography>
                    
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Created By:</strong> {challenge.createdBy}
                        </Typography>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => router.push(`/Challenge/${challenge._id}`)}
                        >
                            View Details
                        </Button>
                    </Box>
                </Box>
              ))
            ) : (
              <Typography>No challenges found for this course.</Typography>
            )}
          </Box>
          
        </>
        )}



        {/* admin features -> view the users ,making the user admin etc */}
        {value === 2 && (
          <>
          <Box sx={{ display: 'flex',flexDirection:"column", justifyContent: 'flex-end', mb: 2,mt:2}}>
             
            <Box
            sx={{
              width:"100%",
              display:"flex",
              justifyContent:"space-evenly",
              alignItems:"center"
            }}

            >

              <Pagination  
              count={Math.ceil(enrolledUsers.length / itemsPerPage)}
              page={currentUserPage}
              onChange={handleUserPageChange} 
              variant="outlined" 
              color="secondary" />
             
              <SearchUserModal open={openSearch} setOpen={setOpenSearch} courseId={courseId}/>
              <KickUserModal open={openKick} setOpen={setOpenKick} courseId={courseId}/>
              <Button
                variant="outlined"
                size="small"
                onClick={()=>setOpenSearch(true)}
              >
                Make Admin
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={()=>setOpenKick(true)}
              >
                Kick Out User
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 2, mt: 2}}>
              <Typography variant="h5" gutterBottom>
                Enrolled Users
              </Typography>

              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6">{user.username}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Email: {user.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" color="primary" onClick={() => router.push(`/Profile/${user._id}`)}>
                          View Profile
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={()=>kickOut(user)}>
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No users enrolled in this course.
                  </Typography>
                )}
          </Box>


          </Box>
        </>
        )}
        
      </Box>
    </Layout>
  );
};

export default AdminPage;