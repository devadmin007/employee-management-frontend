"use client";
import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const allowedRoutesRole1 = [
    "/leave",
    "/employee",
    "/holidays",
    "/salary",
    "/customizations",
  ];
  const allowedRoutesRole2 = [ "/leave", "/employee", "/holidays","/salary"];
  const allowedRoutesRole3 = [ "/leave", "/employee", "/holidays","/salary"];

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];

  // Helper function to get default route for role
  const getDefaultRouteForRole = (roleId) => {
    switch (roleId) {
      case "ADMIN":
      case "HR":
        return allowedRoutesRole1[0];
      case "EMPLOYEE":
        return allowedRoutesRole2[0];
      case "PROJECT_MANAGER":
        return allowedRoutesRole3[0];
      default:
        return "/login";
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedRoleId =
      typeof window !== "undefined" ? localStorage.getItem("roleId") : null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          toast.error("Session expired! Please log in again.");
          logout();
        } else {
          setIsAuthenticated(true);
          setRoleId(storedRoleId);
          setTimeout(
            () => {
              toast.error("Session expired! Please log in again.");
              logout();
            },
            (decodedToken.exp - currentTime) * 1000
          );
        }
      } catch (error) {
        console.error("Invalid Token:", error);
        toast.error("Invalid session! Please log in again.");
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAuthenticated && !isLoading && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Only apply role-based routing for authenticated users on non-public routes
    if (isAuthenticated && roleId && !isPublicRoute) {
      const isAllowedRoute = (allowedRoutes) => {
        return allowedRoutes.some(
          (route) => pathname.startsWith(route) || pathname.includes(route)
        );
      };

      if (roleId === "ADMIN" || roleId === "HR") {
        if (!isAllowedRoute(allowedRoutesRole1)) {
          router.replace(allowedRoutesRole1[0]);
        }
      } else if (roleId === "EMPLOYEE") {
        if (!isAllowedRoute(allowedRoutesRole2)) {
          router.replace(allowedRoutesRole2[0]);
        }
      } else if (roleId === "PROJECT_MANAGER") {
        if (!isAllowedRoute(allowedRoutesRole3)) {
          router.replace(allowedRoutesRole3[0]);
        }
      }
    }
  }, [isAuthenticated, roleId, pathname, router]);

  const login = (data) => {

    localStorage.setItem("token", data?.token);
    localStorage.setItem("roleId", data?.role);
    setIsAuthenticated(true);
    setRoleId(data?.role);

    // Redirect to appropriate route based on role
    const defaultRoute = getDefaultRouteForRole(data?.role);
    router.replace(defaultRoute);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    setIsAuthenticated(false);
    setRoleId(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, roleId, isLoading, login, logout }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
