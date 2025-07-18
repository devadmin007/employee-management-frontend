"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import PersonalInfoTab from "../personalInfo/page";
import TeamsAndSkillTab from "../teamsAndSkill/page";
import SettingTab from "../setting/page";
import BankDetailsTab from "../bankDetails/page";
import {
  createEmployeeApi,
  getEmployeeByIdApi,
  updateEmployeeeApi,
} from "@/api";
import SuccessModal from "../SuccessModal/page";
import { useDispatch, useSelector } from "react-redux";
import { addEmployeeDataInfo } from "@/redux/slice/employeeDataSlice";
import moment from "moment";

const steps = ["Personal Info", "Team & Skill", "Settings", "Bank Details"];
const stepKeys = ["personalDetail", "teamAndSkillDetail", "settingDetail", "bankDetail"];

export default function EmployeeStepperForm({
  open,
  onClose,
  userId = null,
  fetchEmployee = () => { },
  formData = {},
  setFormData = () => { },
}) {
  const dispatch = useDispatch();
  const employeeDetails = useSelector((state) => state.employeeData);

  const [activeStep, setActiveStep] = useState(0);
  const [empId, setEmpId] = useState(null);
  const [allowClose, setAllowClose] = useState(false);

  const [isBack, setIsBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState(!userId ? "create" : "update");
  const [completedSteps, setCompletedSteps] = useState({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setIsBack(true);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCloseModal = (event, reason) => {
    if (allowClose || reason === "escapeKeyDown") {
      onClose();
      setAllowClose(false);
    }
  };

  const handleBackButton = () => {
    setAllowClose(true);
    handleBack();
  };

  const handleSuccessModalClose = () => {
    setAllowClose(true);
    onClose();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    // for (let [key, value] of data.entries()) {
    //   console.log(`${key}:`, value);
    // }

    // Convert FormData to plain object
    const plainData = Object?.fromEntries(data?.entries());

    const handleDispatchAction = async (payloadObj, type, detailKey, mode) => {
      try {
        if (mode === "create" && !isBack) {
          const response = await createEmployeeApi(data);
          if (response?.data) {
            setEmpId(response?.data?.data?.userId);
            setRole(response?.data?.data?.roledata?.role);

            dispatch(
              addEmployeeDataInfo({
                type,
                [detailKey]: payloadObj,
              })
            );
          }
        } else if (mode === "update" || isBack) {
          const response = await updateEmployeeeApi(data);
          if (response?.data) {
            setEmpId(response?.data?.data?.userId);
            // setFormData((prev) => ({ ...prev, personalInfo: plainData }));
            dispatch(
              addEmployeeDataInfo({
                type,
                [detailKey]: payloadObj,
              })
            );
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    if (mode === "create") {
      if (activeStep === 0) {
        await handleDispatchAction(
          plainData,
          "personalInfo",
          "personalDetail",
          mode
        );
      } else {
        data.append("userId", empId);
        switch (activeStep) {
          case 1:
            await handleDispatchAction(
              plainData,
              "teamAndSkillInfo",
              "teamAndSkillDetail",
              mode
            );
            break;
          case 2:
            await handleDispatchAction(
              plainData,
              "settingInfo",
              "settingDetail",
              mode
            );
            break;
          case 3:
            await handleDispatchAction(
              plainData,
              "bankInfo",
              "bankDetail",
              mode
            );
            break;
          default:
            console.log("Invalid step");
        }
      }
    } else if (mode === "update") {
      data.append("userId", !userId ? empId : userId);
      if (activeStep === 0) {
        await handleDispatchAction(
          plainData,
          "personalInfo",
          "personalDetail",
          mode
        );
      } else {
        switch (activeStep) {
          case 1:
            await handleDispatchAction(
              plainData,
              "teamAndSkillInfo",
              "teamAndSkillDetail",
              mode
            );
            break;
          case 2:
            await handleDispatchAction(
              plainData,
              "settingInfo",
              "settingDetail",
              mode
            );
            break;
          case 3:
            await handleDispatchAction(
              plainData,
              "bankInfo",
              "bankDetail",
              mode
            );
            break;
          default:
            console.log("Invalid step");
        }
      }
    }

    setIsLoading(false);
    setFormData((prevData) => {
      const plainData = {};

      for (const [key, value] of data.entries()) {
        const isArrayField = key.endsWith("[]");
        const cleanKey = isArrayField ? key.slice(0, -2) : key;

        // Check for nested structure like bankDetails[accountNumber]
        const nestedMatch = cleanKey.match(/^([^\[]+)\[([^\]]+)\]$/);

        if (nestedMatch) {
          // This is a nested field (e.g., bankDetails[accountNumber])
          const parentKey = nestedMatch[1];
          const childKey = nestedMatch[2];

          if (!plainData[parentKey]) {
            plainData[parentKey] = {};
          }

          plainData[parentKey][childKey] = value;
        }
        else if (isArrayField) {
          if (!plainData[cleanKey]) {
            plainData[cleanKey] = [];
          }
          plainData[cleanKey].push(value);
        }
        else {
          if (plainData.hasOwnProperty(cleanKey)) {
            if (!Array.isArray(plainData[cleanKey])) {
              plainData[cleanKey] = [plainData[cleanKey]];
            }
            plainData[cleanKey].push(value);
          } else {
            plainData[cleanKey] = value;
          }
        }
      }

      return {
        ...prevData,
        [stepKeys[activeStep]]: plainData,
      };
    });
    setActiveStep((prevStep) => prevStep + 1);
  };

  const fetchEmployeeById = async (id) => {
    try {
      const response = await getEmployeeByIdApi(id);
      const data = response?.data?.data;
      if (data) {
        setRole(data?.roleDetails?.role);
      }

      const personalDetails = {
        role: data?.role,
        firstName: data?.firstName,
        lastName: data?.lastName,
        image: data?.image,
        email: data?.email,
        personalEmail: data?.personalEmail,
        phoneNumber: data?.userDetails?.phoneNumber,
        personalNumber: data?.userDetails?.personalNumber,
        dateOfBirth: moment(data?.userDetails?.dateOfBirth).format("YYYY-MM-DD") || "",
        gender: data?.userDetails?.gender || "Male",
        permenentAddress: data?.userDetails?.permenentAddress || "",
        currentAddress: data?.userDetails?.currentAddress || "",
      };

      const teamAndSkillDetails = {
        managerId: data?.userDetails?.managerId || "",
        designationId: data?.userDetails?.designationId || "",
        teamId: data?.userDetails?.teamId || "",
        department: data?.userDetails?.department || "",
        primarySkills: data?.userDetails?.primarySkills || [],
        secondarySkills: data?.userDetails?.secondarySkills || [],
      };

      const settingDetails = {
        joiningDate: moment(data?.userDetails?.joiningDate).format("YYYY-MM-DD") || "",
        probationDate: moment(data?.userDetails?.probationDate).format("YYYY-MM-DD") || "",
        relieivingDate: moment(data?.userDetails?.relieivingDate).format("YYYY-MM-DD") || "",
        panNo: data?.userDetails?.panNo || "",
        pfNo: data?.userDetails?.pfNo || "",
        uanDetail: data?.userDetails?.uanDetail || "",
        previousExperience: data?.userDetails?.previousExperience || "",
        currentSalary: data?.userDetails?.currentSalary || "",
      };

      const bankDetails = {
        accountNumber: data?.userDetails?.bankDetails?.accountNumber || "",
        branchName: data?.userDetails?.bankDetails?.branchName || "",
        ifscCode: data?.userDetails?.bankDetails?.ifscCode || "",
      };

      const dataSections = [
        { type: "personalInfo", key: "personalDetail", data: personalDetails },
        { type: "teamAndSkillInfo", key: "teamAndSkillDetail", data: teamAndSkillDetails },
        { type: "settingInfo", key: "settingDetail", data: settingDetails },
        { type: "bankInfo", key: "bankDetail", data: bankDetails },
      ];

      // Dispatch all actions in one loop
      dataSections.forEach(({ type, key, data }) => {
        dispatch(addEmployeeDataInfo({ type, [key]: data }));
      });

      setFormData({
        personalDetail: personalDetails,
        teamAndSkillDetail: teamAndSkillDetails,
        settingDetail: settingDetails,
        bankDetail: bankDetails,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoTab
            onBack={onClose}
            onSubmit={onSubmit}
            defaultValues={
              formData?.personalDetail ||
              employeeDetails?.employeeDetails?.personalDetails
              // firstName: employeeDetails?.employeeDetails?.personalDetails?.firstName || "",
            }
            userId={userId}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <TeamsAndSkillTab
            onBack={handleBack}
            onSubmit={onSubmit}
            defaultValues={
              formData?.teamAndSkillDetail ||
              employeeDetails?.employeeDetails?.teamAndSkillDetails
            }
            userId={userId}
            isLoading={isLoading}
            role={role}
          />
        );
      case 2:
        return (
          <SettingTab
            onBack={handleBack}
            onSubmit={onSubmit}
            defaultValues={
              formData?.settingDetail ||
              employeeDetails?.employeeDetails?.settingDetails
            }
            userId={userId}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <BankDetailsTab
            onBack={handleBack}
            onSubmit={onSubmit}
            defaultValues={
              formData?.bankDetail ||
              employeeDetails?.employeeDetails?.bankDetails
            }
            userId={userId}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <SuccessModal
            onClose={handleSuccessModalClose}
            setActiveStep={setActiveStep}
            fetchEmployee={fetchEmployee}
          />
        );
    }
  };

  useEffect(() => {
    setMode(!userId ? "create" : "update");
    if (userId) {
      fetchEmployeeById(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (isBack) {
      setMode("update");
    }
  }, [isBack]);

  useEffect(() => {
    if (employeeDetails?.employeeDetails) {
      const newCompletedSteps = {};

      if (employeeDetails?.employeeDetails?.personalDetails) newCompletedSteps[0] = true;
      if (employeeDetails?.employeeDetails?.teamAndSkillDetails) newCompletedSteps[1] = true;
      if (employeeDetails?.employeeDetails?.settingDetails) newCompletedSteps[2] = true;
      if (employeeDetails?.employeeDetails?.bankDetails) newCompletedSteps[3] = true;

      setCompletedSteps(newCompletedSteps);
    }
  }, [employeeDetails]);

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
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
              {steps.map((label, index) => (
                <Step key={label} completed={!!completedSteps[index]}>
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