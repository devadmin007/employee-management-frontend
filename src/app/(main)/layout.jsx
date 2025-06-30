"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Sidebar from "@/layout/Sidebar/page";
import Header from "@/layout/header/page";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";

const MainWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: theme.palette.common.white,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
}));

const SidebarWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: "16%",
    height: "100vh",
    backgroundColor: "#15283C",
    display: "block",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const BodyWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  [theme.breakpoints.up("md")]: {
    width: "84%",
  },
  display: "flex",
  flexDirection: "column",
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  height: "70px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <MainWrapper>
      {/* Sidebar for desktop */}
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#15283C",
            color: "#fff",
          },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* Body content */}
      <BodyWrapper>
        <HeaderWrapper>
          {/* Hamburger button for mobile */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Actual Header content */}
          <Header />
        </HeaderWrapper>

        <ContentWrapper>{children}</ContentWrapper>
      </BodyWrapper>
    </MainWrapper>
  );
};

export default MainLayout;
