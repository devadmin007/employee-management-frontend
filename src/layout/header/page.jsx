import { Avatar, Box, Button, styled } from "@mui/material";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";

const HeaderContent = styled(Box)(({ theme }) => ({
  height: "60px",
  display: "flex",
  flexDirection: "row-reverse",
}));

const Header = () => {
  return (
    <HeaderContent>
      <Avatar sx={{ bgcolor: "#15283C",m:2}}>P</Avatar>
    </HeaderContent>
  );
};

export default Header;
