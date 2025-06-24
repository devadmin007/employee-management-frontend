import { Box, Stack, styled, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const customizationsArray = [
  { title: "skills", url: "/customizations/skills" },
  { title: "Departments", url: "/customizations/departments" },
  { title: "Designations", url: "/customizations/designations" },
  { title: "manager", url: "/customizations/manager" },
  { title: "Teams", url: "/customizations/teams" },
];

const Text = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active", // prevent prop from reaching DOM
})(({ theme, active }) => ({
  fontSize: "18px",
  height: "60px",
  paddingBlock: "15px",
  borderBottom: "1.5px solid #EEEEEE",
  fontWeight: "200",
  paddingInline: "20px",
  textDecoration: "none",
  color: active ? "white" : "black",
  backgroundColor: active ? "#FFA500" : "transparent",
  fontFamily: theme.typography.fontFamily,
  transition: "all 0.3s ease",
}));

const CustomizedSidebar = () => {
  const pathname = usePathname();
  return (
    <Box sx={{ py: 2, borderRight: "8px solid #EEEEEE", height: "100%" }}>
      <Typography
        sx={{
          textAlign: "start",
          fontWeight: "500",
          borderBottom: "1px solid #EEEEEE",
          py: 1,
          px: "20px",
          fontSize: "20px",
        }}
      >
        Customizations
      </Typography>
      <Stack>
        {customizationsArray.map((element, index) => (
          <Text
            key={index}
            href={element.url}
            active={pathname === element.url}
          >
            {element.title}
          </Text>
        ))}
      </Stack>
    </Box>
  );
};

export default CustomizedSidebar;
