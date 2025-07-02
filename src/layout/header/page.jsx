"use client";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@mui/material/styles";
import { getFetchedUserDetailsApi } from "@/api";
import Image from "next/image";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { logout } = useAuth();
  const userInfo = useSelector((state) => state.auth.userData);
  const [userData, setUserData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let id = userInfo?.userId;

  useEffect(() => {
    fetchedDetails();
  }, []);

  const fetchedDetails = async () => {
    try {
      const result = await getFetchedUserDetailsApi(id);
      if (result.data.status === "success") {
        setUserData(result.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    logout();
    router.push("/login");
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleClose(); // Close menu before opening dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
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
          {userData?.data?.image ? (
            <Avatar sx={{ bgcolor: "#15283C", width: 40, height: 40 }}>
              <Image
                src={userData?.data.image}
                alt="user-profile"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            </Avatar>
          ) : (
            <Avatar
              sx={{ bgcolor: "#15283C", width: 40, height: 40, fontSize: 16 }}
            >
              {userData?.data?.firstName?.[0] || "U"}
            </Avatar>
          )}
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
          <MenuItem onClick={handleDialogOpen}>
            <Typography variant="body1" fontWeight={500}>
              Profile
            </Typography>
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body1">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* User Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {userData?.data ? (
            <Stack sx={{ p: 2 }} spacing={2}>
              <Typography>
                <strong>First Name:</strong> {userData?.data?.firstName}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {userData?.data?.lastName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {userData?.data?.email}
              </Typography>
              <Typography>
                <strong>Phone Number:</strong>{" "}
                {userData?.data?.userDetails?.phoneNumber}
              </Typography>{" "}
              <Typography>
                <strong>Personal Number:</strong>{" "}
                {userData?.data?.userDetails?.personalNumber}
              </Typography>{" "}
              <Typography>
                <strong>Date Of Birth:</strong>{" "}
                {new Date(
                  userData?.data?.userDetails?.dateOfBirth
                ).toLocaleDateString("en-GB")}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {userData?.data?.userDetails?.gender}
              </Typography>
              <Typography>
                <strong>permenent Address:</strong>{" "}
                {`${userData?.data?.userDetails?.permenentAddress?.street},
                  ${userData?.data?.userDetails?.permenentAddress?.city}`}
              </Typography>
              <Typography>
                <strong>Current Address:</strong>{" "}
                {`${userData?.data?.userDetails?.currentAddress?.street},
                  ${userData?.data?.userDetails?.currentAddress?.city}`}
              </Typography>
              <Typography>
                <strong>Primary skills:</strong>{" "}
                {userData?.data?.userDetails?.primarySkills
                  .map((ele) => ele.label)
                  .toString()}
              </Typography>
              <Typography>
                <strong>Secondary skills:</strong>{" "}
                {userData?.data?.userDetails?.secondarySkills
                  .map((ele) => ele.label)
                  .toString()}
              </Typography>
              <Typography>
                <strong>Role:</strong> {userData?.data?.roleDetails?.role}
              </Typography>
              <Typography>
                <strong>Department:</strong>{" "}
                {userData?.data?.userDetails?.department?.label}
              </Typography>
              <Typography>
                <strong>Manager:</strong>{" "}
                {userData?.data?.userDetails?.manager?.firstName}
              </Typography>
              <Typography>
                <strong>Designations:</strong>{" "}
                {userData?.data?.userDetails?.designation?.label}
              </Typography>
              <Typography>
                <strong>Team:</strong>{" "}
                {userData?.data?.userDetails?.team?.label}
              </Typography>
              <Typography>
                <strong>Joining Date:</strong>{" "}
                {new Date(
                  userData?.data?.userDetails?.joiningDate
                ).toLocaleDateString("en-GB")}
              </Typography>
              <Typography>
                <strong>Previous Experience:</strong>{" "}
                {userData?.data?.userDetails?.previousExperience}
              </Typography>
              <Typography>
                <strong>Probation Date:</strong>{" "}
                {new Date(
                  userData?.data?.userDetails?.probationDate
                ).toLocaleDateString("en-GB")}
              </Typography>
              <Typography>
                <strong>PAN No:</strong> {userData?.data?.userDetails?.panNo}
              </Typography>
              <Typography>
                <strong>PF No:</strong> {userData?.data?.userDetails?.pfNo}
              </Typography>
              <Typography>
                <strong>PAN No:</strong> {userData?.data?.userDetails?.panNo}
              </Typography>{" "}
              <Typography>
                <strong>account Number:</strong>{" "}
                {userData?.data?.userDetails?.bankDetails?.accountNumber}
              </Typography>{" "}
              <Typography>
                <strong>IFSC Code:</strong>{" "}
                {userData?.data?.userDetails?.bankDetails?.ifscCode}
              </Typography>{" "}
              <Typography>
                <strong>Branch Name:</strong>{" "}
                {userData?.data?.userDetails?.bankDetails?.branchName}
              </Typography>{" "}
              <Typography>
                <strong>Leave Details:</strong>{" "}
                {userData?.data?.userDetails?.leaveDetails?.leave}
              </Typography>{" "}
              {/* Add more fields if needed */}
            </Stack>
          ) : (
            <Typography>No user data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
              background:
                "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              color: "white",
              mx: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
