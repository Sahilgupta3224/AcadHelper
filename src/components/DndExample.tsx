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

interface Cards {
  id: number;
  title: string;
  components: {
    id: number;
    name: string;
  }[];
}

const DndExample = () => {
  const [data, setData] = useState<Cards[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const newData = [...data];
      const [movedColumn] = newData.splice(source.index, 1);
      newData.splice(destination.index, 0, movedColumn);
      setData(newData);
    } else {
      const newData = [...data];
      const sourceColumnIndex = newData.findIndex(
        (col) => col.id.toString() === source.droppableId.split("droppable")[1]
      );
      const destinationColumnIndex = newData.findIndex(
        (col) => col.id.toString() === destination.droppableId.split("droppable")[1]
      );

      const [movedItem] = newData[sourceColumnIndex].components.splice(source.index, 1);
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

  const handleAddTask = () => {
    if (newTaskName && selectedColumn !== null) {
      const updatedData = data.map((column) => {
        if (column.id === selectedColumn) {
          return {
            ...column,
            components: [
              ...column.components,
              { id: Date.now(), name: newTaskName },
            ],
          };
        }
        return column;
      });
      setData(updatedData);
      handleCloseModal();
    }
  };

  useEffect(() => {
    setData(cardsData);
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
            label="Task Name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
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

      <DndContext onDragEnd={onDragEnd}>
        <Typography variant="h4" align="center" gutterBottom>
          Drag and Drop Task Management
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
                                          padding: 2,
                                          marginBottom: 1,
                                          borderRadius: 1,
                                          textAlign: "center",
                                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        {component.name}
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
