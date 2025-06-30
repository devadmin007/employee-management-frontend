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
  setFormData = () => { }
}) {

  const dispatch = useDispatch();
  const employeeDetails = useSelector((state) => state.employeeData);

  const [activeStep, setActiveStep] = useState(0);
  const [empId, setEmpId] = useState(null);
  const [isBack, setIsBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [formData, setFormData] = useState({});
  const mode = !userId ? "create" : "update";
  if (activeStep > 3) {
    fetchEmployee();
  }


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setIsBack(true);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

            // setFormData((prev) => ({ ...prev, personalInfo: plainData }));
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
              "settingDetails",
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
      data.append("userId", userId);
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
              "settingDetails",
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
    setFormData((prevData) => ({
      ...prevData,
      [stepKeys[activeStep]]: Object.fromEntries(data.entries()),
    }));
    setActiveStep((prevStep) => prevStep + 1);
  };

  const fetchEmployeeById = async (id) => {
    try {
      const response = await getEmployeeByIdApi(id);
      const data = response?.data?.data;

      const personalDetails = {
        role: data?.role,
        firstName: data?.firstName,
        lastName: data?.lastName,
        image: data?.image,
        phoneNumber: data?.userDetails?.phoneNumber,
        personalNumber: data?.userDetails?.personalNumber,
        // dateOfBirth: moment(data?.userDetails?.joiningDate).format("MM/DD/YYYY") || "",
        dateOfBirth: new Date(data?.userDetails?.joiningDate).toLocaleDateString(),
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
        joiningDate: data?.userDetails?.joiningDate || "",
        probationDate: data?.userDetails?.probationDate || "",
        panNo: data?.userDetails?.panNo || "",
        pfNo: data?.userDetails?.pfNo || "",
        uanDetail: data?.userDetails?.uanDetail || "",
        previousExperience: data?.userDetails?.previousExperience || "",
      };

      const bankDetails = data?.bankDetails || {};

      dispatch(
        addEmployeeDataInfo({
          type: "personalInfo",
          personalDetail: personalDetails,
        })
      );
      dispatch(
        addEmployeeDataInfo({
          type: "teamAndSkillInfo",
          teamAndSkillDetail: teamAndSkillDetails,
        })
      );
      dispatch(
        addEmployeeDataInfo({
          type: "settingInfo",
          settingDetail: settingDetails,
        })
      );
      dispatch(
        addEmployeeDataInfo({
          type: "bankInfo",
          bankDetail: bankDetails,
        })
      );
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
            onClose={onClose}
            setActiveStep={setActiveStep}
            fetchEmployee={fetchEmployee}
          />
        );
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchEmployeeById(userId);
  }, [userId]);

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
