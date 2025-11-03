import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/sale.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import api from "../../component/Config/Api"; // ✅ using your common api.js
import { loginApi } from "../../component/Config/Api/Api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const UserInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (UserInfo?.message === "login successfull") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoader(true);
      await sendResponse(values);
      setLoader(false);
    },
  });

  // ✅ Login API
  const sendResponse = async (values) => {
    try {
      const response = await api.post(loginApi, {
        user_name: values.user_name,
        password: values.password,
      });

      const { message } = response.data;

      if (message === "login successfull") {
        saveUserInfo(response.data);
        toast.success("Login Successful!", { position: "top-right" });
        navigate("/dashboard");
      } else {
        toast.warn(message, { position: "top-left" });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong",
        { position: "top-left" }
      );
    }
  };

  // ✅ Save user session
  const saveUserInfo = (data) => {
    sessionStorage.setItem(
      "userInfo",
      JSON.stringify({
        login: data.login,
        message: data.message,
        id: data.id,
        pageView: data.pageView,
      })
    );
  };

  return (
    <Paper elevation={5} sx={{ p: 5, width: 320, borderRadius: 3 }}>
      <ToastContainer />
      <Typography align="center">
        <img src={logo} alt="logo" style={{ width: "140px", height: "75px" }} />
      </Typography>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "600", fontFamily: "sans-serif" }}
      >
        Login
      </Typography>
      <Typography sx={{ fontWeight: "400", color: "GrayText", fontSize: 14 }}>
        Enter your details below.
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="User name"
          name="user_name"
          margin="normal"
          size="small"
          className="userFeild"
          value={formik.values.user_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_name && Boolean(formik.errors.user_name)}
          helperText={formik.touched.user_name && formik.errors.user_name}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          size="small"
          margin="normal"
          className="userFeild"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loader}
          sx={{
            mt: 3,
            fontSize: 17,
            fontWeight: "600",
            fontFamily: "sans-serif",
            textTransform: "capitalize",
          }}
        >
          {loader ? 'Loading...' : "Login"}
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;
