"use client";
import { cardsData } from "@/utils/Sample Data/Sample";
import { useEffect, useState } from "react";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "./DndContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useStore } from "@/store";
import { Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditIcon } from "lucide-react";
import axios from "axios";

interface Cards {
  id: number;
  title: string;
  components: {
    id: number;
    title: string;
    completed: boolean;
    dueDate: string;
    course: string;
  }[];
}

const DndExample = () => {
  const [data, setData] = useState<Cards[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCourse, setNewTaskCourse] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskCompleted, setNewTaskCompleted] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const { user } = useStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<null | {
    columnId: number;
    task: {
      id: number;
      title: string;
      completed: boolean;
      dueDate: string;
      course: string;
    };
  }>(null);


  // get all tasks 
  const getAllTasks=async ()=>{
    try {
      const obj={
        userId:user._id
      }

      
      const response = await axios.get('/api/task',obj);
      console.log(response)
      
    } catch (error) {
      console.log("error while fetching all the tasks",error)
    }
  }
  // update the task


  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    const newData = JSON.parse(JSON.stringify(data));

    if (type === "COLUMN") {
        const [movedColumn] = newData.splice(source.index, 1);
        newData.splice(destination.index, 0, movedColumn);
        setData(newData);
    } else {
        const sourceColumnIndex = newData.findIndex(
            (col: Cards) => col.id.toString() === source.droppableId.split("droppable")[1]
        );
        const destinationColumnIndex = newData.findIndex(
            (col: Cards) => col.id.toString() === destination.droppableId.split("droppable")[1]
        );

        const [movedItem] = newData[sourceColumnIndex].components.splice(source.index, 1);

        // Update task status based on the destination column
        movedItem.completed = newData[destinationColumnIndex].title === "Completed";

        newData[destinationColumnIndex].components.splice(destination.index, 0, movedItem);
        setData(newData);
    }
};

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewTaskName("");
    setSelectedColumn(null);
  };

  const handleOpenEditModal = (columnId: number, task: any) => {
    setTaskToEdit({ columnId, task });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleAddTask = () => {
    if (newTaskTitle && selectedColumn !== null) {
      const updatedData = data.map((column) => {
        if (column.id === selectedColumn) {
          return {
            ...column,
            components: [
              ...column.components,
              { 
                id: Date.now(), 
                title: newTaskTitle, 
                completed: newTaskCompleted, 
                dueDate: newTaskDueDate, 
                course: newTaskCourse 
              },
            ],
          };
        }
        return column;
      });
      setData(updatedData);
      handleCloseModal();
    }
  };

  const handleSaveTaskChanges = () => {
    if (taskToEdit) {
        const updatedData = data.map((column) => {
            if (column.id === taskToEdit.columnId) {
                return {
                    ...column,
                    components: column.components.map((component) =>
                        (component.id === taskToEdit.task.id) ? taskToEdit.task : component
                    ),
                };
            }
            return column;
        });

        const completedColumn = updatedData.find((col) => col.title === "Completed");
        const pendingColumn = updatedData.find((col) => col.title === "Pending");

        // Remove the task from its current column
        if (taskToEdit.task.completed) {
            const index = pendingColumn?.components.findIndex(comp => comp.id === taskToEdit.task.id);
            if (index !== undefined && index !== -1) {
                pendingColumn?.components.splice(index, 1);
            }
        } else {
            const index = completedColumn?.components.findIndex(comp => comp.id === taskToEdit.task.id);
            if (index !== undefined && index !== -1) {
                completedColumn?.components.splice(index, 1);
            }
        }

        // Add the task to the appropriate column based on its updated status
        if (taskToEdit.task.completed) {
            completedColumn?.components.push(taskToEdit.task);
        } else {
            pendingColumn?.components.push(taskToEdit.task);
        }

        setData(updatedData);
        setTaskToEdit(null);
        handleCloseEditModal();
    }
  };


const handleDeleteTask = (columnId: number, taskId: number) => {
  const updatedData = data.map(column => {
    if (column.id === columnId) {
      return {
        ...column,
        components: column.components.filter(task => task.id !== taskId),
      };
    }
    return column;
  });
  setData(updatedData);
};


  useEffect(() => {
    setData(cardsData);
    getAllTasks();
    // console.log(user);
  }, []);

  if (!data.length) {
    return <LoadingSkeleton />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ mb: 2 }}
      >
        Add Task
      </Button>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          <Typography variant="h6" gutterBottom>
            Add New Task
          </Typography>
          <TextField
            fullWidth
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Course"
            value={newTaskCourse}
            onChange={(e) => setNewTaskCourse(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Select Column"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {data.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Completion Status"
            value={newTaskCompleted ? "true" : "false"}
            onChange={(e) => setNewTaskCompleted(e.target.value === "true")}
            sx={{ mb: 2 }}
          >
            <MenuItem value="false">Incomplete</MenuItem>
            <MenuItem value="true">Completed</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            fullWidth
          >
            Add Task
          </Button>
        </Box>
      </Modal>


      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height:500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          {taskToEdit && (
            <>
              <Typography variant="h6" gutterBottom>
                Edit Task
              </Typography>
              <TextField
                fullWidth
                label="Task Title"
                value={taskToEdit.task.title}
                onChange={(e) =>
                  setTaskToEdit({
                    ...taskToEdit,
                    task: { ...taskToEdit.task, title: e.target.value },
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Course"
                value={taskToEdit.task.course}
                onChange={(e) =>
                  setTaskToEdit({
                    ...taskToEdit,
                    task: { ...taskToEdit.task, course: e.target.value },
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={taskToEdit.task.dueDate}
                onChange={(e) =>
                  setTaskToEdit({
                    ...taskToEdit,
                    task: { ...taskToEdit.task, dueDate: e.target.value },
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Completed"
                value={taskToEdit.task.completed ? "Yes" : "No"}
                onChange={(e) =>
                  setTaskToEdit({
                    ...taskToEdit,
                    task: { ...taskToEdit.task, completed: e.target.value === "Yes" },
                  })
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTaskChanges}
                fullWidth
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <DndContext onDragEnd={onDragEnd}>
        <Typography variant="h4" align="center" gutterBottom>
          Task Management
        </Typography>
        <Droppable droppableId="all-columns" type="COLUMN" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {data.map((val, index) => (
                <Draggable key={val.id} draggableId={`draggable-column-${val.id}`} index={index}>
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      md={5}
                      lg={4}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          padding: 2,
                          border: "1px dashed #90caf9",
                          backgroundColor: "#e3f2fd",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                        {...provided.dragHandleProps}
                      >
                        <Droppable key={index} droppableId={`droppable${val.id}`} type="ITEM">
                          {(provided) => (
                            <Box
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              sx={{ width: "100%" }}
                            >
                              <Typography
                                variant="h6"
                                align="center"
                                sx={{ color: "#1565c0", fontWeight: "bold", mb: 2 }}
                              >
                                {val.title}
                              </Typography>
                              {val.components.length > 0 ? (
                                val.components.map((component, index) => (
                                  <Draggable key={component.id} draggableId={`item-${component.id}`} index={index}>
                                    {(provided) => (
                                      <Box
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                      sx={{
                                        backgroundColor: "#bbdefb",
                                        color: "#1e88e5",
                                        padding: 1,
                                        marginBottom: 1,
                                        borderRadius: 1,
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                        gap: 1,
                                      }}
                                    >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-around",
                                              alignItems: "center",
                                              width: "100%",
                                              mb: 1,
                                              gap:2
                                            }}
                                          >
                                              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                                                {component.title}
                                              </Typography>
                                              <Button
                                                variant="outlined"
                                                size="small"                                            
                                                startIcon={<EditIcon/>}
                                                sx={{
                                                  borderColor: "#1e88e5",
                                                  color: "#1e88e5",
                                                  display:"flex",
                                                  justifyContent:"space-between",
                                                  "&:hover": {
                                                    borderColor: "#1565c0",
                                                    color: "#1565c0",
                                                  },
                                                }}
                                                onClick={()=>handleOpenEditModal(val.id,component)}
                                              >
                                                Edit
                                                
                                              </Button>

                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  sx={{
                                                    borderColor: "#1e88e5",
                                                    color: "#1e88e5",
                                                    display:"flex",
                                                    justifyContent:"space-between",
                                                    width:"25%",
                                                    "&:hover": {
                                                      borderColor: "#1565c0",
                                                      color: "#1565c0",
                                                    },
                                                  }}
                                                  startIcon={<DeleteIcon/>}
                                                  onClick={()=>handleDeleteTask(val.id,component.id)}
                                                >
                                                Delete
                          
                                              </Button>
                                          </Box>
                                      <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 500 }}>
                                        Course: {component.course}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 500 }}>
                                        Due Date: {component.dueDate}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: "#1565c0", fontWeight: 500 }}>
                                        Completed: {component.completed ? "Yes" : "No"}
                                      </Typography>
                                    </Box>
                                    
                                    )}
                                  </Draggable>
                                ))
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  align="center"
                                  sx={{ mt: 2 }}
                                >
                                  No items
                                </Typography>
                              )}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Paper>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DndContext>
    </Box>
  );
};

export default DndExample;
