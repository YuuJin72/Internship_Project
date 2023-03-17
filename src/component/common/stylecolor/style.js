import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      blue: {
        main: '#51cf66',
        contrastText: '#fff',
      },
      darkblue: {
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