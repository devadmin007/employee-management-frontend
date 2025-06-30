import React, { useEffect } from "react";
import { Box, Stack, Grid, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../CommonInput";
import settingSchema from "@/schemas/setttingSchema";

const SettingTab = ({
  onBack,
  onSubmit,
  defaultValues = {},
  userId = null,
  isLoading,
}) => {

  const {
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(settingSchema),
    defaultValues: {
      joiningDate: defaultValues?.joiningDate || "",
      probationDate: defaultValues?.probationDate || "",
      panNo: defaultValues?.panNo || "",
      pfNo: defaultValues?.pfNo || "",
      uanDetail: defaultValues?.uanDetail || "",
      previousExperience: defaultValues?.previousExperience || "",
    },
  });

  const handleFormSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("step", 3);

    console.log("Form data:", Object.fromEntries(formData));
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    if (userId && defaultValues) {
      setValue("joiningDate", defaultValues?.joiningDate || "-"),
        setValue("probationDate", defaultValues?.probationDate || "-"),
        setValue("panNo", defaultValues?.panNo || "-"),
        setValue("pfNo", defaultValues?.pfNo || "-"),
        setValue("uanDetail", defaultValues?.uanDetail || "-"),
        setValue("previousExperience", defaultValues?.previousExperience || "-")
    }
  }, [userId, defaultValues])

  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        padding: 4,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Joining Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.joiningDate}
                    helperText={errors.joiningDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="probationDate"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Probation Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.probationDate}
                    helperText={errors.probationDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="panNo"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Pan Number"
                    variant="outlined"
                    error={!!errors.panNo}
                    helperText={errors.panNo?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="relieivingDate"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Relieving Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.relieivingDate}
                    helperText={errors.relieivingDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="pfNo"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="PF Number"
                    variant="outlined"
                    error={!!errors.pfNo}
                    helperText={errors.pfNo?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="uanDetail"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="UAN Details"
                    variant="outlined"
                    error={!!errors.uanDetail}
                    helperText={errors.uanDetail?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="previousExperience"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Previous Experience (Yrs)"
                    variant="outlined"
                    error={!!errors.previousExperience}
                    helperText={errors.previousExperience?.message}
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

export default SettingTab;
