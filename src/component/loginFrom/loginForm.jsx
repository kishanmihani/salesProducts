import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/sale.jpg'
import { toast, ToastContainer } from 'react-toastify';
// import logoback  from '../../assets/salesback.webp'
// import { authAxios } from '../utils/authAxios';
// import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const UserInfo=[
    {"userName":localStorage.getItem('Username'),"userImg":localStorage.getItem('UserImg')}
  ]
  const CheckUserInfo=UserInfo[0].userImg !== (null) && UserInfo[0].userName !== null  ;
  React.useEffect(() => {
   if(CheckUserInfo){
    navigate('/dashboard') 
   }
   else{
    navigate('')
   }
  },[CheckUserInfo])
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        // .email('Enter a valid email')
        .required('Email is required'),
      password: Yup.string()
        // .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
    //   console.log('Form Submitted:', values);
      const userData={"password":values.password,"email":values.email}
      sendresponse(userData)
      console.log(userData)
    },
  });

  const sendresponse =  async  (values) => {
    try {
      const response = await fetch('api/Api/Account/UserInfo', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
  
      const text = await response.text(); // safer than .json()
      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
      } catch {
        console.log("Response is not JSON:", text);
      }
  
    } catch (error) {
      // Invalid_alert
      console.error('Error:', error);
    }
  
  };
  function Invalid_alert(data){
    toast.warn(data.message, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });;
  }
  function Success_alert(){
    toast.success('Login Success', {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }
  // const  datanotInvalid =(data)=>{
  //   Success_alert()
  //   localStorage.setItem('token', data.token);
  //   localStorage.setItem('refreshToken', data.refreshToken);
  //   localStorage.setItem('FullName', data.firstName + ' ' + data.lastName);
  //   localStorage.setItem('Username', data.username);
  //   localStorage.setItem('email', data.email);
  //   localStorage.setItem('UserId', data.id);
  //   localStorage.setItem('Usergender', data.gender);
  //   localStorage.setItem('UserImg', data.image);
  //   navigate('/dashboard');
  // }
  return (
    //  <Typography variant='div' >
        
      <Paper elevation={5}
    //   style={{display:"flex",flexWrap:"wrap"}} md={{ p: 5, width: 640,borderRadius:3}}
       sx={{ p: 5, width: 320,borderRadius:3}}>
        {/* <img src={logoback} alt=""  sx={{
    display: {
      xs: 'none', // hidden on small screens
      md: 'block',
      height:"100%",width:"100%" // visible as block on md and above
    },
  }} /> */}
        {/* <div  > */}
        <ToastContainer 
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
        ></ToastContainer>
        <Typography align="center">
            <img src={logo} style={{width:"140px",height:"75px"}}/>
        </Typography>
        <Typography variant="h6" gutterBottom align="left" sx={{fontWeight:"600",fontFamily:"sans-serif,"}}>
        Login
        </Typography>
        <Typography variant="label" gutterBottom align="left"  sx={{fontWeight:"400",color:"GrayText"}}>
        Enter your details below.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            size="small"
            margin="normal"
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
            
            sx={{ mt: 3 ,fontSize:17,fontWeight:"600",fontFamily:"sans-serif",textTransform:"capitalize"}}
          >
            Login
          </Button>
        </form>
        {/* </div> */}
      </Paper>
      
    //   </Typography>
    // </Box>
  );
};

export default LoginForm;
