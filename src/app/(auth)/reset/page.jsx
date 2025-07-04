"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import CommonInput from "@/components/CommonInput";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/api";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  password: yup.string().min(6).required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const user = useSelector((state) => state.auth.userData);

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const [isLoading, setIsLoading] = useState(false);

  console.log("token====>", token);
  console.log("userId====>", userId);

  const onSubmit = async (data) => {
    console.log("data", data);

    const obj = {
      token: token,
      userId: userId,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    };

    console.log("obj===>", obj);

    setIsLoading(true);
    try {
      const res = await resetPassword(obj);
      console.log("res===>", res);
      if (res?.data?.status === "success") {
        router.push("/login");
      }
    } catch (error) {
      console.error("Login API Error:", error);
      toast.error(res?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper sx={{ maxWidth: 500, width: "100%", p: 5, borderRadius: 5 }}>
        <Typography
          variant="h5"
          mb={3}
          textAlign={"center"}
          sx={{ fontWeight: "500", fontSize: "1.3rem" }}
        >
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
                  New Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CommonInput
                      {...field}
                      placeholder="Enter your new password"
                      type="password"
                      error={!!error}
                      helperText={error ? error.message : ""}
                      fullWidth
                      height={44}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
                  Confirm Password
                </Typography>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CommonInput
                      {...field}
                      placeholder="Enter Confirm Password"
                      type="password"
                      error={!!error}
                      helperText={error ? error.message : ""}
                      fullWidth
                      height={44}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }} mt={1}>
              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                }}
                type="submit"
                fullWidth
                variant="contained"
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
