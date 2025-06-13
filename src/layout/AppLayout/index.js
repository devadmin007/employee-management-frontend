"use client";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";

const AppLayout = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppLayout;
