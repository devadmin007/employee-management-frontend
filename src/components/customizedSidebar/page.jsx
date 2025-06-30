import {
  Box,
  Stack,
  styled,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

const customizationsArray = [
  { title: "Skills", url: "/customizations/skills" },
  { title: "Departments", url: "/customizations/departments" },
  { title: "Designations", url: "/customizations/designations" },
  { title: "Teams", url: "/customizations/teams" },
];

const Text = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  fontSize: "16px",
  height: "50px",
  paddingBlock: "12px",
  paddingInline: "16px",
  borderBottom: "1.5px solid #EEEEEE",
  fontWeight: "500",
  textDecoration: "none",
  color: active ? "white" : "black",
  backgroundColor: active ? "#FFA500" : "transparent",
  fontFamily: theme.typography.fontFamily,
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    paddingInline: "12px",
  },
}));

const CustomizedSidebar = ({ onLinkClick }) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: 2,
        height: "100%",
        backgroundColor: "white",
        borderRight: "7px solid #EEEEEE",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EEEEEE",
          px: 2,
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: isMobile ? "16px" : "18px",
          }}
        >
          Customizations
        </Typography>

        {onLinkClick && (
          <IconButton onClick={onLinkClick}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Stack>
        {customizationsArray.map((element, index) => (
          <Text
            key={index}
            href={element.url}
            active={pathname === element.url}
            onClick={onLinkClick}
          >
            {element.title}
          </Text>
        ))}
      </Stack>
    </Box>
  );
};

export default CustomizedSidebar;
