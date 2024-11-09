"use client";
import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  IconButton,
  Badge,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import Layout from "@/components/layout";
import "../../../app/globals.css";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Assignment from "@/Interfaces/assignment";
import { dummyAssignments, dummyChallenges } from "@/pages/SampleData/Sample";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import ButtonComp from "@/components/button";
import { useStore } from "@/store";
import { CldUploadWidget } from "next-cloudinary";
import AssignmentModal from "@/components/AssignmentModal";
import SearchUserModal from "@/components/SearchUser";
import KickUserModal from "@/components/KickUserModal";
import User from "@/Interfaces/user";
import toast from "react-hot-toast";

const AdminPage: React.FC = () => {
  const [enrolledUsers, setEnrolledUsers] = React.useState<User[]>([]);
  const [openSearch, setOpenSearch] = React.useState<boolean>(false);
  const [openKick, setOpenKick] = React.useState<boolean>(false);
  const [currentAssignmentPage, setCurrentAssignmentPage] = React.useState(1);
  const [currentChallengePage, setCurrentChallengePage] = React.useState(1);
  const [currentUserPage, setCurrentUserPage] = React.useState(1);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [assignments, setassignments] = useState<Assignment[]>([]);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAssignment, setopenAssignment] = useState(false);
  const [challengeIdToDelete, setChallengeIdToDelete] = useState<string | null>(
    null
  );
  const [AssignmentIdToDelete, setAssignmentIdToDelete] = useState<
    string | null
  >(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDoc, setChallengeDoc] = useState("");
  const [type, setType] = useState("individual");
  const [frequency, setFrequency] = useState("daily");
  const [points, setPoints] = useState<number | undefined>();
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openUploadAssignmentModal, setOpenUploadAssignmentModal] =
    useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDoc, setAssignmentDoc] = useState("");
  const [assignmentPoints, setAssignmentPoints] = useState<
    number | undefined
  >();
  const [yo, setyo] = useState(false);
  const courseId = "6729e6d6f4a82d6fedab5625";
  const { user, setUser } = useStore();
  const router = useRouter();
  const itemsPerPage = 5;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCurrentAssignmentPage(1);
    setCurrentChallengePage(1);
    setCurrentUserPage(1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = (result: any) => {
    if (result && result.info) {
      setAssignmentDoc(result.info.url);
      console.log("Upload result info:", result.info);
      toast.success("Uploaded result");
    } else {
      console.error("Upload failed or result is invalid.");
      toast.error("Upload failed or result is invalid.");
    }
  };

  const handleUploadChallenge = (result: any) => {
    if (result && result.info) {
      setChallengeDoc(result.info.url);
      console.log("Upload result info:", result.info);
      toast.success("Uploaded result info:");
    } else {
      console.error("Upload failed or result is invalid.");
      toast.error("Upload failed or result is invalid.");
    }
  };

  const handleSubmitChallenge = async () => {
    try {
      let End = new Date(startDate);
      if (frequency === "daily") {
        End.setDate(End.getDate() + 1);
      }
      if (frequency === "weekly") {
        End.setDate(End.getDate() + 7);
      }
      const response = await axios.post("/api/challenge/uploadchallenge", {
        title,
        description,
        startDate,
        endDate: End.toISOString().split("T")[0],
        challengeDoc,
        type,
        frequency,
        points,
        createdBy: user._id,
        courseId,
      });
      setChallenges((prev) => [...prev, response.data.Challenge]);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setChallengeDoc("");
      setType("individual");
      setFrequency("daily");
      setPoints(undefined);
      setOpenUploadModal(false);
      setyo(!yo);

      toast.success("Submitted Challenge");
    } catch (error) {
      console.error("Error uploading challenge:", error);
      toast.error("Error uploading challenge:");
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
        status: "Open",
      });
      console.log("Assignment uploaded successfully:", response.data);
      setAssignmentTitle("");
      setAssignmentDescription("");
      setAssignmentDueDate("");
      setAssignmentDoc("");
      setAssignmentPoints(undefined);
      setOpenUploadAssignmentModal(false);
      setyo(!yo);

      toast.success("Uploaded the assignment");
    } catch (error) {
      console.error("Error uploading assignment:", error);
      toast.error("Error uploading assignment:");
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(
        `/api/challenge/getchallengebycourse?CourseId=${courseId}`
      );
      console.log(response.data.data);
      setChallenges(response.data.data);
      console.log(challenges);
      toast.success("Challenges fetched");
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Error fetching challenges:");
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `/api/assignment/getassignmentsbycourse?CourseId=${courseId}`
      );
      console.log(response.data.data);
      setassignments(response.data.data);
      console.log(assignments);
      toast.success("Assignments fetched");
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Error fetching challenges:");
    }
  };

  const fetchEnrolledUsers = async () => {
    try {
      const response = await axios.get("/api/course/get-enrolled", {
        params: {
          courseId,
        },
      });

      setEnrolledUsers(response.data.users);
      toast.success("Fetched enrolled users");
    } catch (error) {
      console.log(
        "Error while fetching all the enrolled users of the course",
        error
      );
      toast.error("Error while fetching all the enrolled users of the course");
      return;
    }
  };

  const DeleteChallenge = async () => {
    if (challengeIdToDelete) {
      try {
        const response = await axios.delete(
          `/api/challenge/deletechallenge?Id=${challengeIdToDelete}`
        );
        setChallenges((prev) =>
          prev.filter((challenge) => challenge._id !== challengeIdToDelete)
        );
        console.log(response.data);
        handleCloseModal();
        toast.success("Deleted challenges");
      } catch (error) {
        console.error("Error deleting challenges:", error);
        toast.error("Error deleting challenges:");
      }
    }
  };
  const DeleteAssignment = async () => {
    if (AssignmentIdToDelete) {
      try {
        const response = await axios.delete(
          `/api/assignment/delete-assignment?Id=${AssignmentIdToDelete}`
        );
        setassignments((prev) =>
          prev.filter((assignment) => assignment._id !== AssignmentIdToDelete)
        );
        console.log(response.data);
        handleCloseAssignmentModal();
        toast.success("Deleted Assignment");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Error deleting Assignment:");
      }
    }
  };

  const kickOut = async (userData: any) => {
    try {
      const obj = {
        userId: userData?._id,
        courseId,
      };
      console.log(obj);
      const response = await axios.delete("/api/course/kick-user", {
        params: obj,
      });
      console.log(response);
      fetchEnrolledUsers();
      toast.success("Kicked out the user");
    } catch (error) {
      console.log("Error while kicking out the user", error);
      toast.error("Error while Kicking out the user");
    }
  };

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

  const handleAssignmentPageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentAssignmentPage(page);
  };

  const handleChallengePageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentChallengePage(page);
  };

  const handleUserPageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentUserPage(page);
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

  React.useEffect(() => {
    fetchAssignments();
    fetchChallenges();
    fetchEnrolledUsers();
  }, [courseId, yo]);

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
            <Box sx={{ mt: 1 }}>
              <AssignmentModal
                open={open}
                handleClose={handleClose}
                courseId={courseId}
              />
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignContent: "center",
                  gap: 10,
                }}
              >
                <Pagination
                  count={Math.ceil(assignments.length / itemsPerPage)}
                  variant="outlined"
                  color="secondary"
                  page={currentAssignmentPage}
                  onChange={handleAssignmentPageChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "200px" }}
                  onClick={() => setOpenUploadAssignmentModal(true)}
                >
                  Upload Assignment
                </Button>
              </Box>

              {paginatedAssignments.length > 0 ? (
                paginatedAssignments.map((assignment) => (
                  <Box
                    key={assignment._id}
                    sx={{
                      mt: 1,
                      mb: 3,
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {assignment.title}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ display: "inline", fontWeight: "bold" }}
                        >
                          Total Points:
                        </Typography>
                        <Badge
                          badgeContent={assignment.totalPoints}
                          color="secondary"
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, backgroundColor: "aliceblue" }}
                      >
                        <strong>Uploaded At:</strong>{" "}
                        {new Date(assignment.uploadedAt).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, backgroundColor: "aliceblue" }}
                      >
                        <strong>Due Date:</strong>{" "}
                        {assignment.DueDate?.toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Description:</strong> <br />
                      {assignment.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      {/* Status Button */}
                      <Box
                        sx={{ display: "flex", gap: 2, alignContent: "center" }}
                      >
                        <Typography>Status</Typography>
                        <Button variant="outlined" color="primary">
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
                          animation: "fadeIn 1.5s ease-in-out",
                          "@keyframes fadeIn": {
                            "0%": { opacity: 0 },
                            "100%": { opacity: 1 },
                          },
                        }}
                      >
                        View Document
                      </Button>

                      <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() =>
                          router.push(`/Assignment/admin/${assignment._id}`)
                        }
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

              <Modal
                open={openUploadAssignmentModal}
                onClose={() => setOpenUploadAssignmentModal(false)}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Add New Assignment
                  </Typography>
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
                      <Button
                        onClick={() => open()}
                        variant="outlined"
                        color="primary"
                        fullWidth
                      >
                        Select File
                      </Button>
                    )}
                  </CldUploadWidget>

                  <TextField
                    fullWidth
                    type="number"
                    label="Points"
                    value={assignmentPoints}
                    onChange={(e) =>
                      setAssignmentPoints(parseInt(e.target.value))
                    }
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitAssignment}
                  >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  gap: 10,
                  mb: 2,
                }}
              >
                <Pagination
                  count={Math.ceil(challenges.length / itemsPerPage)}
                  page={currentChallengePage}
                  onChange={handleChallengePageChange}
                  variant="outlined"
                  color="secondary"
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "200px" }}
                  onClick={() => setOpenUploadModal(true)}
                >
                  Add Challenge
                </Button>
              </Box>

              <Modal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Add New Challenge
                  </Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <CldUploadWidget
                    uploadPreset="acad_helper_pdf	"
                    onSuccess={handleUploadChallenge}
                  >
                    {({ open }) => (
                      <Button
                        onClick={() => open()}
                        variant="outlined"
                        color="primary"
                        fullWidth
                      >
                        Select File
                      </Button>
                    )}
                  </CldUploadWidget>
                  <Select
                    fullWidth
                    value={type}
                    onChange={(e) => setType(e.target.value as string)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                  <Select
                    fullWidth
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as string)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                  <TextField
                    fullWidth
                    type="number"
                    label="Points"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitChallenge}
                  >
                    Submit Challenge
                  </Button>
                </Box>
              </Modal>

              {paginatedChallenges.length > 0 ? (
                paginatedChallenges.map((challenge) => (
                  <Box
                    key={challenge._id}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        p: 1,
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {challenge.title}
                      </Typography>
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          gap: 2,
                          alignContent: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ display: "inline", fontWeight: "bold" }}
                        >
                          Total Points:
                        </Typography>
                        <Badge
                          badgeContent={challenge.points}
                          color="secondary"
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Start Date:</strong>{" "}
                        {new Date(challenge.startDate).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>End Date:</strong>{" "}
                        {new Date(challenge.endDate).toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Description: </strong>
                      <br /> {challenge.description}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignContent: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Type:</strong>{" "}
                        {challenge.type.charAt(0).toUpperCase() +
                          challenge.type.slice(1)}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Frequency:</strong>{" "}
                        {challenge.frequency.charAt(0).toUpperCase() +
                          challenge.frequency.slice(1)}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          router.push(`/Challenge/${challenge._id}`)
                        }
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                mb: 2,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Pagination
                  count={Math.ceil(enrolledUsers.length / itemsPerPage)}
                  page={currentUserPage}
                  onChange={handleUserPageChange}
                  variant="outlined"
                  color="secondary"
                />

                <SearchUserModal
                  open={openSearch}
                  setOpen={setOpenSearch}
                  courseId={courseId}
                />
                <KickUserModal
                  open={openKick}
                  setOpen={setOpenKick}
                  courseId={courseId}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenSearch(true)}
                >
                  Make Admin
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenKick(true)}
                >
                  Kick Out User
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mb: 2,
                  mt: 2,
                }}
              >
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
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#f9f9f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6">{user.username}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Email: {user.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => router.push(`/Profile/${user._id}`)}
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => kickOut(user)}
                        >
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

        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              outline: "none",
              zIndex: 1300,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Confirm Delete
            </Typography>
            <Typography id="modal-description" sx={{ mb: 4 }}>
              Are you sure you want to delete this challenge?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                onClick={DeleteChallenge}
                variant="contained"
                color="secondary"
              >
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
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              outline: "none",
              zIndex: 1300,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Confirm Delete
            </Typography>
            <Typography id="modal-description" sx={{ mb: 4 }}>
              Are you sure you want to delete this assignment?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={handleCloseAssignmentModal}
                color="primary"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={DeleteAssignment}
                variant="contained"
                color="secondary"
              >
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
