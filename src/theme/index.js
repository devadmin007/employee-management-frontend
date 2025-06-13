import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const theme = createTheme({
  palette: {
    common: {
      black: "#000000",
      white: "#ffffff",
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: poppins.style.fontFamily,
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
  },
});
