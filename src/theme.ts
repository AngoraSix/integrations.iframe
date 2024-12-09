'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#C6D4D9',
      main: '#A9BEC5',
      dark: '#47626B',
      contrastText: '#fff',
    },
    secondary: {
      light: '#62a8de',
      main: '#3F6E91',
      dark: '#29475e',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: ['var(--font-ruluko)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    fontSize: 14,
    h1: {
      fontFamily: ['var(--font-zcool)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
        ','
      ),
    },
    h2: {
      fontFamily: ['var(--font-zcool)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
        ','
      ),
    },
    h3: {
      fontFamily: ['var(--font-zcool)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
        ','
      ),
    },
  }

});

export default theme;