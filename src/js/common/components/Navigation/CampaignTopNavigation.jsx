import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { renderLog } from '../../utils/logging';
import startsWith, { endsWith } from '../../utils/startsWith';


// TODO: Mar 23, 2022, makeStyles is legacy in MUI 5, replace instance with styled-components or sx if there are issues
const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    borderBottom: 0,
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      borderBottom: '1px solid #ddd',
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  // toolbarRoot: {
  //   minHeight: 0,
  // },
}));


export default function CampaignTopNavigation (incomingVariables) {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const history = useHistory();

  const defaultTheme = createTheme();

  const theme = createTheme({
    typography: {
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiButtonBase: {
        root: {
          '&:hover': {
            color: '#4371cc',
          },
        },
      },
      MuiTab: {
        root: {
          minWidth: 0,
          [defaultTheme.breakpoints.up('xs')]: {
            minWidth: 0,
          },
        },
      },
    },
  });

  const { campaignSEOFriendlyPath, campaignXWeVoteId } = incomingVariables;
  // console.log('CampaignTopNavigation incomingVariables:', incomingVariables);
  // console.log('CampaignTopNavigation campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { location: { pathname } } = window;
  if (endsWith('/comments', pathname) && value !== 1) {
    // console.log('Render CampaignTopNavigation, initial value set to 1');
    setValue(1);
  } else if (endsWith('/updates', pathname) && value !== 2) {
    // console.log('Render CampaignTopNavigation, initial value set to 2');
    setValue(2);
  } else if ((startsWith('/c/', pathname) || startsWith('/id/', pathname)) && value !== 0 && value !== 1 && value !== 2) {
    // console.log('Render CampaignTopNavigation, initial value set to 0');
    setValue(0);
  }

  let detailsUrl;
  let commentsUrl;
  let updatesUrl;
  if (campaignSEOFriendlyPath) {
    detailsUrl = `/c/${campaignSEOFriendlyPath}`;
    commentsUrl = `/c/${campaignSEOFriendlyPath}/comments`;
    updatesUrl = `/c/${campaignSEOFriendlyPath}/updates`;
  } else {
    detailsUrl = `/id/${campaignXWeVoteId}`;
    commentsUrl = `/id/${campaignXWeVoteId}/comments`;
    updatesUrl = `/id/${campaignXWeVoteId}/updates`;
  }

  renderLog('CampaignTopNavigation functional component');
  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        color="default"
        className={classes.appBarRoot}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Toolbar disableGutters/* className={classes.toolbarRoot} */>
              <Tabs value={value} onChange={handleChange} aria-label="Tab menu">
                <Tab id="weTarget-0" label="Campaign details" onClick={() => history.push(detailsUrl)} />
                <Tab id="weTarget-1" label="Comments" onClick={() => history.push(commentsUrl)} />
                <Tab id="weTarget-2" label="Updates" onClick={() => history.push(updatesUrl)} />
              </Tabs>
            </Toolbar>
          </ThemeProvider>
        </StyledEngineProvider>
      </AppBar>
    </div>
  );
}
