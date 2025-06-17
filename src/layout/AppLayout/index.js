"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";

const AppLayout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <ToastContainer autoClose={1500} />
    </ThemeProvider>
  );
};

export default AppLayout;
