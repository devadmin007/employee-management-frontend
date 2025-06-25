"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Stack,
  Avatar,
  IconButton,
  Box,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../CommonInput";
import * as yup from "yup";
import { getAllRoles } from "@/api";


const personalInfoSchema = yup.object().shape({
  image: yup
    .mixed()
    .test("fileSize", "Image is too large", (value) => {
      if (!value) return true;
      return value.size <= 2000000;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    })
    .required("Profile image is required"),
  role: yup.string().required("Role is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^\d{10,15}$/, "Enter a valid Phone Number"),
  personalNumber: yup
    .string()
    .required("Emergency Mobile is required")
    .matches(/^\d{10,15}$/, "Enter a valid Emergency Mobile"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("is-date", "Invalid date format", (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),
  gender: yup.string().required("Gender is required"),
  permanentAddress: yup.object().shape({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup
      .string()
      .required("Zip Code is required")
      .matches(/^\d{4,10}$/, "Enter a valid zip code"),
    country: yup.string().required("Country is required"),
  }),
  currentAddress: yup.object().shape({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup
      .string()
      .required("Zip Code is required")
      .matches(/^\d{4,10}$/, "Enter a valid zip code"),
    country: yup.string().required("Country is required"),
  }),
});


const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];


const PersonalInfoTab = ({ onBack,onSubmit }) => {
  const [preview, setPreview] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [roles, setRoles] = useState([]);


  const {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      image: null,
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      currentAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });


  const handleFormSubmit = (data) => {
    const formData = new FormData();


    Object.keys(data).forEach(key => {
      if (key === 'permanentAddress' || key === 'currentAddress') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    formData.append("step", 1);


    console.log("Form data:", Object.fromEntries(formData));
    if (onSubmit) {
      onSubmit(formData);
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
      trigger("image");
    }
  };


  const handleSameAddressToggle = (e) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      const permanentAddress = watch("permanentAddress");
      setValue("currentAddress", permanentAddress);
    } else {
      setValue("currentAddress", {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      });
    }
  };


  const handleFetchRole = async () => {
    try {
      const response = await getAllRoles();
      if (response?.data) {
        setRoles(response?.data?.data?.roles);
      }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    handleFetchRole();
  }, []);


  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Role"
                    variant="outlined"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    {roles?.length > 0 &&
                      roles?.map((option) => (
                        <MenuItem key={option.role} value={option._id}>
                          {option.role}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>


            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>


            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    size="medium"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>


            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="personalNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Mobile"
                    variant="outlined"
                    size="medium"
                    error={!!errors.personalNumber}
                    helperText={errors.personalNumber?.message}
                  />
                )}
              />
            </Grid>


            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    variant="outlined"
                    useBuiltInLabel={true}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>


            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Gender"
                    variant="outlined"
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CommonInput>
                )}
              />
            </Grid>
          </Grid>


          <Typography variant="subtitle1" fontWeight="bold" mt={3}>
            Permanent Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }}>
              <Controller
                name="permanentAddress.street"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    error={!!errors.permanentAddress?.street}
                    helperText={errors.permanentAddress?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permanentAddress.city"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="City"
                    variant="outlined"
                    error={!!errors.permanentAddress?.city}
                    helperText={errors.permanentAddress?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permanentAddress.state"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="State"
                    variant="outlined"
                    error={!!errors.permanentAddress?.state}
                    helperText={errors.permanentAddress?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permanentAddress.zip"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    error={!!errors.permanentAddress?.zip}
                    helperText={errors.permanentAddress?.zip?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permanentAddress.country"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Country"
                    variant="outlined"
                    error={!!errors.permanentAddress?.country}
                    helperText={errors.permanentAddress?.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>


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


          <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }}>
              <Controller
                name="currentAddress.street"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    disabled={sameAsPermanent}
                    error={!!errors.currentAddress?.street}
                    helperText={errors.currentAddress?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="currentAddress.city"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="City"
                    variant="outlined"
                    disabled={sameAsPermanent}
                    error={!!errors.currentAddress?.city}
                    helperText={errors.currentAddress?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="currentAddress.state"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="State"
                    variant="outlined"
                    disabled={sameAsPermanent}
                    error={!!errors.currentAddress?.state}
                    helperText={errors.currentAddress?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="currentAddress.zip"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    disabled={sameAsPermanent}
                    error={!!errors.currentAddress?.zip}
                    helperText={errors.currentAddress?.zip?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="currentAddress.country"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Country"
                    variant="outlined"
                    disabled={sameAsPermanent}
                    error={!!errors.currentAddress?.country}
                    helperText={errors.currentAddress?.country?.message}
                  />
                )}
              />
            </Grid>
          </Grid>


          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              py: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button variant="outlined" onClick={onBack}>Back</Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              }}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default PersonalInfoTab;