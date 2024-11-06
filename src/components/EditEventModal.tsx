import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { Event } from '@/Interfaces/event';

const AssignmentModal = ({ open, handleClose,oldevent }:{open:boolean,handleClose:any,oldevent:Event}) => {
  const [event, setEvent] = useState<Event>(oldevent)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };



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
        <h2>Edit Event</h2>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={event.title}
          onChange={handleChange}
          required
        />
        
        <TextField
          label="Start Date"
          name="StartDate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={event.start}
          onChange={handleChange}
        />

        <TextField
          label="End Date"
          name="EndDate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={event.start}
          onChange={handleChange}
        />
       


        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => console.log('Assignment data submitted:', event)}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AssignmentModal;
