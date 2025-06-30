import React, { useEffect } from "react";
import { Box, Stack, Grid, Button, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../CommonInput";
import bankSchema from "@/schemas/bankSchema";
import { bankInfo } from "@/utils/helper";

const BankDetailsTab = ({
  onBack,
  onSubmit,
  defaultValues = {},
  userId = null,
  isLoading,
}) => {

  const bankInfoDetails = bankInfo(defaultValues?.bankDetails);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankSchema),
    defaultValues: {
      bankDetails: {
        accountNumber: bankInfoDetails?.accountNumber || "",
        ifscCode: bankInfoDetails?.ifscCode || "",
        branchName: bankInfoDetails?.branchName || "",
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

  useEffect(() => {
    if (userId && defaultValues) {
      setValue("bankDetails.accountNumber", defaultValues?.accountNumber || "")
      setValue("bankDetails.ifscCode", defaultValues?.ifscCode || "")
      setValue("bankDetails.branchName", defaultValues?.branchName || "")
    }
  }, [userId, defaultValues])

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