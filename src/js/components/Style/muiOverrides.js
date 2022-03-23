const overrides = {
  MuiButton: {
    styleOverrides: {
      root: {
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
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '14px',
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
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: '60px',
      },
    },
  },
};

export default overrides;
