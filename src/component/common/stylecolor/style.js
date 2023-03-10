import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      green: {
        main: '#51cf66',
        contrastText: '#fff',
      },
      darkgreen: {
        main: '#2f9e44',
        contrastText: '#fff',
      },
      red: {
        main: '#f03e3e',
        contrastText: '#fff',
      },
    },
  });

  export default theme