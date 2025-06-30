"use client";

import CustomizedSidebar from "@/components/customizedSidebar/page";
import {
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

const CustomizationMainWrapper = styled(Box)({
  height: "calc(100vh - 70px)",
  display: "flex",
  flexDirection: "row",
});

const CustomizationSidebar = styled(Box)({
  width: "16%",
  height: "100%",
  backgroundColor: "white",
  display: "block",
});

const CustomizationContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: "100%",
  padding: theme.spacing(0),
}));

const Customizations = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      {isMobile && !mobileOpen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            // zIndex: 1301,
          }}
        >
          {/* <MenuIcon /> */}
          <Typography sx={{ color: "black", mx: 2, fontWeight: 600 }}>
            Customizations
          </Typography>
          <ArrowDropDownIcon sx={{ color: "black" }} />
        </IconButton>
      )}

      {isMobile ? (
        <>
          <Drawer
            anchor="top"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
              },
            }}
          >
            <CustomizedSidebar onLinkClick={handleDrawerToggle} />
          </Drawer>
        </>
      ) : (
        <CustomizationMainWrapper>
          <CustomizationSidebar>
            <CustomizedSidebar />
          </CustomizationSidebar>
          <CustomizationContent>{children}</CustomizationContent>
        </CustomizationMainWrapper>
      )}

      {isMobile && (
        <CustomizationContent sx={{ pt: 4 }}>{children}</CustomizationContent>
      )}
    </Box>
  );
};

export default Customizations;
