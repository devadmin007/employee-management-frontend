"use client";
import React from "react";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";

const MainWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: theme.palette.common.white,
  display: "flex",
}));

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: "20%",
  height: "100%",
  backgroundColor: "#15283C",
}));

const BodyWrapper = styled(Box)(({ theme }) => ({
  width: "80%",
  height: "100%",
  backgroundColor: "red",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  height: "70px",
  width: "100%",
  backgroundColor: "#FF5722",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 70px)",
  width: "100%",
  backgroundColor: "white",
  padding: "20px",
  overflowY: "auto",
  scrollbarWidth: "none",
}));

const MainLayout = ({ children }) => {
  return (
    <MainWrapper>
      <SidebarWrapper>{/* <Sidebar /> */}</SidebarWrapper>
      <BodyWrapper>
        <HeaderWrapper>{/* <Header /> */}</HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </BodyWrapper>
    </MainWrapper>
  );
};

export default MainLayout;
