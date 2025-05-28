"use client"
import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Badge, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
import Auth from '@/components/Auth'

interface Notification {
  id: number;
  message: string;
}

const Notification: React.FC = () => {
  // Sample initial notifications
  const initialNotifications: Notification[] = [
    { id: 1, message: "Your assignment has been graded." },
    { id: 2, message: "New group chat message received." },
    { id: 3, message: "Virtual meeting scheduled for tomorrow." },
    { id: 4, message: "Challenge completed. Points awarded!" },
  ];

  // State for notifications list and count
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationCount, setNotificationCount] = useState<number>(initialNotifications.length);

  // Handle notification delete
  const handleDelete = (id: number) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);
  };

  return (
    <Layout>
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto", padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h3">Notifications</Typography>
            
        </Box>
        <Divider sx={{ marginY: 4 }} />
        <List>
            {notifications.length > 0 ? (
            notifications.map((notification) => (
                <ListItem key={notification.id} divider>
                <ListItemText primary={notification.message} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(notification.id)}>
                    <DeleteIcon color="error" />
                    </IconButton>
                </ListItemSecondaryAction>
                </ListItem>
            ))
            ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
                No new notifications.
            </Typography>
            )}
        </List>
        </Box>
    </Layout>
  );
};

export default Auth(Notification);