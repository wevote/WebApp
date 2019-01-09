import amber from '@material-ui/core/colors/amber';
import { createMuiTheme } from '@material-ui/core/styles';

const overrides = {
  MuiButton: {
    root: {
      // Button global overrides here
    },
  },
  MuiPaper: {
    root: {
      padding: '5px',
    },
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#25536D",
    },
    secondary: amber, // Feel free to change this
  },
  overrides,
  typography: {
    useNextVariants: true,
  },
});

export default theme;
