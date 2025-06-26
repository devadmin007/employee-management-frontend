import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

const notFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src="/assets/404.jpg" alt="" height={600} width={800} />
    </Box>
  );
};

export default notFound;
