const overrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: '16px',
        textTransform: 'unset',
        userSelect: 'none',
        '@media print': {
          color: '#fff',
        },
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
        outline: 'none !important',
        textTransform: 'unset',
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
