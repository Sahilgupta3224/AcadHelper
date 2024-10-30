import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "@/components/layout";
import "../app/globals.css";
import {
  sampleAssignments,
  sampleChapters,
  UserLoggedIn,
} from "./Sample Data/Sample";
import Link from "next/link";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditAssignmentModal from "@/helper/EditAssignment";
import sidebarDrawer from "@/helper/SidebarDrawer";
import SidebarDrawer from "@/helper/SidebarDrawer";

//interface for Chapter

// interface for Assignment

export default function Courses() {
  // State to manage drawer open/close
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedChapter, setSelectedChapter] = React.useState(null);
  const [selectedAssignment, setSelectedAssignment] = React.useState(null);
  const [assignmentType, setAssignmentType] = React.useState("normal");
  const [dueDate, setDueDate] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openEdit,setOpenEdit]=React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Toggle drawer function
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0]?.name || "");
  };

  // Sample data
  const user = UserLoggedIn;
  const chapters = sampleChapters;
  const assignments = sampleAssignments;
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <Layout>
      {/* Sidebar Drawer */}
      <SidebarDrawer chapters={chapters} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} assignments={assignments} setSelectedAssignment={setSelectedAssignment} setSelectedChapter={setSelectedChapter}/>

      {/* Main Content Section */}
      <Box sx={{ marginLeft: drawerOpen ? 250 : 0, padding: "24px" }}>
        <div className="font-bold text-4xl my-2 flex justify-between">
          <div>
            {selectedChapter ? `${selectedChapter.name}` : "Select a Chapter "}
          </div>
          <div>
            {/* Button to toggle drawer */}
            <Button
              onClick={toggleDrawer(true)}
              variant="outlined"
              className="rounded-md"
            >
              Open Drawer
            </Button>
          </div>
        </div>
        <div className="flex text-2xl justify-center flex-col items-start">
          {selectedAssignment ? (
            <div className="w-full flex flex-col gap-2 border border-black border-3 justify-center items-start p-1">
              <div className="flex flex-col w-full items-center justify-between font-medium">
                {/* <div className="font-medium">{selectedAssignment.title}</div> */}

                <div className="flex w-full items-center justify-between font-medium">
                  <div>{selectedAssignment.title}</div>
                  {UserLoggedIn.isAdmin && (
                    <>
                      <Button variant="outlined" onClick={handleOpen}>
                        Add Material
                      </Button>
                      <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                        >
                          <Box sx={style}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add Assignment Material
                              </Typography>
                              <IconButton onClick={handleClose}>
                                <CloseIcon />
                              </IconButton>
                            </Box>

                            <FormControl fullWidth margin="normal">
                              <InputLabel>Type of Assignment</InputLabel>
                              <Select
                                value={assignmentType}
                                onChange={(e) => setAssignmentType(e.target.value)}
                              >
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="submission">Submission</MenuItem>
                              </Select>
                            </FormControl>

                            <TextField
                              fullWidth
                              margin="normal"
                              type="file"
                              onChange={handleFileUpload}
                            />

                            <TextField
                              fullWidth
                              margin="normal"
                              label="Name of the File"
                              value={fileName}
                              onChange={(e) => setFileName(e.target.value)}
                            />

                            {assignmentType === "submission" && (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Due Date"
                                  value={dueDate}
                                  onChange={(newDate) => setDueDate(newDate)}
                                  renderInput={(params) => (
                                    <TextField {...params} fullWidth margin="normal" />
                                  )}
                                />
                              </LocalizationProvider>
                            )}

                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => {
                                /* Add save function here */
                              }}
                            >
                              Save Assignment Material
                            </Button>
                          </Box>
                        </Modal>
                    </>
                  )}
                </div>
              </div>

              <div className="font-medium">
                {selectedAssignment.description}
              </div>

              <div className="font-medium flex w-full justify-between items-center">
                {/* Check if AssignmentDoc is present */}
                {selectedAssignment.AssignmentDoc ? (
                  <>
                    <Link
                      href={selectedAssignment.AssignmentDoc}
                      target="_blank"
                      rel="noopener noreferrer" // Security feature
                      className="flex items-center gap-2 text-blue-600 underline" // Link styles
                    >
                      <img
                        src="Folder.png"
                        alt="Open Assignment"
                        className="h-6 w-6"
                      />
                      Open Assignment Document
                    </Link>

                    {/* options of download assignment and give your submission  */}
                    <div className="flex items-center gap-2 text-sm">
                      <Button
                        variant="outlined"
                        className="flex items-center gap-2 text-sm"
                      >
                        Download
                        <img src="Download.png" alt="" className="w-5 h-auto" />
                      </Button>

                      {UserLoggedIn.isAdmin === false ? (
                        <Button variant="outlined">Submit</Button>
                      ) : (
                        <>
                          <Button variant="outlined" onClick={()=>setOpenEdit(true)}>
                            Edit Assignment
                            <img src="Edit.png" alt="" className="w-5 h-auto" />
                          </Button>
                          <EditAssignmentModal open={openEdit} handleClose={handleEditClose} assignmentData={selectedAssignment} />
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div>No assignment document available</div> // Message when no document is present
                )}
              </div>
            </div>
          ) : (
            <div>Select an assignment</div>
          )}
        </div>
      </Box>
    </Layout>
  );
}
