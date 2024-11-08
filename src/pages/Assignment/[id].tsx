import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Submission from "@/Interfaces/submission";
import Assignment from "@/Interfaces/assignment";
import toast from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  MenuItem,
  Typography,
  Box,
  Container,
} from '@mui/material';

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
  const { id } = router.query;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedAssignment, setEditedAssignment] = useState<EditAssignment | null>(null);
  const assignmentId = typeof id === 'string' ? id : '';

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        try {
          const response = await axios.get(`/api/assignment/getassignmentById?Id=${assignmentId}`);
          setAssignment(response.data.data);
        } catch (error) {
          console.error("Error fetching assignment details:", error);
        }
      };
      fetchAssignment();
    }
  }, [assignmentId]);

  useEffect(() => {
    if (assignmentId) {
      const fetchSubmissions = async () => {
        try {
          const response = await axios.get(`/api/submission/getsubmissionbyassignment?assignmentId=${assignmentId}`);
          setSubmissions(response.data.data);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleClose = () => {
    setShow(false);
    setErrorMessage('');
  };

  const handleShow = () => {
    setShow(true);
    setEditedAssignment({
      title: assignment?.title || "",
      description: assignment?.description || "",
      DueDate: assignment?.DueDate || new Date(),
      AssignmentDoc: assignment?.AssignmentDoc || "",
      totalPoints: assignment?.totalPoints || 0,
      status: assignment?.status || "Open",
    });
  };

  const handleEdit = async () => {
    try {
      if (!editedAssignment?.title || !editedAssignment?.description || !editedAssignment?.AssignmentDoc) {
        setErrorMessage("All fields are required.");
        return;
      }
      await axios.patch(`/api/assignment/editassignment?Id=${assignment?._id}`, editedAssignment);
      setErrorMessage("");
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = (result: any) => {
    if (result && result.info) {
      setEditedAssignment((prev) => ({ ...prev!, AssignmentDoc: result.info.url }));
    } else {
      console.error("Upload failed or result is invalid.");
    }
  };

  if (!assignment) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" gutterBottom>{assignment.title}</Typography>
        <Typography variant="body1">{assignment.description}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="body2"><strong>Status:</strong> {assignment.status}</Typography>
        <Typography variant="body2"><strong>Points:</strong> {assignment.totalPoints}</Typography>
        <Typography variant="body2"><strong>Due Date:</strong> {new Date(assignment.DueDate || new Date()).toLocaleDateString()}</Typography>
        {assignment.AssignmentDoc && (
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
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={handleShow}>
        Edit Assignment
      </Button>

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editedAssignment?.title || ""}
            onChange={(e) => setEditedAssignment((prev) => ({ ...prev!, title: e.target.value }))}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editedAssignment?.description || ""}
            onChange={(e) => setEditedAssignment((prev) => ({ ...prev!, description: e.target.value }))}
          />
          <TextField
            label="Points"
            type="number"
            fullWidth
            margin="normal"
            value={editedAssignment?.totalPoints || 0}
            onChange={(e) => setEditedAssignment((prev) => ({ ...prev!, totalPoints: parseInt(e.target.value, 10) }))}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={(editedAssignment &&
              editedAssignment.DueDate )
                ? new Date(editedAssignment.DueDate).toISOString() 
                : ''            }
            
            onChange={(e) => setEditedAssignment((prev) => ({ ...prev!, DueDate: new Date(e.target.value) }))}
          />
          <CldUploadWidget
            uploadPreset="acad_helper_pdf"
            onSuccess={handleUpload}
          >
            {({ open }) => (
              <Button onClick={() => open()} variant="outlined" color="primary" fullWidth sx={{ my: 2 }}>
                Select File
              </Button>
            )}
          </CldUploadWidget>
          <TextField
            label="Status"
            select
            fullWidth
            margin="normal"
            value={editedAssignment?.status || "Open"}
            onChange={(e) => setEditedAssignment((prev) => ({ ...prev!, status: e.target.value as "Open" | "Closed" | "Graded" }))}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Graded">Graded</MenuItem>
          </TextField>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleEdit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignmentDetails;
