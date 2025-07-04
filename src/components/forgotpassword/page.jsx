"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonInput from "@/components/CommonInput";
import { forgotPassword } from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordDialog = ({ open, onClose }) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    const obj = {
      email: data.email.toLowerCase().trim(),
    };

    setIsLoading(true);
    try {
      const res = await forgotPassword(obj);
      console.log(res);
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message);

        reset();
        onClose();
      }
    } catch (error) {
      console.error("Forgot Password API Error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogTitle>
        Forgot Password
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
        >
          <Typography variant="subtitle2" fontWeight={500}>
            Please enter your registered email address
          </Typography>

          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CommonInput
                  {...field}
                  placeholder="Enter your email"
                  type="email"
                  error={!!error}
                  helperText={error ? error.message : ""}
                  fullWidth
                  height={44}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: "10px",
              background:
                "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Send Reset Link"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
