import { Box, styled, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GroupsRounded } from "@mui/icons-material";

const SidebarMenuContainerItemText = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
}));
const SidebarContent = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const SidebarLogo = styled(Box)(({ theme }) => ({
  height: "70px",
  //   backgroundColor: "red",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  paddingBlock: "5px",
  paddingInline: "20px",
}));

const SidebarMenuContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 70px)",
  display: "flex",
  flexDirection: "column",
  color: "white",
  padding: "30px",
}));

const SidebarMenuContainerItem = styled(Link)(({ theme }) => ({
  color: "white",
  textDecoration: "none",
  fontSize: "22px",
  marginBlock: "10px",
  fontFamily: theme.typography.fontFamily,
  alignItems: "center",
  display: "flex",
  gap: 15,
}));

const Sidebar = () => {
  return (
    <SidebarContent>
      <Link href="/dashboard">
        <SidebarLogo>
          <Image
            src="/assets/technithunder-logo2.svg"
            width={290}
            height={70}
            alt="Picture of the author"
          />
        </SidebarLogo>
      </Link>

      <SidebarMenuContainer>
        <SidebarMenuContainerItem href="leave">
          <Image src="/icons/leave.svg" height={25} width={25}></Image>
          <SidebarMenuContainerItemText>Leave</SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem href="/employee">
          <GroupsRounded />
          <SidebarMenuContainerItemText>Employee</SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem href="/holidays">
          <Image src="/icons/holiday.svg" height={25} width={25}></Image>
          <SidebarMenuContainerItemText>Holidays</SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
      </SidebarMenuContainer>
    </SidebarContent>
  );
};

export default Sidebar;
