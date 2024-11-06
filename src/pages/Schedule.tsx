"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import Layout from "@/components/layout";
import { Event } from "@/Interfaces/event";


const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [editedEvent,setEditedEvent]=useState<Event>(null)


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };


  const handleEditEvent=(event:any)=>{
    // e.preventDefault();

    const eventId=event.id;



    
  }


  return (
    <Layout>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} padding="20px">
        {/* Sidebar for event list */}
        <Box width={{ xs: "100%", md: "30%" }} padding="20px">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Add Event, Stay Tuned Always :)
          </Typography>
          <Paper elevation={3} style={{ maxHeight: "70vh", overflow: "auto", padding: "10px" }}>
            <List>
              {currentEvents.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No Events Present
                </Typography>
              ) : (
                currentEvents.map((event: EventApi) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.title}
                      primaryTypographyProps={{ fontWeight: "bold", fontSize: "1rem" }}
                      secondary={formatDate(event.start!, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />

                      <Button
                      variant="outlined"
                      size="small"
                      onClick={()=>handleEditEvent(event)}
                      >
                        Edit
                      </Button>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Box>

        {/* Calendar */}
        <Box width={{ xs: "100%", md: "70%" }} padding="20px">
          <FullCalendar
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // Different views enabled here
            }}
            initialView="dayGridMonth" 
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            }
          />
        </Box>

        {/* Add Event Dialog */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle align="center">Add New Event</DialogTitle>
          <DialogContent dividers>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                label="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                margin="normal"
              />
              <DialogActions className="flex justify-end space-x-4">
                <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Calendar;
