import { useStore } from '@/store';
import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { CldUploadWidget } from 'next-cloudinary'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import toast, { Toaster } from 'react-hot-toast';

function ChallengeModal({challengeDoc,openUploadModal,setOpenUploadModal,handleUploadChallenge,yo,setyo,setChallenges,courseId}:any) {
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [points, setPoints] = useState<number | undefined>();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("individual");
    
    const { user } = useStore()

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
            createdBy: user?._id,
            courseId,
          });
          setChallenges((prev) => [...prev, response.data.Challenge]);
          setOpenUploadModal(false);
          setyo(!yo)
        } catch (error:any) {
          toast.error(error.response.data.message)
        }
      };


  return (
    <>
    <Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
              <Box
                sx={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
                  display:"flex",flexDirection:"column",justifyContent:"center",gap:1
                }}
              >

                <Box
                            sx={{
                                display:"flex",
                                justifyContent:"space-between",
                                alignContent:"center",
                                width:"100%"
                            }}
                        >

                            
                                <Typography variant="h6" gutterBottom sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold', 
                                }}>Add New Challenge</Typography>
                                <IconButton
                                onClick={()=>setOpenUploadModal(false)}
                                >
                                <CloseIcon />
                                </IconButton>

                </Box>
                
                <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth multiline label="Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                {/* <TextField fullWidth label="Document Link" value={challengeDoc} onChange={(e) => setChallengeDoc(e.target.value)} sx={{ mb: 2 }} /> */}
                <CldUploadWidget
                    uploadPreset="r99tyjot"
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
        <Toaster/>
    </>
  )
}

export default ChallengeModal
