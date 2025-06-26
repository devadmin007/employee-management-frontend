"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

// Components with `forwardRef` and `validate()` exposed
import PersonalInfoTab from "../personalInfo/page";
import TeamsAndSkillTab from "../teamsAndSkill/page";
import SettingTab from "../setting/page";
import BankDetailsTab from "../bankDetails/page";
import { createEmployeeApi } from "@/api";
import SuccessModal from "../SuccessModal/page";

const steps = ["Personal Info", "Team & Skill", "Settings", "Bank Details"];

export default function EmployeeStepperForm({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  console.log("activeStep", activeStep);
  const [formData, setFormData] = useState({
    personalInfo: {},
    teamAndSkill: {},
    settings: {},
    bankDetails: {},
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    console.log("Final form data:", data);
    try {
      // const response = await createEmployeeApi(data);
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInfoTab onBack={onClose} onSubmit={onSubmit} />;
      case 1:
        return <TeamsAndSkillTab onBack={handleBack} onSubmit={onSubmit} />;
      case 2:
        return <SettingTab onBack={handleBack} onSubmit={onSubmit} />;
      case 3:
        return <BankDetailsTab onBack={handleBack} onSubmit={onSubmit} />;
      default:
        return  <SuccessModal onClose={onClose} setActiveStep={setActiveStep}/>;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "900px",
          maxWidth: "100%",
          m: 5,
        },
      }}
    >
      <DialogTitle sx={{ mx: 2, fontWeight: "600", fontSize: "22px" }}>
        Add Employee
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            height: "515px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky Stepper Header */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "#fff",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography sx={{ fontSize: "14px" }}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Scrollable Form Section */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              scrollbarWidth: "none",
              px: 2,
              py: 3,
            }}
          >
            {renderStepContent(activeStep)}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
