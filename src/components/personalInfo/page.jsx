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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../CommonInput";
import { getAllRoles } from "@/api";
import personalInfoSchema from "@/schemas/personalInfoSchema";
import { parseAddress } from "@/utils/helper";
import { genderOptions } from "@/data";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

const PersonalInfoTab = ({
  onBack,
  onSubmit,
  defaultValues = {},
  userId = null,
  isLoading,
}) => {
  const [preview, setPreview] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [roles, setRoles] = useState([]);

  const permenentAddress = parseAddress(defaultValues?.permenentAddress);
  const currentAddress = parseAddress(defaultValues?.currentAddress);

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
    defaultValues: {
      role: defaultValues?.role || "",
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.firstName || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      personalNumber: defaultValues?.personalNumber || "",
      dateOfBirth: defaultValues?.dateOfBirth || "",
      email: defaultValues?.email || "",
      personalEmail: defaultValues?.personalEmail || "",
      gender: defaultValues?.gender || "",
      image: defaultValues?.image || null,
      permenentAddress: {
        street: permenentAddress?.street || "",
        city: permenentAddress?.city || "",
        state: permenentAddress?.state || "",
        zip: permenentAddress?.zip || "",
        country: permenentAddress?.country || "",
      },
      currentAddress: {
        street: currentAddress?.street || "",
        city: currentAddress?.city || "",
        state: currentAddress?.state || "",
        zip: currentAddress?.zip || "",
        country: currentAddress?.country || "",
      }
    },
  });

  const handleFormSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "permenentAddress" || key === "currentAddress") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === "image") {
        if (data[key] instanceof File) {
          formData.append("image", data[key]);
        } else if (typeof data[key] === "string" && data[key]) {
          formData.append("image", data[key]);
        }
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    formData.append("step", 1);

    // console.log("Form data:", Object.fromEntries(formData));
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
    if (userId && defaultValues) {
      setValue("role", defaultValues?.role || "");
      setValue("firstName", defaultValues?.firstName || "");
      setValue("lastName", defaultValues?.lastName || "");
      setValue("phoneNumber", defaultValues?.phoneNumber || "");
      setValue("personalNumber", defaultValues?.personalNumber || "");
      setValue("dateOfBirth", defaultValues?.dateOfBirth || "");
      setValue("gender", defaultValues?.gender || "male");
      setValue("email", defaultValues?.email || "");
      setValue("personalEmail", defaultValues?.personalEmail || "");

      // Parse permanent address
      const permanentAddress = parseAddress(defaultValues?.permenentAddress);
      setValue("permenentAddress.street", permanentAddress?.street || "");
      setValue("permenentAddress.city", permanentAddress?.city || "");
      setValue("permenentAddress.state", permanentAddress?.state || "");
      setValue("permenentAddress.zip", permanentAddress?.zip || "");
      setValue("permenentAddress.country", permanentAddress?.country || "");

      // Parse current address
      const currentAddress = parseAddress(defaultValues?.currentAddress);
      setValue("currentAddress.street", currentAddress?.street || "");
      setValue("currentAddress.city", currentAddress?.city || "");
      setValue("currentAddress.state", currentAddress?.state || "");
      setValue("currentAddress.zip", currentAddress?.zip || "");
      setValue("currentAddress.country", currentAddress?.country || "");

      // Handle image
      if (defaultValues?.image) {
        setPreview(defaultValues.image);
        setValue("image", defaultValues.image);
      }

      // Check if addresses are the same
      if (permanentAddress && currentAddress) {
        const isSame =
          JSON.stringify(permanentAddress) === JSON.stringify(currentAddress);
        setSameAsPermanent(isSame);
      }
    }
    if (defaultValues?.image) {
      // Check if image is a File object
      if (defaultValues.image instanceof File) {
        // Create a FileReader to convert File to data URL for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(defaultValues.image);
        setValue("image", defaultValues.image);
      }
      // Check if image is a valid string URL or base64
      else if (
        typeof defaultValues.image === "string" &&
        defaultValues.image.trim() !== ""
      ) {
        setPreview(defaultValues.image);
        setValue("image", defaultValues.image);
      }
      else if (
        typeof defaultValues.image === "object" &&
        defaultValues.image !== null &&
        !Array.isArray(defaultValues.image) &&
        Object.keys(defaultValues.image).length > 0
      ) {
        if (defaultValues.image.url) {
          setPreview(defaultValues.image.url);
          setValue("image", defaultValues.image.url);
        } else if (defaultValues.image.path) {
          setPreview(defaultValues.image.path);
          setValue("image", defaultValues.image.path);
        }
      }
    }
  }, [userId, defaultValues, setValue]);

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
                    onChange={(e) => {
                      field?.onChange(e.target.value.replace(/[^0-9]/g, ''));
                    }}
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
                    onChange={(e) => {
                      field?.onChange(e.target.value.replace(/[^0-9]/g, ''));
                    }}
                    error={!!errors.personalNumber}
                    helperText={errors.personalNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    useBuiltInLabel={true}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="personalEmail"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Personal Email Address"
                    variant="outlined"
                    type="email"
                    useBuiltInLabel={true}
                    error={!!errors.personalEmail}
                    helperText={errors.personalEmail?.message}
                  />
                )}
              />
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Birth"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = date.format('YYYY-MM-DD');
                          field.onChange(formattedDate);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      shouldDisableDate={(date) => {
                        return date.isAfter(dayjs(), 'day');
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>


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
            <Button variant="outlined" onClick={() => onBack()}>
              Back
            </Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Next"
              )}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default PersonalInfoTab;