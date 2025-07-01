"use client";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@mui/material/styles";
import { getFetchedUserDetailsApi } from "@/api";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { logout } = useAuth();
  const userInfo = useSelector((state) => state.auth.userData);
  // let id = "68638836e425e73104e14100";

  // useEffect(() => {
  //   fetchedDetails();
  // }, [id]);
  // const fetchedDetails = async (id) => {
  //   try {
  //     const result = await getFetchedUserDetailsApi(id);
  //     console.log(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log(userInfo);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    logout();
    // router.push("/login");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: 60,
        width: "100%",
        px: 2,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
        <Avatar
          sx={{ bgcolor: "#15283C", width: 40, height: 40, fontSize: 16 }}
        >
          {"A"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userInfo?.firstName || "User"}
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
