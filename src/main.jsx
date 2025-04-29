import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    < CssBaseline />
    <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
