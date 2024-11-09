import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Submission from "@/Interfaces/submission";
import '../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';
// import { Modal, Button, Form } from 'react-bootstrap';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, TableBody, TableHead, TableCell, TableRow } from '@mui/material';
import Layout from "@/components/layout";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Auth from '@/components/Auth'
interface EditChallenge {
  title: string;
  description: string;
  challengeDoc?: string;
  type: "individual" | "team";
  frequency: "daily" | "weekly";
  startDate: Date;
  points: number;
}

const ChallengeDetails: React.FC = () => {
  const router = useRouter();
  const { query } = router
  console.log(query)
  const { id } = router.query;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [yo, setyo] = useState(false);
  const [show, setShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [editedchallenge, seteditedchallenge] = useState<EditChallenge | null>(null);
  console.log(id)
  const challengeId = typeof id === 'string' ? id : '';

  
  useEffect(() => {
    if (challengeId) {
      const fetchChallenge = async () => {
        try {
          const response = await axios.get(`/api/challenge/getchallengeById?Id=${challengeId}`);
          setChallenge(response.data.data);
        } catch (error) {
          console.error("Error fetching challenge details:", error);
        }
      };
      fetchChallenge();
    }
  }, [challengeId]);

  useEffect(() => {
    if (challengeId) {
      const fetchSubmissions = async () => {
        try {
          const submissionsResponse = await axios.get(`/api/submission/getsubmissionbychallenge?challengeId=${challengeId}`);
          setSubmissions(submissionsResponse.data.data);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };
      fetchSubmissions();
    }
  }, [challengeId, yo]);

  const handleClose = () => {
    setShow(false);
    setErrorMessage('')
  }

  const handleShow = () => {
    setShow(true);
    console.log(challenge)
    seteditedchallenge({
      title: challenge?.title || "",
      description: challenge?.description || "",
      challengeDoc: challenge?.challengeDoc || "",
      type: challenge?.type || "team",
      frequency: challenge?.frequency || "daily",
      startDate: challenge?.startDate || new Date(),
      points: challenge?.points || 0
    })
  }

  const handleEdit = async () => {
    const submitbutton = async () => {
      try {
        let End = editedchallenge?.startDate 
        if(editedchallenge?.frequency==="daily"){
          End?.setDate(End?.getDate()+1)
        }
        if(editedchallenge?.frequency==="weekly"){
          End?.setDate(End?.getDate()+7)
        }
        if (editedchallenge?.title === '' || editedchallenge?.description === '' || editedchallenge?.challengeDoc === '' || (editedchallenge?.frequency !== 'daily' && editedchallenge?.frequency !== 'weekly') || (editedchallenge?.type !== 'team' && editedchallenge?.type !== 'individual')) {
          setErrorMessage("All entries should be filled");
          return;
        }
        const res = await axios.post(`/api/challenge/editchallenge?Id=${challenge?._id}`, editedchallenge);
        console.log(res.data);
        seteditedchallenge({
          title: "",
          description: "",
          challengeDoc: "",
          type: "individual",
          frequency: "daily",
          startDate: new Date(),
          points: 0
        });
        setErrorMessage("");
        setyo(prev => !prev)
        handleClose()
      } catch (err) {
        console.log(err);
      }
    }
    submitbutton()
  };

  const approve = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/approve-a-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }
  const deletesub = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/remove-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      // if (e.response && e.response.status === 400) {
      //   toast.error(e.response.data.message);
      // } else {
      //   toast.error("An unexpected error occurred. Please try again.");
      // }
      console.error("Error while removing:", e);
    }
  }
  const disapprove = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/disapprove-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }

  const approveall = async () => {
    try {
      const response = await axios.patch(`/api/submission/approve-all-submission-challenge?Id=${challengeId}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }

  if (!challenge) return <div>Loading...</div>;

  return (
    <Layout>
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className='m-4'>
      <button
          onClick={() => router.push(`/admin/Courses`)}
          className="mb-4 text-blue-400 rounded hover:bg-blue-100 transition"
        >
          <ArrowBackIosNewIcon/>
        </button>
        <div className="flex justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Title: {challenge.title}</h1>
            <p className="text-gray-700 w-[50vw] px-1"> Description: {challenge.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="mb-4">
              <span className="font-semibold">Type:</span> {challenge.type}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Frequency:</span> {challenge.frequency}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Points:</span> {challenge.points}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Start Date:</span> {new Date(challenge.startDate).toLocaleDateString()}
            </div>
            <div className="mb-4">
              <span className="font-semibold">End Date:</span> {new Date(challenge.endDate).toLocaleDateString()}
            </div>
            {challenge.challengeDoc && (
              <div className="mb-4">
                <span className="font-semibold">Challenge Document:</span>{" "}
                <a href={challenge.challengeDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end w-full">
        <Button variant = "outlined" onClick={handleShow} sx={{marginX:"10px"}}>
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
            </TableRow>
          </TableHead>
          <TableBody>
          {submissions.map((submission) => (
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
                 <ThumbUpIcon/>
            </button>
            </TableCell>
            <TableCell align="right">
               <button className="mb-2 flex justify-between p-4 text-red-500" onClick={() => { disapprove(submission._id) }}>
                 <ThumbDownIcon/>
               </button>
            </TableCell>
            <TableCell align="right">
               <button className="mb-2 flex justify-between p-4" onClick={() => { deletesub(submission._id) }}>
                 <DeleteIcon/>
               </button>
            </TableCell>
          </TableRow>
          ))}
          </TableBody>
          </Table>
        </TableContainer>
        ) : (
          <p>No submissions found for this challenge.</p>
        )}

       

<div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Edit Challenge</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editedchallenge?.title || ""}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, title: e.target.value }))}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editedchallenge?.description || ""}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, description: e.target.value }))}
          />
          <TextField
            label="Points"
            type="number"
            fullWidth
            margin="normal"
            value={editedchallenge?.points || 0}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, points: parseInt(e.target.value, 10) }))}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={editedchallenge?.startDate ? editedchallenge.startDate : ""}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, startDate: new Date(e.target.value) }))}
          />
          <TextField
            label="Challenge Document"
            fullWidth
            margin="normal"
            value={editedchallenge?.challengeDoc || ""}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, challengeDoc: e.target.value }))}
          />
          <TextField
            label="Type"
            select
            fullWidth
            margin="normal"
            value={editedchallenge?.type || "individual"}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, type: e.target.value as "individual" | "team" }))}
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="team">Team</MenuItem>
          </TextField>
          <TextField
            label="Frequency"
            select
            fullWidth
            margin="normal"
            value={editedchallenge?.frequency || "daily"}
            onChange={(e) => seteditedchallenge((prev) => ({ ...prev!, frequency: e.target.value as "daily" | "weekly" }))}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </TextField>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </DialogContent>
        <DialogActions>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleEdit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>

      </div>
    </div>
    </Layout>
  );
};

export default Auth(ChallengeDetails);