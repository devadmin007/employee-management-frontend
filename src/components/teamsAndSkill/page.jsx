import React, { useEffect, useState } from "react";
import { MenuItem, Box, Stack, Grid, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../CommonInput";
import {
  fetchAllDepartments,
  fetchAllDesignation,
  fetchAllEmployeeDetails,
  fetchAllSkills,
  fetchAllTeams,
} from "@/api";
import teamsAndSkillSchema from "@/schemas/teamsAndSkillSchema";

const TeamsAndSkillTab = ({
  onBack,
  onSubmit,
  userId = null,
  defaultValues = {},
  isLoading,
}) => {
  const [managerList, setMangerList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [skillList, setSkillList] = useState([]);

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(teamsAndSkillSchema),
    defaultValues: {
      managerId: defaultValues?.managerId || "",
      designationId: defaultValues?.designationId || "",
      teamId: defaultValues?.teamId || "",
      department: defaultValues?.department || "",
      primarySkills: defaultValues?.primarySkills || [],
      secondarySkills: defaultValues?.secondarySkills ||[],
    },
  });

  const handleStep2Submit = (data) => {

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "primarySkills" || key === "secondarySkills") {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          data[key].forEach((value) => {
            formData.append(`${key}[]`, value);
          });
        }
      } else if (
        data[key] !== null &&
        data[key] !== undefined &&
        data[key] !== ""
      ) {
        formData.append(key, data[key]);
      }
    });

    formData.append("step", 2);

    console.log("FormData entries:", Object.fromEntries(formData));

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleFetchManager = async () => {
    try {
      const params = {
        pagination: false,
      };
      const response = await fetchAllEmployeeDetails({ params });
      if (response?.data?.data?.user) {
        setMangerList(response.data.data.user);
      }
    } catch (e) {
      console.log("Error fetching managers:", e);
    }
  };

  const handleFetchDesignation = async () => {
    try {
      const params = {
        pagination: false,
      };
      const response = await fetchAllDesignation({ params });
      if (response?.data?.data?.designations) {
        setDesignationList(response.data.data.designations);
      }
    } catch (e) {
      console.log("Error fetching designations:", e);
    }
  };

  const handleFetchDepartment = async () => {
    try {
      const params = {
        pagination: false,
      };
      const response = await fetchAllDepartments({ params });
      if (response?.data?.data?.departments) {
        setDepartmentList(response.data.data.departments);
      }
    } catch (e) {
      console.log("Error fetching departments:", e);
    }
  };

  const handleFetchSkills = async () => {
    try {
      const params = {
        pagination: false,
      };
      const response = await fetchAllSkills({ params });
      if (response?.data?.data?.skill) {
        setSkillList(response.data.data.skill);
      }
    } catch (e) {
      console.log("Error fetching skills:", e);
    }
  };

  const handleFetchTeams = async () => {
    try {
      const params = {
        pagination: false,
      };
      const response = await fetchAllTeams({ params });
      if (response?.data?.data?.team) {
        setTeamList(response.data.data.team);
      }
    } catch (e) {
      console.log("Error fetching teams:", e);
    }
  };

  useEffect(() => {
    if (userId && defaultValues) {
      setValue("managerId", defaultValues?.managerId || ""),
        setValue("designationId", defaultValues?.designationId || ""),
        setValue("teamId", defaultValues?.teamId || ""),
        setValue("department", defaultValues?.department || ""),
        setValue("primarySkills", defaultValues?.primarySkills || []),
        setValue("secondarySkills", defaultValues?.secondarySkills || [])
    }
  }, [userId, defaultValues]);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        handleFetchManager(),
        handleFetchDesignation(),
        handleFetchDepartment(),
        handleFetchSkills(),
        handleFetchTeams(),
      ]);
    };

    fetchAllData();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "900px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 2,
        boxShadow: 2,
        height: "100%",
      }}
    >
      <form onSubmit={handleSubmit(handleStep2Submit)}>
        <Stack spacing={2}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="managerId"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Manager"
                    variant="outlined"
                    error={!!errors.managerId}
                    helperText={errors.managerId?.message}
                  >
                    {managerList?.length > 0 &&
                      managerList.map((option) => (
                        <MenuItem key={option?._id} value={option?._id}>
                          {option.fullName}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="designationId"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Designation"
                    variant="outlined"
                    error={!!errors.designationId}
                    helperText={errors.designationId?.message}
                  >

                    {designationList?.length > 0 &&
                      designationList.map((option) => (
                        <MenuItem key={option?._id} value={option?._id}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="teamId"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Team Name"
                    variant="outlined"
                    error={!!errors.teamId}
                    helperText={errors.teamId?.message}
                  >
                    {teamList?.length > 0 &&
                      teamList.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Department"
                    variant="outlined"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  >
                    {departmentList?.length > 0 &&
                      departmentList.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="primarySkills"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Primary Skills"
                    variant="outlined"
                    error={!!errors.primarySkills}
                    helperText={errors.primarySkills?.message}
                    SelectProps={{
                      multiple: true,
                      value: field.value || [],
                      onChange: (e) => {
                        const value =
                          typeof e.target.value === "string"
                            ? e.target.value.split(",")
                            : e.target.value;
                        field.onChange(value);
                      },
                    }}
                  >
                    {skillList?.length > 0 &&
                      skillList.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="secondarySkills"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    select
                    fullWidth
                    label="Secondary Skills"
                    variant="outlined"
                    error={!!errors.secondarySkills}
                    helperText={errors.secondarySkills?.message}
                    SelectProps={{
                      multiple: true,
                      value: field.value || [],
                      onChange: (e) => {
                        const value =
                          typeof e.target.value === "string"
                            ? e.target.value.split(",")
                            : e.target.value;
                        field.onChange(value);
                      },
                    }}
                  >
                    {skillList?.length > 0 &&
                      skillList.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </CommonInput>
                )}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 2,
              py: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={isLoading}
              sx={{
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Next"
              )}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default TeamsAndSkillTab;