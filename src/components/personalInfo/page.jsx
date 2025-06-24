"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PersonalInfoTab = () => {
  const [preview, setPreview] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [dob, setDob] = useState(null); // for storing date

  const handleDateChange = (newValue) => {
    setDob(newValue);
    console.log("Selected DOB:", newValue?.format?.("YYYY-MM-DD"));
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSameAddressToggle = (e) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      setValue("currentAddress", watch("permanentAddress"));
      setValue("currentCity", watch("permanentCity"));
      setValue("currentState", watch("permanentState"));
      setValue("currentZip", watch("permanentZip"));
      setValue("currentCountry", watch("permanentCountry"));
    }
  };

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: "900px",
        margin: "auto",
        padding: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Box textAlign="center" mb={4} position="relative">
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          hidden
          onChange={handleImageUpload}
        />

        <label htmlFor="profile-upload">
          <IconButton component="span">
            <Avatar src={preview || ""} sx={{ width: 150, height: 150 }} />
            {!preview && (
              <PhotoCamera
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: "calc(50% - 50px)",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: "4px",
                }}
              />
            )}
          </IconButton>
        </label>

        {preview && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              backgroundColor: "#fff",
              borderRadius: 4,
              p: "4px 8px",
              boxShadow: 1,
            }}
          >
            <label htmlFor="profile-upload">
              <IconButton size="small" component="span">
                <EditIcon fontSize="small" />
              </IconButton>
            </label>

            <IconButton size="small" onClick={() => setPreview(null)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Employee ID"
            fullWidth
            {...register("employeeId", { required: "Employee ID is required" })}
            error={!!errors.employeeId}
            helperText={errors.employeeId?.message}
          />
          <TextField
            label="First Name"
            fullWidth
            {...register("firstName", { required: "First Name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Last Name"
            fullWidth
            {...register("lastName", { required: "Last Name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            label="Mobile"
            fullWidth
            {...register("mobile", { required: "Mobile is required" })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Emergency Mobile"
            fullWidth
            {...register("emergencyMobile")}
          />
          <TextField
            label="Personal Email Address"
            fullWidth
            {...register("personalEmail")}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={dob}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select {...register("gender")} label="Gender">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Typography variant="subtitle1" fontWeight="bold" mt={3}>
          Permanent Address
        </Typography>
        <TextField
          label="Address"
          fullWidth
          multiline
          {...register("permanentAddress")}
        />
        <Stack direction="row" spacing={2}>
          <TextField label="City" fullWidth {...register("permanentCity")} />
          <TextField label="State" fullWidth {...register("permanentState")} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="Zip Code" fullWidth {...register("permanentZip")} />
          <TextField
            label="Country"
            fullWidth
            {...register("permanentCountry")}
          />
        </Stack>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Current Address
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsPermanent}
                onChange={handleSameAddressToggle}
              />
            }
            label="Same as Permanent Address"
          />
        </Box>

        <TextField
          label="Address"
          fullWidth
          multiline
          {...register("currentAddress")}
        />
        <Stack direction="row" spacing={2}>
          <TextField label="City" fullWidth {...register("currentCity")} />
          <TextField label="State" fullWidth {...register("currentState")} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="Zip Code" fullWidth {...register("currentZip")} />
          <TextField
            label="Country"
            fullWidth
            {...register("currentCountry")}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default PersonalInfoTab;
