"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "@/context/AuthContext";

const AppLayout = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer autoClose={1500} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default AppLayout;
