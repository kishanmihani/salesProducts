import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
