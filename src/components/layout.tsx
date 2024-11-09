"use client";
import Navbar from "./Navbar";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RedeemIcon from "@mui/icons-material/Redeem";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { clearUser } from "@/store";
import MenuBookIcon from '@mui/icons-material/MenuBook';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // const [selectedCourse, setSelectedCourse] = React.useState("");

  const handleLogout = ()=>{
    clearUser()
    router.push('/Login')
  }

  const handleNavigation = (text: string) => {
    router.push(`/${text}`);
  };

  const mainItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text:"Courses",icon: <MenuBookIcon/>},
    { text: "Groups", icon: <GroupIcon /> },
    { text: "Leaderboard", icon: <LeaderboardIcon /> },
    { text: "Focus", icon: <VideoCallIcon /> },
    { text: "Schedule", icon: <ScheduleIcon /> },
  ];

  const secondaryItems = [
    { text: "Rewards", icon: <RedeemIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {mainItems.map((item) => (
              <ListItem key={item.text} disablePadding onClick={() => handleNavigation(item.text)}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {secondaryItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
           <ListItem key="Logout" disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>

          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          margin: 0,
          width: `calc(100% - ${drawerWidth}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}