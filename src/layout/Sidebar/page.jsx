import { Box, styled, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { sidemenu_items } from "@/data";

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
  const { roleId } = useAuth();

  const getFilteredMenuItems = () => {
    if (roleId === "ADMIN" || roleId === "HR") {
      return sidemenu_items;
    } else if (roleId === "EMPLOYEE") {
      return sidemenu_items.filter((item) =>
        ["Dashboard", "Leave", "Employee", "Holidays"].includes(item.label)
      );
    } else if (roleId === "PROJECT_MANAGER") {
      return sidemenu_items.filter((item) =>
        ["Dashboard", "Leave", "Employee", "Holidays"].includes(item.label)
      );
    }
    return [];
  };

  return (
    <SidebarContent>
      <Link href="/dashboard">
        <SidebarLogo>
          <Image
            src="/assets/technithunder-logo2.svg"
            width={200}
            height={70}
            alt="Picture of the author"
            
          />
        </SidebarLogo>
      </Link>

        <SidebarMenuContainer>
        {getFilteredMenuItems().map((item, index) => (
          <SidebarMenuContainerItem
            key={index}
            href={item.to}
            active={pathname === (item.to) || pathname.startsWith((item.to) + "/")}
          >
            {item.icon && (
              <Image
                src={item.icon}
                height={22}
                width={22}
                alt={`${item.label} icon`}
              />
            )}
            <SidebarMenuContainerItemText>
              {item.label}
            </SidebarMenuContainerItemText>
          </SidebarMenuContainerItem>
        ))}
      </SidebarMenuContainer>
    </SidebarContent>
  );
};

export default Sidebar;
