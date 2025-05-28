import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, IconButton, Typography } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from '@/store';

interface AssignmentModalProps {
  open: boolean;
  handleClose: () => void;
  courseId?: string;
}

const AssignmentModal: React.FC<AssignmentModalProps>  = ({ open, handleClose, courseId }) => {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 0,
    status: 'Open',
    AssignmentDoc: ''
  });

  const { user } = useStore();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: value });
  };

  const handleUploadSuccess = async () => {
    try {
      if (!assignment.AssignmentDoc) {
        toast.error("File upload was not successful");
        return;
      }

      const req = {
        ...assignment,
        userId: user?._id,
        courseId,
      };
  
      const response = await axios.post('/api/assignment/upload-assignment', req);

    } catch (error:any) {
      toast.error("Error while creating the assignment:", error.response.data.message);
    }
  };

  const handleUpload = (result:any) => {
    if (result && result.info) {
      setAssignment((prev) => ({
        ...prev,
        AssignmentDoc: result.info.url
      }));
    } else {
      toast.error("Upload failed or result is invalid.");
    }
  };

  useEffect(() => {

  }, [assignment]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
            <Box
              sx={{
                display:"flex",
                justifyContent:"space-between",
                alignContent:"center",
                gap:2
              }}
            >
               <Typography
                sx={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold', 
                  }}
                  >
                Create/Edit Assignment
                </Typography>
                <IconButton
                        onClick={handleClose}
                        >
                <CloseIcon />
                </IconButton>
            </Box>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={assignment.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={assignment.description}
          onChange={handleChange}
        />
        <TextField
          label="Due Date"
          name="dueDate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={assignment.dueDate}
          onChange={handleChange}
        />
        <TextField
          label="Total Points"
          name="totalPoints"
          type="number"
          fullWidth
          margin="normal"
          value={assignment.totalPoints}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={assignment.status}
            onChange={handleChange}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Graded">Graded</MenuItem>
          </Select>
        </FormControl>

        <CldUploadWidget
          uploadPreset="r99tyjot"
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button onClick={() => open()} variant="outlined" color="primary" fullWidth>
              Upload Assignment
            </Button>
          )}
        </CldUploadWidget>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleUploadSuccess}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AssignmentModal;
