import { createTheme } from '@material-ui/core/styles';
import overrides from '../../../components/Style/muiOverrides';

// See also styled-theme.js
// I recommend being cautious about using 'md' for transitions relating explicitly to mobile, tablet, desktop
const breakpoints = {
  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  values: {
    xs: 320,
    sm: 576,
    md: 768,
    lg: 960,
    xl: 1280,
  },
};

const theme = createTheme({
  palette: {
    primary: {
      // main: "#25536D",
      main: '#2E3C5D', // brandBlue
    },
    secondary: {
      main: '#ffffff',
      dark: '#f7f7f7',
      contrastText: '#2e3c5d',
    }, // Feel free to change this
  },
  breakpoints,
  overrides,
  typography: {
    useNextVariants: true,
  },
});

export default theme;
