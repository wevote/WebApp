import { createTheme } from '@mui/material/styles';
import muiStyleOverrides from '../../../components/Style/muiStyleOverrides';


const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#2E3C5D', // brandBlue
    },
    secondary: {
      main: '#ffffff',
      dark: '#f7f7f7',
      contrastText: '#2e3c5d',
    }, // Feel free to change this
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 960,
      xl: 1280,
    },
  },
  components: muiStyleOverrides,
  typography: {
    useNextVariants: true,
  },
  colors: {
    grayPale: '#f8f8f8',
    grayLighter: '#eee',
    grayLighter2: '#e7e7e7',
    grayBorder: '#ddd',
    grayChip: '#dee2eb',
    grayLight: '#ccc',
    grayMid: '#999',
    grayDark: '#555',
    grayDarker: '#333',
    linkHoverBorder: '#3771c8',
    opposeRedRgb: 'rgb(255, 73, 34)',
    supportGreenRgb: 'rgb(31, 192, 111)',
    brandBlue: '#2e3c5d',
  },
});

export default muiTheme;
