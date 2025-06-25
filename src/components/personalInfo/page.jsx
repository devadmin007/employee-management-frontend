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
import moment from "moment";

// Fixed yup schema with proper validation
const personalInfoSchema = yup.object().shape({
  image: yup
    .mixed()
    .nullable()
    .test("fileSize", "Image is too large", (value) => {
      if (!value) return true; // Allow null/undefined
      if (typeof value === 'string') return true; // Allow URL strings for existing images
      if (value instanceof File) {
        return value.size <= 2000000; // 2MB limit
      }
      return true;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true; // Allow null/undefined
      if (typeof value === 'string') return true; // Allow URL strings for existing images
      if (value instanceof File) {
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
      return true;
    }),
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
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  gender: yup.string().required("Gender is required"),
  permenentAddress: yup.object().shape({
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

const PersonalInfoTab = ({ onBack, onSubmit, defaultValues = {}, userId = null }) => {
  console.log("defaultValues 94", defaultValues);

  const [preview, setPreview] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [roles, setRoles] = useState([]);

  // const getDefaultValues = () => {
  //   // Parse address fields if they come as JSON strings
  //   const parseAddress = (address) => {
  //     if (!address) return {
  //       street: "",
  //       city: "",
  //       state: "",
  //       zip: "",
  //       country: ""
  //     };

  //     if (typeof address === 'string') {
  //       try {
  //         return JSON.parse(address);
  //       } catch (e) {
  //         console.error('Failed to parse address:', e);
  //         return {
  //           street: "",
  //           city: "",
  //           state: "",
  //           zip: "",
  //           country: ""
  //         };
  //       }
  //     }
  //     return address;
  //   };

  //   // If userId is null, return blank/default values
  //   if (!userId) {
  //     return {
  //       role: "",
  //       firstName: "",
  //       lastName: "",
  //       phoneNumber: "",
  //       personalNumber: "",
  //       dateOfBirth: "",
  //       gender: "",
  //       image: null,
  //       permenentAddress: {
  //         street: "",
  //         city: "",
  //         state: "",
  //         zip: "",
  //         country: "",
  //       },
  //       currentAddress: {
  //         street: "",
  //         city: "",
  //         state: "",
  //         zip: "",
  //         country: "",
  //       },
  //     };
  //   }

  //   return {
  //     role: defaultValues?.role || "",
  //     firstName: defaultValues?.firstName || "",
  //     lastName: defaultValues?.lastName || "",
  //     phoneNumber: defaultValues?.phoneNumber || "",
  //     personalNumber: defaultValues?.personalNumber || "",
  //     dateOfBirth: defaultValues?.dateOfBirth || "",
  //     gender: defaultValues?.gender || "",
  //     image: defaultValues?.image || null,
  //     permenentAddress: parseAddress(defaultValues?.permenentAddress),
  //     currentAddress: parseAddress(defaultValues?.currentAddress),
  //   };
  // };

  const {
    setValue,
    watch,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    // defaultValues: getDefaultValues(),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      personalNumber: "",
      dateOfBirth: "",
      gender: "",
      image: null,
      permenentAddress: {
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
    console.log("data", data);

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (key === 'permenentAddress' || key === 'currentAddress') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("image", file);
      trigger("image");
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", null);
    trigger("image");
  };

  const handleSameAddressToggle = (e) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      const permenentAddress = watch("permenentAddress");
      setValue("currentAddress", permenentAddress);
      // Trigger validation for current address fields
      trigger("currentAddress");
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

  useEffect(() => {
    console.log("userId 214", userId);

    if (userId && defaultValues) {
      setValue("role", defaultValues?.role || "");
      setValue("firstName", defaultValues?.firstName || "");
      setValue("lastName", defaultValues?.lastName || "");
      setValue("phoneNumber", defaultValues?.phoneNumber || "");
      setValue("personalNumber", defaultValues?.personalNumber || "");
      setValue("dateOfBirth", defaultValues?.dateOfBirth ? moment(defaultValues?.dateOfBirth).format("DD/MM/YYY") : "");
      setValue("gender", defaultValues?.gender || "Male");
      setValue("permenentAddress.street", defaultValues?.permenentAddress?.street || "");
      setValue("permenentAddress.city", defaultValues?.permenentAddress?.city || "");
      setValue("permenentAddress.state", defaultValues?.permenentAddress?.state || "");
      setValue("permenentAddress.zip", defaultValues?.permenentAddress?.zip || "");
      setValue("permenentAddress.country", defaultValues?.permenentAddress?.country || "");
      setValue("currentAddress.street", defaultValues?.currentAddress?.street || "");
      setValue("currentAddress.city", defaultValues?.currentAddress?.city || "");
      setValue("currentAddress.state", defaultValues?.currentAddress?.state || "");
      setValue("currentAddress.zip", defaultValues?.currentAddress?.zip || "");
      setValue("currentAddress.country", defaultValues?.currentAddress?.country || "");

      if (defaultValues?.image) {
        setPreview(defaultValues.image);
      }
      if (defaultValues?.permenentAddress && defaultValues?.currentAddress) {
        const isSame = JSON.stringify(defaultValues.permenentAddress) ===
          JSON.stringify(defaultValues.currentAddress);
        setSameAsPermanent(isSame);
      }
    }
  }, [userId, defaultValues]);

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
              <IconButton size="small" onClick={handleRemoveImage}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          {errors.image && (
            <Typography color="error" textAlign="center" mb={2}>
              {errors.image.message}
            </Typography>
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
                name="permenentAddress.street"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    error={!!errors.permenentAddress?.street}
                    helperText={errors.permenentAddress?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permenentAddress.city"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="City"
                    variant="outlined"
                    error={!!errors.permenentAddress?.city}
                    helperText={errors.permenentAddress?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permenentAddress.state"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="State"
                    variant="outlined"
                    error={!!errors.permenentAddress?.state}
                    helperText={errors.permenentAddress?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permenentAddress.zip"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Zip Code"
                    variant="outlined"
                    error={!!errors.permenentAddress?.zip}
                    helperText={errors.permenentAddress?.zip?.message}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="permenentAddress.country"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Country"
                    variant="outlined"
                    error={!!errors.permenentAddress?.country}
                    helperText={errors.permenentAddress?.country?.message}
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