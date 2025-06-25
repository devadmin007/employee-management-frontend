import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonInput from "../CommonInput";

// Validation schema using Yup
const schema = yup.object().shape({
  managerId: yup.string().required("Manager is required"),
  designationId: yup.string().required("Designation is required"),
  teamId: yup.string().required("Team Name is required"),
  department: yup.string().required("Department is required"),
  primarySkills: yup.string().required("Primary Skills are required"),
  secondarySkills: yup.string().required("Secondary Skills are required"),
});

const managerOtions = [
  { value: "manager a", label: "Manager A" },
  { value: "manager b", label: "Manager B" },
];

const designationOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
];

const teamOptions = [
  { value: "team alpha", label: "Team Alpha" },
  { value: "team beta", label: "Team Beta" },
];

const TeamsAndSkillTab = ({ onBack, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
  });

  const handleStep2Submit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
     
        formData.append(key, data[key]);

    });
    formData.append("step", 2);

    console.log("Form data:", Object.fromEntries(formData));
    if (onSubmit) {
      onSubmit(formData);
    }
  };

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
                    {managerOtions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
                    {designationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
                    {teamOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
                    fullWidth
                    label="Department"
                    variant="outlined"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <Controller
                name="primarySkills"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Primary Skills"
                    variant="outlined"
                    error={!!errors.primarySkills}
                    helperText={errors.primarySkills?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <Controller
                name="secondarySkills"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Secondary Skills"
                    variant="outlined"
                    error={!!errors.secondarySkills}
                    helperText={errors.secondarySkills?.message}
                  />
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
            <Button variant="outlined" onClick={onBack}>Back</Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
              }}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default TeamsAndSkillTab;
