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
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
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
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      root: {
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
        outline: 'none !important',
        textTransform: 'none',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        marginBottom: '-.5rem',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
        marginTop: '-6px',
        minHeight: 34,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
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
