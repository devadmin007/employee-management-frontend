import { Box, Button, styled } from "@mui/material";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";

const HeaderContent = styled(Box)(({ theme }) => ({
  height: "60px",
  display: "flex",
  flexDirection: "row-reverse",
}));

const HeaderUserButton = styled(Button)(({ theme }) => ({
  height: "50px",
  width: "40px",
  backgroundColor: "#15283C",
  borderRadius: "100%",
  marginInline: "20px",
  marginBlock: "10px",
  fontSize: "24px",
  color: theme.palette.common.white,
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <HeaderContent>
      <HeaderUserButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        A
      </HeaderUserButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem
          onClick={handleClose}
          style={{
            display: "flex",
            gap:4,
        color:'red'
          }}
        >
          <LogoutIcon/>Logout
        </MenuItem>
      </Menu>
    </HeaderContent>
  );
};

export default Header;
