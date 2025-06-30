import { Box, styled, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { sidemenu_items } from "@/data";

const SidebarMenuContainerItemText = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  [theme.breakpoints.down("md")]: {
    fontSize: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
}));

const SidebarContent = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const SidebarLogo = styled(Box)(({ theme }) => ({
  height: "70px",
  width: "100%",
  display: "flex",
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
  [theme.breakpoints.down("md")]: {
    paddingInline: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingInline: "16px",
  },
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
  [theme.breakpoints.down("md")]: {
    height: "48px",
    fontSize: "18px",
    gap: 12,
  },
  [theme.breakpoints.down("sm")]: {
    height: "44px",
    fontSize: "16px",
    gap: 10,
  },
}));

// Main Sidebar component
const Sidebar = ({ onClose }) => {
  const pathname = usePathname();
  const { roleId } = useAuth();

  const getFilteredMenuItems = () => {
    if (roleId === "ADMIN" || roleId === "HR") {
      return sidemenu_items;
    } else if (roleId === "EMPLOYEE" || roleId === "PROJECT_MANAGER") {
      return sidemenu_items.filter((item) =>
        ["Employee", "Leave", "Holidays","Salary"].includes(item.label)
      );
    }
    return [];
  };

  return (
    <SidebarContent>
      <Link href="/employee" onClick={onClose}>
        <SidebarLogo>
          <Image
            src="/assets/technithunder-logo2.svg"
            width={200}
            height={70}
            alt="Logo"
          />
        </SidebarLogo>
      </Link>

      <SidebarMenuContainer>
        {getFilteredMenuItems().map((item, index) => (
          <SidebarMenuContainerItem
            key={index}
            href={item.to}
            active={pathname === item.to || pathname.startsWith(item.to + "/")}
            onClick={onClose}
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
