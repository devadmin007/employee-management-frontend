import { Box, styled, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarMenuContainerItemText = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
}));
const SidebarContent = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const SidebarLogo = styled(Box)(({ theme }) => ({
  height: "70px",
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
  paddingInline: "30px",
  paddingBlock: "17px",
}));

const SidebarMenuContainerItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  color: "white",
  backgroundColor: active ? "orange" : "#15283C",
  textDecoration: "none",
  height: "55px",
  fontSize: "20px",
  fontFamily: theme.typography.fontFamily,
  alignItems: "center",
  display: "flex",
  gap: 15,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  borderRadius: 8,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: active ? "orange" : "#173351",
    color: "white",
  },
}));

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <Link href="/dashboard">
        <SidebarLogo>
          <Image
            src="/assets/techniThunder-logo2.svg"
            width={200}
            height={70}
            alt="Picture of the author"
            
          />
        </SidebarLogo>
      </Link>

      <SidebarMenuContainer>
        <SidebarMenuContainerItem
          href="/dashboard"
          active={pathname === "/dashboard"}
        >
          <Image
            src="/icons/dashboard.svg"
            height={22}
            width={22}
            alt="Leave icon"
          />
          <Typography>Dashboard</Typography>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem href="/leave" active={pathname === "/leave"}>
          <Image
            src="/icons/leave.svg"
            height={22}
            width={22}
            alt="Leave icon"
          />
          <Typography>Leave</Typography>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem
          href="/employee"
          active={pathname === "/employee"}
        >
          <Image
            src="/icons/employees.svg"
            height={22}
            width={22}
            alt=""
          ></Image>
          <SidebarMenuContainerItemText>Employees</SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem
          href="/holidays"
          active={pathname === "/holidays"}
        >
          <Image src="/icons/holiday.svg" height={22} width={22} alt=""></Image>
          <SidebarMenuContainerItemText>Holidays</SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
        <SidebarMenuContainerItem
          href="/customizations/teams"
          active={pathname === "/customizations/teams"}
        >
          <Image
            src="/icons/Customizations.svg"
            height={22}
            width={22}
            alt=""
          ></Image>
          <SidebarMenuContainerItemText>
            Customizations
          </SidebarMenuContainerItemText>
        </SidebarMenuContainerItem>
      </SidebarMenuContainer>
    </SidebarContent>
  );
};

export default Sidebar;
