const overrides = {
  MuiButton: {
    root: {
      fontSize: '16px',
      textTransform: 'unset',
      userSelect: 'none',
      '@media print': {
        color: '#fff',
      },
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
    root: {
      padding: 0,
      flexDirection: 'unset',
    },
  },
  MuiToolbar: {
    root: {
      padding: 0,
      flexDirection: 'unset',
    },
    regular: {
      minHeight: '48px !important',
    },
  },
  MuiTab: {
    root: {
      outline: 'none !important',
      textTransform: 'unset',
    },
  },
  MuiBottomNavigationAction: {
    root: {
      minWidth: '60px',
    },
  },
};

export default overrides;
