"use client";
import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventInput,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventDropArg } from "@fullcalendar/interaction";
import Auth from '@/components/Auth'
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
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
import axios from "axios";
import { useStore } from "@/store";
import toast, { Toaster } from 'react-hot-toast';

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [newEventTime, setNewEventTime] = useState<string>(selectedEvent?.end?.toISOString().slice(0, 16) || "");
  const [change,setchange] = useState(false);
  const { user } = useStore();

  interface Event {
    _id: string;
    title: string;
    endDate: string | Date;
    User: string;
    assignmentId: string;
    taskId: string;
    challengeId: string;
  }

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get("/api/event/get-all-event", {
        params: {
          userId: user?._id,
        },
      });
      const events: Event[] = response.data.events;
      const fullCalendarEvents: EventInput[] = events.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.endDate).toISOString(),
        end: new Date(event.endDate).toISOString(),
        extendedProps: {
          user: event.User,
          assignmentId: event.assignmentId,
          taskId: event.taskId,
          challengeId: event.challengeId,
        },
      }));

      setCurrentEvents(fullCalendarEvents);
    } catch (error:any) {
      toast.error(error?.message);
    }
  };

  const updateEvent = async () => {
    try {
      if (!selectedEvent) return;
  
      await axios.patch("/api/event/update-event", {
        title: newEventTitle,
        userId: user?._id,
        DueDate: new Date(newEventTime).toISOString(),
        eventId: selectedEvent.id,
      });
      selectedEvent.setProp("title", newEventTitle);
      selectedEvent.setDates(new Date(newEventTime).toISOString(),null); // Update time on the calendar
      fetchAllEvents();
      handleCloseDialog();
      setchange(!change)
    } catch (error:any) {
      toast.error(error.message);
    }
  };
  

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    try {
      const { event } = dropInfo;

      console.log(event)

      const DueDate = event._instance.range.end;
      const DueDateISO = new Date(DueDate).toISOString();
      console.log(DueDateISO);
      
      const response = await axios.patch("/api/event/update-event", {
        title: event.title,
        userId: user?._id,
        DueDate: DueDate,
        eventId: event.id,
      });
      console.log(response)
      setchange(!change)
      // // Optionally refetch all events or update the state manually
      fetchAllEvents();
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [user,change]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected.event);
    setNewEventTitle(selected.event.title || "");
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setNewEventTitle("");
  };

  const handleDeleteEvent = async () => {
    try {
      if (!selectedEvent) return;
  
      await axios.delete("/api/event/delete-event", {
        params: {
          eventId: selectedEvent.id,
          userId: user?._id,
        },
      });
      selectedEvent.remove(); // Remove event from the calendar directly
      fetchAllEvents(); // Refresh events list
      handleCloseDialog();
      setchange(!change)
    } catch (error:any) {
      toast.error(error.message);
    }
  };
  

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newEventTitle && selectedDate) {
        const calendarApi = selectedDate.view.calendar;
        calendarApi.unselect();
  
        const newEvent = {
          title: newEventTitle,
          userId:user?._id,
          DueDate: (new Date(selectedDate.end)).toISOString()
        };
  
        const newEventToBeAdded=await axios.post("/api/event/create-event",newEvent);

        const event=newEventToBeAdded.data.event

        const fullCalendarEvents: EventInput ={
          id: event._id,
          title: event.title,
          start: new Date(event.endDate).toISOString(),
          end: new Date(event.endDate).toISOString(),
          extendedProps: {
            user: event.User,
            assignmentId: event.assignmentId,
            taskId: event.taskId,
            challengeId: event.challengeId,
          }
        }
       
  
        calendarApi.addEvent(fullCalendarEvents); 
        console.log(fullCalendarEvents)
        handleCloseDialog();
        setchange(!change)
      }
    } catch (error:any) {
      toast.error(error);
      return;
    }
  };

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
                currentEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.title}
                      primaryTypographyProps={{ fontWeight: "bold", fontSize: "1rem" }}
                      secondary={formatDate(event.end!, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
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
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop} 
            events={currentEvents}
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

        {/* Edit Event Dialog  */}

        <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle align="center">Edit Event</DialogTitle>
          <DialogContent dividers>
            <form onSubmit={(e) => { e.preventDefault(); updateEvent(); }} className="flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                label="Edit Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label=""
                type="datetime-local"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                margin="normal"
              />
              <DialogActions className="flex justify-between space-x-4">
                <Button onClick={handleDeleteEvent} color="error" variant="contained">
                  Delete
                </Button>
                <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>


      </Box>
    </Layout>
  );
};

export default Auth(Calendar);
