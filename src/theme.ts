'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A2239',
      light: "#1B5993",
      dark: "#030D16",
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#AFC1D6',
      light: "#DCE7EA",
      dark: "#7D99BA",
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: ['var(--font-lato)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});

export default theme;