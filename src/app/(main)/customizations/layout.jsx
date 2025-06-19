"use client";

import CustomizedSidebar from "@/components/customizedSidebar/page";
import { Box, styled } from "@mui/material";
import React from "react";

const CustomizationMainWrapper = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 70px)",
  display: "flex",
}));

const CustomizationSidebar = styled(Box)(({ theme }) => ({
  width: "20%",
  height: "100%",
  backgroundColor: "white",
}));

const CustomizationContent = styled(Box)(({ theme }) => ({
  width: "80%",
  height: "100%",
}));

const customizations = ({ children }) => {
  return (
    <CustomizationMainWrapper>
      <CustomizationSidebar>
        <CustomizedSidebar />
      </CustomizationSidebar>
      <CustomizationContent>{children}</CustomizationContent>
    </CustomizationMainWrapper>
  );
};

export default customizations;
