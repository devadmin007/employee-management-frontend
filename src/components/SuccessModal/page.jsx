import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";

const SuccessModal = ({ onClose, setActiveStep, EmployeeStepperForm }) => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onClose?.();
          setActiveStep?.(0);
          EmployeeStepperForm?.();
          router.push("/employee/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  return (
    <Box mt={5}>
      <Card sx={{ borderRadius: "20px" }}>
        <CardContent>
          <Typography
            textAlign={"center"}
            fontSize={24}
            fontWeight={"700"}
            color={"#0E1090"}
          >
            Form submitted successfully!
          </Typography>
          {/* <Box
            display={"flex"}
            mt={4}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
          >
            <Image
              src={"assets/techniThunder-logo2.svg"}
              alt="clipboard-icon"
              height={250}
              width={250}
            />
          </Box> */}
          <Typography textAlign={"center"} mt={2} fontWeight={"700"}>
            Form will automatically close in {""}
            <span style={{ color: "#B92932" }}>{seconds} second</span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessModal;
