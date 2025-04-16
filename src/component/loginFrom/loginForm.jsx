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
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { authAxios } from '../utils/authAxios';
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
      user_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      user_name: Yup.string()
        // .email('Enter a valid email')
        .required('Username is required'),
      password: Yup.string()
        // .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      const userData={"password":values?.password,"user_name":values?.user_name}
      sendresponse(userData)
      console.log(userData)
    },
  });

  const sendresponse =  async  (values) => {
    try {
      await authAxios.post('/BituRep/Api/Account/Login', 
      {
          user_name: values?.user_name,
          password: values?.password,
        },
      ).then(response => {
        let message=response?.data?.message;
        if(message === "login successfull"){
          datanotInvalid(response?.data)
        }
        else if(message === "invalid password"){
          Invalid_alert(message)
        }
        else if(message === "invalid user name"){
          Invalid_alert(message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Invalid_alert("some think went wrong")
      });
    } catch (error) {
      console.error('Error:', error);
      Invalid_alert("some think went wrong")
    }
  
  };
  function Invalid_alert(data){
    toast.warn(data, {
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
  function Success_alert(data){
    toast.success(data?.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }
  const  datanotInvalid =(data)=>{
    Success_alert(data)
    console.log(data)
    localStorage.setItem("userInfo", JSON.stringify({
      login: data.login,
      id: data.id,
      pageView: data.pageView
    }));
    // navigate('/dashboard');
  }
  return (<Paper elevation={5}
       sx={{ p: 5, width: 320,borderRadius:3}}>
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
            label="User name"
            name="user_name"
            margin="normal"
            size="small"
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
      
  );
};

export default LoginForm;
