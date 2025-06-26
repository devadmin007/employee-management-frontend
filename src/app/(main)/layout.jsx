"use client";
import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Sidebar from "@/layout/Sidebar/page";
import Header from "@/layout/header/page";

const MainWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: theme.palette.common.white,
  display: "flex",
}));

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: "18%",
  height: "100%",
  backgroundColor: "#15283C",
}));

const BodyWrapper = styled(Box)(({ theme }) => ({
  width: "82%",
  height: "100%",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  height: "70px",
  width: "100%",
  background:
    "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 70px)",
  width: "100%",
  backgroundColor: "white",
  overflowY: "auto",
  scrollbarWidth: "none",
}));

const MainLayout = ({ children }) => {
  return (
    <MainWrapper>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <BodyWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </BodyWrapper>
    </MainWrapper>
  );
};

export default MainLayout;
