import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Submission from "@/Interfaces/submission";
import Assignment from "@/Interfaces/assignment";
import "../../../app/globals.css";
import toast, { Toaster } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  LinearProgress
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Auth from '@/components/Auth'
import { AdminAssignmentAuth } from "@/components/AdminAssignmentAuth";
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});

interface EditAssignment {
  title: string;
  description?: string;
  DueDate?: Date;
  AssignmentDoc: string;
  totalPoints: number;
  status: "Open" | "Closed" | "Graded";
}

const AssignmentDetails: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const { id } = router.query;
  const [assignment, setassignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [yo, setyo] = useState(false);
  const [show, setShow] = useState(false)
  const [showmodal, setShowmodal] = useState(false)
  const [bonus, setBonus] = useState<number>(0);
  const [deduct, setDeduct] = useState<number>(0);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedassignment, seteditedassignment] =
    useState<EditAssignment | null>(null);
  const assignmentId = typeof id === "string" ? id : "";
  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        try {
          const response = await axios.get(
            `/api/assignment/getassignmentById?Id=${assignmentId}`
          );
          setassignment(response.data.data);
          toast.success("Fetched the challenge details")
        } catch (error: any) {
          toast.error(error.response.data.error)
        }
      };
      fetchAssignment();
    }
  }, [assignmentId]);

  useEffect(() => {
    if (assignmentId) {
      const fetchSubmissions = async () => {
        try {
          const submissionsResponse = await axios.get(
            `/api/submission/getsubmissionbyassignment?assignmentId=${assignmentId}`
          );
          setSubmissions(submissionsResponse.data.data);
          toast.success("Fetched the submissions");
        } catch (error: any) {
          toast.error(error.response.data.error)
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId, yo]);

  const handleClose = () => {
    setShow(false);
    setErrorMessage("");
  };

  const handleShow = () => {
    setShow(true);
    seteditedassignment({
      title: assignment?.title || "",
      description: assignment?.description || "",
      DueDate: assignment?.DueDate || new Date(),
      AssignmentDoc: assignment?.AssignmentDoc || "",
      totalPoints: assignment?.totalPoints || 0,
      status: assignment?.status || "Open",
    });
  };

  const handleEdit = async () => {
    const submitbutton = async () => {
      try {
        if (
          editedassignment?.title === "" ||
          editedassignment?.description === "" ||
          editedassignment?.AssignmentDoc === "" ||
          (editedassignment?.status !== "Open" &&
            editedassignment?.status !== "Graded" &&
            editedassignment?.status !== "Closed")
        ) {
          setErrorMessage("All entries should be filled");
          toast.error("All entries much be filled")
          return;
        }
        const res = await axios.patch(
          `/api/assignment/editassignment?Id=${assignment?._id}`,
          editedassignment
        );
        seteditedassignment({
          title: "",
          description: "",
          AssignmentDoc: "",
          status: "Open",
          DueDate: new Date(),
          totalPoints: 0,
        });
        setErrorMessage("");
        setyo((prev) => !prev);
        handleClose();
        toast.success("Edited successfully")
      } catch (error: any) {
        toast.error(error.response.data.error)
      }
    };
    submitbutton();
  };

  const approve = async (id: string) => {
    try {
      const response = await axios.patch(
        `/api/submission/approve-a-submission?Id=${id}`
      );
      setyo(!yo);
      toast.success("Approved")
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };


  const deletesub = async (id: string) => {
    try {
      const response = await axios.patch(
        `/api/submission/remove-submission?Id=${id}`
      );
      setyo(!yo);
      toast.success("Deleted the submission")
    } catch (e: any) {
      toast.error("Error while deleting the submission")
    }
  };


  const disapprove = async (id: string) => {
    try {
      const response = await axios.patch(
        `/api/submission/disapprove-submission?Id=${id}`
      );
      setyo(!yo);
      toast.success("Disapproved successfully")
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }

    }
  }


  const handleOpenModal = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setShowmodal(true);
  };

  const handleCloseModal = () => {
    setShowmodal(false);
    setBonus(0);
    setDeduct(0);
  };

  const bonusPoints = async () => {
    if (!selectedSubmissionId) return;
    try {
      const response = await axios.patch(`/api/submission/bonus-points?Id=${selectedSubmissionId}`, { bonus });
      setyo(!yo);
      toast.success("Bonus points awarded successfully!");
    } catch (e: any) {
      toast.error(e);
    }
    handleCloseModal();
  };

  const deductPoints = async () => {
    if (!selectedSubmissionId) return;
    try {
      const response = await axios.patch(`/api/submission/deduct-points?Id=${selectedSubmissionId}`, { deduct });
      setyo(!yo);
      toast.success("Points deducted successfully!");
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
    handleCloseModal();
  };

  const approveall = async () => {
    try {
      const response = await axios.patch(
        `/api/submission/approve-all-submission-assignment?Id=${assignmentId}`
      );
      setyo(!yo);
      toast.success("Approved all")
    } catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleUpload = (result: any) => {
    if (result && result.info) {
      seteditedassignment((prev) => ({
        ...prev!,
        AssignmentDoc: result.info.url,
      }));
      toast.success("Uploaded result")
    } else {
      toast.error("Upload failed")
    }
  };
  const today = new Date()
  const due = assignment?.DueDate ? new Date(assignment.DueDate) : null
  const status = due && due >= today ? 'Open' : 'Closed';
  if (!assignment) return <Layout><LinearProgress /></Layout>;

  return (
    <Layout>
      <div className=" bg-gray-100 min-h-screen p-10">
        <div>
          <button
            onClick={() => router.push(`/admin/Courses/${assignment.Course}`)}
            className="mb-4 text-blue-400 rounded hover:bg-blue-100 transition"
          >
            <ArrowBackIosNewIcon />
          </button>
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold w-[50vw] break-words">Title: {assignment.title}</h1>
              <p className="text-gray-700 m-1 w-[50vw] break-words">Description: {assignment.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="mb-4">
                <span className="font-semibold">Status :</span> {status}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Points :</span> {assignment.totalPoints}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Due Date :</span> {new Date(assignment.DueDate || new Date()).toLocaleDateString()}
              </div>
              {assignment.AssignmentDoc && (
                <div className="mb-4">
                  <span className="font-semibold">Assignment :</span>{" "}
                  <a href={assignment.AssignmentDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Button variant="outlined" onClick={handleShow} sx={{ marginX: "10px" }}>
              Edit assignment
            </Button>
            <Button
              color="success"
              variant="outlined"
              onClick={approveall}
              className=""
            >
              Approve All Submissions
            </Button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Submissions</h2>

          {submissions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Submission Link</TableCell>
                    <TableCell align="center">View Submission Details</TableCell>
                    <TableCell align="left">Approve</TableCell>
                    <TableCell align="left">Disapprove</TableCell>
                    <TableCell align="left">Delete</TableCell>
                    <TableCell align="center">Deduct/Bonus</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map(submission => (
                    <TableRow
                      key={submission._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <a href={submission.documentLink} className="text-blue-500 cursor-pointer"> Submission link </a>
                      </TableCell>
                      <TableCell align="center">
                        <a onClick={() => router.push(`/Submission/${submission._id}`)} className="text-blue-500  cursor-pointer">
                          Submission Details
                        </a>
                      </TableCell>
                      <TableCell align="right">
                        <button className="mb-2 flex justify-between p-4 text-green-400" onClick={() => { approve(submission._id) }}>
                          <ThumbUpIcon />
                        </button>
                      </TableCell>
                      <TableCell align="right">
                        <button className="mb-2 flex justify-between p-4 text-red-500" onClick={() => { disapprove(submission._id) }}>
                          <ThumbDownIcon />
                        </button>
                      </TableCell>
                      <TableCell align="right">
                        <button className="mb-2 flex justify-between p-4" onClick={() => { deletesub(submission._id) }}>
                          <DeleteIcon />
                        </button>
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => { handleOpenModal(submission._id) }} variant="outlined">
                          Deduct/Bonus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No submissions found for this assignment.</p>
          )}


          <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">

            <Dialog open={show} onClose={handleClose}>
              <DialogTitle>Edit assignment</DialogTitle>
              <DialogContent>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editedassignment?.title || ""}
                  onChange={(e) => seteditedassignment((prev) => ({ ...prev!, title: e.target.value }))}
                />
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  value={editedassignment?.description || ""}
                  onChange={(e) => seteditedassignment((prev) => ({ ...prev!, description: e.target.value }))}
                />
                <TextField
                  label="Points"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editedassignment?.totalPoints || 0}
                  onChange={(e) => seteditedassignment((prev) => ({ ...prev!, totalPoints: parseInt(e.target.value, 10) }))}
                />
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={editedassignment?.DueDate instanceof Date ? editedassignment.DueDate.toISOString().split('T')[0] : ""}
                  onChange={(e) => seteditedassignment((prev) => ({ ...prev!, DueDate: new Date(e.target.value) }))}
                />
                {editedassignment?.AssignmentDoc && (
                  <div className="mb-4">
                    <span className="font-semibold">Current Document:</span>{" "}
                    <a href={editedassignment.AssignmentDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View Document
                    </a>
                  </div>
                )}
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
                  label="Type"
                  select
                  fullWidth
                  margin="normal"
                  value={editedassignment?.status || "Open"}
                  onChange={(e) => seteditedassignment((prev) => ({ ...prev!, status: e.target.value as "Open" | "Closed" | "Graded" }))}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Graded">Graded</MenuItem>
                </TextField>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
              </DialogContent>
              <DialogActions>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleEdit} color="primary">Save Changes</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={showmodal} onClose={handleCloseModal}>
              <DialogTitle>Deduct/Bonus Points</DialogTitle>
              <DialogContent>
                <TextField
                  label="Bonus Points"
                  type="number"
                  fullWidth
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  margin="dense"
                />
                <TextField
                  label="Deduct Points"
                  type="number"
                  fullWidth
                  value={deduct}
                  onChange={(e) => setDeduct(Number(e.target.value))}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
                <Button onClick={bonusPoints} color="primary">Add Bonus</Button>
                <Button onClick={deductPoints} color="primary">Deduct Points</Button>
              </DialogActions>
            </Dialog>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Auth(AssignmentDetails);