"use client"
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Fire from './fire';
import { useRouter } from 'next/router';
import LoginModal from '@/components/AuthModal';
import Notification from './Notification';
import { useStore } from '@/store';
import { Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useStore()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [challengeAnchorEl, setChallengeAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openLogin, setOpenLogin] = React.useState(false)
  // const {notifications,setNotifications}=AppWrapper()
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const calculateTotalPoints = (user: any) => {
    if(!user?.Totalpoints){
      return 0;
    }
    if (Array.isArray(user.Totalpoints)) {
      return user.Totalpoints.reduce((total, course) => total + course.points, 0);
    }
    return 0;
  };
  const totalPoints = calculateTotalPoints(user);

  const handleOpen = () => {
    setOpenLogin(true)
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <Fire />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={5} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      {/* <MenuItem className='flex flex-col justify-center' onClick={handleOpen}>
        <Button variant="outlined" color="inherit" >Login</Button>
      </MenuItem> */}
    </Menu>
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setChallengeAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setChallengeAnchorEl(null);
  };

  const open = Boolean(challengeAnchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white', color: 'black', borderBottom: '1px solid #e0e0e0' }} elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            AcadHelper
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'black',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            ><Chip label={totalPoints} icon={<AutoAwesomeIcon/>}/></Box>
            <Fire />
            <Notification />
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={undefined}
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <AccountCircle onClick={() => { router.push(`/Profile/${user?._id}`); }} />
            </IconButton>
            {/* <Button variant="outlined" color="inherit" sx={{ ml: 2 }} onClick={() => { router.push(`/Login`); }}>Login</Button> */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={undefined}
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
