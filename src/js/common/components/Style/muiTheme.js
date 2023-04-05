import { createTheme } from '@mui/material/styles';
import muiStyleOverrides from '../../../components/Style/muiStyleOverrides';

// secondary color options
// 'rgba(9, 51, 206, 0.6)', Bright blue with lower opacity
// #2D68C4 = True Blue: https://cssgradient.io/shades-of-blue/
// #1da1f2 = Twitter Blue <- Good blue
// #FEBE10 = Real Madrid Gold
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#0834CD', // brandBlue #2E3C5D
    },
    secondary: {
      main: '#FEBE10',
      dark: '#e9ab01',
      contrastText: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 320,        // Matches nothing on a breakpoints.dn('xs'), the number would have to be 321 to match a iPhone SE (320px wide), or an original iPhone 320px
      sm: 576,        // Matches almost all phones (iPhone 13 mini is 360, iPhone 13 is 390, iPhone 13 Max Pro is 428, Galaxy S22 Ultra 480, etc.)
      md: 768,        // Matches iPad Mini at 768px (right on the edge, so maybe not)
      lg: 960,        // Matches medium iPads: iPad 9.7" is 768, iPad 10.2 is 810, iPad Air 10.9 is 820, iPad (pro) 11" and Air 10.5  is 834
      xl: 1280,       // Matches iPad Pro 12.9" at 1024
      tabMin: 740,    // Tablet minimum Size
      tabMdMin: 770,  // Medium Tablet minimum Size  (iPad 9.6" is a weird edge case at 768px wide, it is rare, don't worry about it if it is a bit off)
      tabLgMin: 840,  // Large Tablet minimum Size
      tabMax: 1110,   // Large Tablet maximum Size, anything larger is a desktop, Galaxy Tab S8+  is 1067, Galaxy Z Fold 3 is 1104
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
window.muiThemeGlobal = muiTheme;  // So we can define breakpoints in only one place, and use them outside MUI components

export default muiTheme;
