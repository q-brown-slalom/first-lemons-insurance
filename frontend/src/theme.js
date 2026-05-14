import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a5276',
      light: '#2471a3',
      dark: '#154360',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#28b463',
      light: '#52c77a',
      dark: '#1e8449',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
})

export default theme
