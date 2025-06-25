"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { getAllRoles, signUpApi } from "@/api";
import { MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const signupSchema = yup.object().shape({
  username: yup.string().required("Required"),
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  password: yup.string().required("Required"),
  role: yup.string().required("Required"),
});

const SignupMainContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  padding: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const SignupContainer = styled(Box)(({ theme }) => ({
  padding: "30px",
  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  borderRadius: "10px",
  backgroundColor: "white",
  width: "90%",
  maxWidth: "700px",
  [theme.breakpoints.up("sm")]: {
    width: "80%",
  },
  [theme.breakpoints.up("md")]: {
    width: "60%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "30%",
  },
}));

const roles = ["HR", "EMPLOYEE", "ADMIN", "PROJECT_MANAGER"];

const SignUP = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "",
    },
    resolver: yupResolver(signupSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roleOption, setRoleOption] = useState([]);

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    try {
      const response = await getAllRoles();
      let tempArr = [];
      response?.data?.data?.roles.forEach((ele, index) => {
        tempArr.push({
          label: ele.role,
          value: ele._id,
        });
      });
      setRoleOption(tempArr);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("error");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await signUpApi(data);
      if (response?.data?.status === "success") {
        toast.success(response?.data.message);
        router.push("/login");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupMainContainer>
      <SignupContainer>
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "center",
            fontSize: {
              xs: "24px",
              sm: "28px",
              md: "32px",
            },
          }}
        >
          SignUp
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 200,
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "16px",
            },
            textAlign: "center",
          }}
        >
          Welcome user, please sign up to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ my: 3 }}>
            <Box sx={{ mt: 1, width: "100%" }}>
              <Typography variant="subtitle1">Username</Typography>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    placeholder="Enter User Name"
                    fullWidth
                    autoComplete="off"
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                  />
                )}
              />

              {/* First Name and Last Name side by side */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">First Name</Typography>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        placeholder="Enter First Name"
                        fullWidth
                        autoComplete="off"
                        error={Boolean(errors.firstName)}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">Last Name</Typography>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        placeholder="Enter Last Name"
                        fullWidth
                        autoComplete="off"
                        error={Boolean(errors.lastName)}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Role
              </Typography>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select fullWidth {...field} error={Boolean(errors.role)}>
                    {roleOption.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.role?.message && (
                <Typography color="error" variant="caption">
                  {errors.role.message}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              loading={isLoading}
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                height: "45px",
                fontSize: {
                  xs: 14,
                  sm: 16,
                  md: 18,
                },
                background:
                  "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
                textTransform: "none",
              }}
            >
              sign up
            </Button>
          </Box>
        </form>
      </SignupContainer>
    </SignupMainContainer>
  );
};

export default SignUP;
