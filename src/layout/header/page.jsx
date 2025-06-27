"use client";
import { Avatar, Box, Button, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const HeaderContent = styled(Box)(({ theme }) => ({
  height: "60px",
  display: "flex",
  flexDirection: "row-reverse",
}));

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { logout } = useAuth();
  const userInfo = useSelector((state) => state.auth.userData);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    logout();
    // router.push("/login");
  };

  return (
    <HeaderContent>
      <Avatar onClick={handleMenuClick} sx={{ bgcolor: "#15283C", m: 2 }}>
        A
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography> {userInfo?.firstName}</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </HeaderContent>
  );
};

export default Header;
