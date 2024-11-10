import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Submission from "@/Interfaces/submission";
import '../../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Modal, Typography, Box, FormControl, Select, InputLabel, Divider, LinearProgress } from '@mui/material';
import { useStore } from "@/store";
import { CldUploadWidget } from 'next-cloudinary';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
import Team from "@/Interfaces/team";
interface EditChallenge {
  title: string;
  description: string;
  challengeDoc?: string;
  type: "individual" | "team";
  frequency: "daily" | "weekly";
  startDate: Date;
  points: number;
}
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

//Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ChallengeDetails: React.FC = () => {
  const router = useRouter();
  const { query } = router
  const { user, setUser } = useStore()
  const { id } = router.query;
  const [challengeDoc, setchallengeDoc] = useState("")
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [yo, setyo] = useState(false);
  const [show, setShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [isDocVisible, setIsDocVisible] = useState<boolean>(false);
  const [editedchallenge, seteditedchallenge] = useState<EditChallenge | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false)
  const [groups, setGroups] = useState<Team[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("")

  //Submit modal 
  const handleSubmitOpen = () => setSubmitOpen(true);
  const handleSubmitClose = () => setSubmitOpen(false);

  const challengeId = typeof id === 'string' ? id : '';

  //Fetching all teams of the user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get("/api/team/", {
          params: { userId: user?._id },
        });
        if (data.success) {
          setGroups(data.teams);
        }
      } catch (error: any) {
        toast.error(error.response.data.error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (challengeId) {
      const fetchChallenge = async () => {
        try {
          const response = await axios.get(`/api/challenge/getchallengeById?Id=${challengeId}`);
          setChallenge(response.data.data);
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      };
      fetchChallenge();
    }
  }, [challengeId]);

  useEffect(() => {
    if (challengeId) {
      const fetchSubmissions = async () => {
        try {
          const submissionsResponse = await axios.get(
            `/api/submission/getsubmissionbychallengeanduser?challengeId=${challengeId}&userId=${user?._id}`
          );
          setSubmissions(submissionsResponse.data.data);
        } catch (error: any) {
          toast.error(error.message);
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

  const deletesub = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/remove-submission?Id=${id}`);
      setyo(!yo);
    }
    catch (e: any) {
      toast.error(e.response.data.message);
    }
  }

  const handleEditsub = async (id: string) => {
    if (!challengeDoc) toast.error("Select file first")
    const submitwala = {
      documentLink: challengeDoc
    }
    try {
      const response = await axios.patch(`/api/submission/edit-submission?Id=${id}`, submitwala);
      setchallengeDoc("")
      setIsDocVisible(false);
      setyo(!yo);
    }
    catch (e: any) {
      console.error("Error while editing:", e.response.data.error);
    }
  }

  const handlesub = async (type: any, groupId = "") => {
    if (type == "team" && groupId == "") {
      toast.error("Select a group")
      return;
    }
    const submitwala = {
      user: user?._id,
      challenge: challengeId,
      documentLink: challengeDoc,
      type,
      Course: challenge?.courseId,
      groupId
    }
    try {

      const response = await axios.post('/api/submission', submitwala);
      setchallengeDoc("")
      setIsDocVisible(false);
      setyo(!yo);
      setSubmitOpen(false)
    }
    catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const handleUpload = (result: any) => {
    if (result && result.info) {
      setchallengeDoc(result.info.url)
      setIsDocVisible(true);
    } else {
      console.error("Upload failed or result is invalid.");
    }
  };

  if (!challenge) return <Layout><LinearProgress /></Layout>;

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-10 px-5">
        <button
          onClick={() => router.push(`/user/Courses/${challenge.courseId}`)}
          className="mx-4 text-blue-400 rounded hover:bg-blue-100 transition"
        >
          <ArrowBackIosNewIcon />
        </button>
        <div className="m-4">
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Title: {challenge.title}</h1>
              <p className="text-gray-700 p-1 max-w-500px break-words">Description: {challenge.description}</p>
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
          <div className="flex">
            <CldUploadWidget uploadPreset="acad_helper_pdf" onSuccess={handleUpload}>
              {({ open }) => (
                <Button className="mt-4" onClick={() => open()} variant="outlined" color="primary">
                  Select File
                </Button>
              )}
            </CldUploadWidget>
            <button
              onClick={() => {
                if (submissions.length > 0) {
                  handleEditsub(submissions[0]._id);
                } else {
                  if (!challengeDoc) {
                    toast.error("Select file first");
                  } else if (challenge.type == "individual") {
                    handlesub("individual")
                  } else {
                    handleSubmitOpen();
                  }
                }
              }}
              className="bg-blue-600 px-4 mt-4 ml-2 text-white rounded hover:bg-blue-700 transition"
            >
              {submissions.length > 0 ? "Edit Submission" : "Submit Challenge"}
            </button>
          </div>

          {isDocVisible && challengeDoc && (
            <div>
              <a href={challengeDoc} className="text-blue-500 " target="_blank" rel="noopener noreferrer">
                View Uploaded Document
              </a>
            </div>
          )}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Submissions</h2>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                    <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      View Submission
                    </a>
                    <Button onClick={() => { deletesub(submission._id) }}>Delete submission</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No submissions yet.</p>
            )}
          </div>


        </div>
      </div>
      <Modal
        open={submitOpen}
        onClose={handleSubmitClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select your group
          </Typography>
          <div className="flex my-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedGroup}
                label="Age"
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {
                  groups.length > 0 && groups.map(group =>
                    <MenuItem key={group?._id.toString()} value={group?._id.toString()}>{group?.teamname}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            <Button type="button" variant="outlined" sx={{ marginLeft: "1rem" }} onClick={() => handlesub("team", selectedGroup)}>Submit</Button>
          </div>

        </Box>
      </Modal>
      <Toaster />
    </Layout>
  );
};

export default ChallengeDetails;