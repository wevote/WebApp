import amber from '@material-ui/core/colors/amber';
import { createMuiTheme } from '@material-ui/core/styles';

const overrides = {
  MuiButton: {
    root: {
      // Button global overrides here
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: '14px',
    },
  },
  MuiFormControlLabel: {
    root: {
      marginBottom: '-.5rem',
    },
  },
  MuiAppBar: {
    colorDefault: {
      backgroundColor: '#fff',
      color: '#333',
    },
  },
  MuiToolbar: {
    regular: {
      minHeight: '48px !important',
    },
  },
  MuiTab: {
    root: {
      outline: 'none !important',
    },
  },
  MuiBottomNavigationAction: {
    root: {
      minWidth: '60px',
    },
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      // main: "#25536D",
      main: '#2E3C5D',
    },
    secondary: amber, // Feel free to change this
  },
  overrides,
  typography: {
    useNextVariants: true,
  },
});

export default theme;
