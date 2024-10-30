import * as React from "react";
import { Box, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

// // Define the props interface
// interface EditAssignmentModalProps {
//   open: boolean;
//   handleClose: () => void;
//   assignmentData: {
//     dueDate?: Dayjs;
//     fileName?: string;
//     points?: number;
//     status?: string;
//   };
//   onSave: (updatedData: {
//     dueDate: Dayjs | null;
//     fileName: string;
//     points: number;
//     file: File | null;
//     status: string;
//   }) => void;
// }

export default function EditAssignmentModal({
  open,
  handleClose,
  assignmentData,
  // onSave,
}):any {
  const [dueDate, setDueDate] = React.useState<Dayjs | null>(assignmentData.dueDate || null);
  const [fileName, setFileName] = React.useState<string>(assignmentData.fileName || "");
  const [points, setPoints] = React.useState<number>(assignmentData.points || 0);
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string>(assignmentData.status || "Open");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-assignment-modal">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="edit-assignment-modal" variant="h6" component="h2">
            Edit Assignment
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Due Date Selector */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newDate) => setDueDate(newDate)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>

        {/* File Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Name of the File"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        {/* Completion Points */}
        <TextField
          fullWidth
          margin="normal"
          label="Completion Points"
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />

        {/* File Upload */}
        <TextField
          fullWidth
          margin="normal"
          type="file"
          onChange={handleFileUpload}
        />

        {/* Status Selector */}
        <FormControl fullWidth margin="normal" display="flex" flexDirection="column" gap="2">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as string)}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Graded">Graded</MenuItem>
          </Select>
        </FormControl>

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          // onClick={() => onSave({ dueDate, fileName, points, file, status })}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}
