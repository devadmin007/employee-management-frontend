import React, { useEffect } from "react";
import { Box, Stack, Grid, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonInput from "../CommonInput";

const schema = yup.object().shape({
  bankDetails: yup.object().shape({
    accountNumber: yup.string().required("Account Number is required"),
    ifscCode: yup.string().required("IFSC Code is required"),
    branchName: yup.string().required("Branch Name is required"),
  }),
});

const BankDetailsTab = ({
  onBack,
  onSubmit,
  defaultValues = {},
  userId = null,
  isLoading,
}) => {
  // const getDefaultValues = () => ({
  //   bankDetails: {
  //     accountNumber: userId ? (defaultValues?.bankDetails?.accountNumber || "") : "",
  //     ifscCode: userId ? (defaultValues?.bankDetails?.ifscCode || "") : "",
  //     branchName: userId ? (defaultValues?.bankDetails?.branchName || "") : "",
  //     accountHolderName: userId ? (defaultValues?.bankDetails?.accountHolderName || "") : "",
  //     bankName: userId ? (defaultValues?.bankDetails?.bankName || "") : "",
  //   }
  // });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: getDefaultValues(),
    // mode: "onChange",
    defaultValues: defaultValues || {
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        accountHolderName: "",
        bankName: "",
      },
    },
  });

  const handleFormSubmit = (data) => {
    if (onSubmit) {
      const formData = new FormData();
      formData.append("step", "4");

      Object.entries(data.bankDetails).forEach(([key, value]) => {
        formData.append(`bankDetails[${key}]`, value);
      });

      onSubmit(formData);
    }
  };

  // useEffect(() => {
  //   if (userId && defaultValues) {
  //     reset(getDefaultValues());
  //   }
  // }, [userId, defaultValues])

  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="bankDetails.accountNumber"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Account Number"
                    variant="outlined"
                    error={!!errors.bankDetails?.accountNumber}
                    helperText={errors.bankDetails?.accountNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="bankDetails.ifscCode"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="IFSC Code"
                    variant="outlined"
                    error={!!errors.bankDetails?.ifscCode}
                    helperText={errors.bankDetails?.ifscCode?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Controller
                name="bankDetails.branchName"
                control={control}
                render={({ field }) => (
                  <CommonInput
                    {...field}
                    fullWidth
                    label="Branch Name"
                    variant="outlined"
                    error={!!errors.bankDetails?.branchName}
                    helperText={errors.bankDetails?.branchName?.message}
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
                "Submit"
              )}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default BankDetailsTab;