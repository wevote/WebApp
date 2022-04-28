const muiStyleOverrides = {
  MuiAppBar: {
    styleOverrides: {
      colorDefault: {
        backgroundColor: '#fff',
        color: '#333',
      },
      root: {
        padding: 0,
        flexDirection: 'unset',
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: '60px',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: 'unset',
        fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: '16px',
        textTransform: 'none',
        userSelect: 'none',
        '@media print': {
          color: '#fff',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginBottom: '-.5rem',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: '"Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
        outline: 'none !important',
        textTransform: 'none',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        padding: 0,
        flexDirection: 'unset',
      },
      regular: {
        minHeight: '48px !important',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '14px',
      },
    },
  },
};

export default muiStyleOverrides;
