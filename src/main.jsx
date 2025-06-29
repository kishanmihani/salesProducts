import { Fragment } from 'react';
import { React } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from "./store.js"
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Fragment>
    {/* <Provider store={store}> */}
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    < CssBaseline />
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
    </ThemeProvider>
    {/* </Provider>  */}
  
  </Fragment>,
)
