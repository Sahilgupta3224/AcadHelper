"use client";
import React, { useState } from "react";
import Layout from "@/components/layout"; // Update this path if layout is elsewhere
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import TextField from "@mui/material/TextField";
// import { Edit, Delete } from "@mui/icons-material";
// import Grid from "@mui/material/Grid";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DndExample from "@/components/DndExample";


// const initialTasks = [
//   { id: "1", title: "Task 1", description: "Pending task 1", status: "pending" },
//   { id: "2", title: "Task 2", description: "Pending task 2", status: "pending" },
//   { id: "3", title: "Task 3", description: "Completed task 1", status: "completed" },
// ];

function Dashboard() {
 

  return (
    <Layout>
      {/* <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Task Management Dashboard
        </Typography>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {["pending", "completed"].map((status) => (
              <Grid item xs={6} key={status}>
                <Typography variant="h6">
                  {status === "pending" ? "Pending Tasks" : "Completed Tasks"}
                </Typography>

                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 200,
                        padding: 1,
                        backgroundColor: "#f4f4f4",
                        borderRadius: 1,
                      }}
                    >
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: 2,
                                  marginBottom: 1,
                                  backgroundColor: "#ffffff",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {task.title}
                                </Typography>
                                {isEditing === task.id ? (
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                  />
                                ) : (
                                  <Typography variant="body2">
                                    {task.description}
                                  </Typography>
                                )}

                                <Box
                                  display="flex"
                                  justifyContent="flex-end"
                                  gap={1}
                                  mt={1}
                                >
                                  {isEditing === task.id ? (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => handleSaveEdit(task.id)}
                                    >
                                      Save
                                    </Button>
                                  ) : (
                                    <IconButton
                                      onClick={() => handleEdit(task)}
                                      size="small"
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={() => handleDelete(task.id)}
                                    size="small"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Box> */}
       <DndExample />

    </Layout>
  );
}

export default Dashboard;
 