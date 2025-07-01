"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { loginApi } from "@/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/slice/authSlice";
import { Stack, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = yup.object().shape({
  email: yup.string().required("Required"),
  password: yup.string().required("Required"),
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
  boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  borderRadius: "10px",
  backgroundColor: "white",
  width: "90%",
  maxWidth: "400px",
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

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginApi(data);
      if (response?.data?.status == "success") {
        dispatch(setUserData(response?.data?.data));
        login(response?.data?.data);
        router.push("/employee");
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
          Login
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
          Welcome user, please login to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ my: 3 }}>
            <Box sx={{ mt: 1, width: "100%" }}>
              <Typography variant="subtitle1">Email</Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    placeholder="Enter Email"
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Stack
              direction={"row"}
              spacing={1}
              mt={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography>Don't have account?</Typography>
              <Typography
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => router.push("/signup")}
              >
                Signup
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              disabled={isLoading}
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </SignupContainer>
    </SignupMainContainer>
  );
};

export default Login;
