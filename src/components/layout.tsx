"use client"
import Navbar from './Navbar'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
const drawerWidth = 240;

export default function Layout({ children }:{children:React.ReactNode}) {

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <Navbar/>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Groups', 'Courses','Leaderboard',"Focus", 'Schedule'].map((text, index) => (
              <ListItem key={text} disablePadding>
              <Link href={`/${text}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Rewards', 'Settings', 'Logout'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
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
            display: 'flex',
            flexDirection: 'column',
        }}
      >
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  )
}