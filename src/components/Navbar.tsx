"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Fire from "./fire";
import LoginModal from "../components/LoginModal"; 
import Notification from "./Notification";
import { useStore } from "../store";
import { Chip, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { user } = useStore();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [guestLogin, setGuestLogin] = React.useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
    setGuestLogin(false);
  };

  const handleGuestLogin = () => {
    setOpenLogin(true);
    setGuestLogin(true);
  };

  const calculateTotalPoints = (user) => {
    if (!user?.Totalpoints) return 0;
    return Array.isArray(user.Totalpoints)
      ? user.Totalpoints.reduce((total, course) => total + course.points, 0)
      : 0;
  };

  const totalPoints = calculateTotalPoints(user);

  // Only show More menu for logged-in users on mobile
  const renderMobileMenu =
    user && (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="mobile-menu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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
        <MenuItem
          onClick={() => {
            router.push(`/Profile/${user?._id}`);
            handleMobileMenuClose();
          }}
        >
          <IconButton size="large" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(255,255,255,0.95)",
          color: "black",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 12px rgba(60,60,60,0.05)",
          borderRadius: "0 0 16px 16px",
          backdropFilter: "blur(8px)",
        }}
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: 1,
              color: "primary.main",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => router.push("/")}
          >
            AcadHelper
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Always show buttons, even on mobile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {user ? (
              <>
                <Chip
                  label={totalPoints}
                  icon={<AutoAwesomeIcon />}
                  sx={{
                    color: "primary.dark",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 1.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
                {/* Show Fire and Notification only on md+ screens, use MoreIcon for mobile */}
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Fire />
                  <Notification />
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => router.push(`/Profile/${user?._id}`)}
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={handleOpenLogin}
                >
                  Login / Signup
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    ml: 1,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={handleGuestLogin}
                >
                  Guest Entry
                </Button>
              </>
            )}
          </Box>

          {/* MoreIcon only for logged-in users on mobile */}
          {user && (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <LoginModal
        open={openLogin}
        handleClose={() => setOpenLogin(false)}
        guestLogin={guestLogin}
      />
      {renderMobileMenu}
    </Box>
  );
}
