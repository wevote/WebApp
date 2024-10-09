import { AppBar, Tab, Tabs, Toolbar } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { renderLog } from '../../utils/logging';
import { endsWith } from '../../utils/startsWith';
import stringContains from '../../utils/stringContains';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';


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
  toolbarRoot: {
    minHeight: 48,
  },
}));


export default function ChallengeInviteFriendsTopNavigation ({ challengeSEOFriendlyPath, challengeWeVoteId, hideAboutTab }) {
  const [value, setValue] = React.useState(0);
  const [voterIsChallengeParticipant, setVoterIsChallengeParticipant] = React.useState(false);
  // console.log('ChallengeInviteFriendsTopNavigation challengeWeVoteId:', challengeWeVoteId, ', voterIsChallengeParticipant:', voterIsChallengeParticipant);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { location: { pathname } } = window;
  if (endsWith('/about', pathname)) {
    if (value !== 1) {
      // console.log('Render ChallengeInviteFriendsTopNavigation, initial value set to 1');
      setValue(1);
    }
  } else if (endsWith('/leaderboard', pathname)) {
    if (value !== 2) {
      // console.log('Render ChallengeInviteFriendsTopNavigation, initial value set to 2');
      setValue(2);
    }
  } else if (endsWith('/friends', pathname)) {
    if (value !== 3) {
      // console.log('Render ChallengeInviteFriendsTopNavigation, initial value set to 3');
      setValue(3);
    }
  } else if (stringContains('/+/', pathname)) {
    // console.log('Render ChallengeInviteFriendsTopNavigation, initial value set to 0');
    if (hideAboutTab) {
      if (value !== 2) {
        setValue(2);
      }
    } else if (value !== 1) {
      setValue(1);
    }
  }

  let aboutUrl;
  let leaderboardUrl;
  let friendsUrl;
  if (challengeSEOFriendlyPath) {
    aboutUrl = `/${challengeSEOFriendlyPath}/+/`;
    leaderboardUrl = `/${challengeSEOFriendlyPath}/+/leaderboard`;
    friendsUrl = `/${challengeSEOFriendlyPath}/+/friends`;
  } else {
    aboutUrl = `/+/${challengeWeVoteId}`;
    leaderboardUrl = `/+/${challengeWeVoteId}/leaderboard`;
    friendsUrl = `/+/${challengeWeVoteId}/friends`;
  }

  // console.log('ChallengeInviteFriendsTopNavigation, aboutUrl:', aboutUrl);
  // console.log('ChallengeInviteFriendsTopNavigation, leaderboardUrl:', leaderboardUrl);
  // console.log('ChallengeInviteFriendsTopNavigation, friendsUrl:', friendsUrl);

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);

    const onChallengeParticipantStoreChange = () => {
      setVoterIsChallengeParticipant(ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId));
    };

    const onChallengeStoreChange = () => {
      setVoterIsChallengeParticipant(ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId));
    };

    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  renderLog('ChallengeInviteFriendsTopNavigation functional component');
  return (
    <div className={classes.root}>
      <AppBar
        position="relative"
        color="default"
        className={classes.appBarRoot}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Toolbar disableGutters className={classes.toolbarRoot}>
              <Tabs value={value} onChange={handleChange} aria-label="Tab menu">
                {!hideAboutTab && <Tab id="challengeLandingTab-0" label="About" onClick={() => history.push(aboutUrl)} value={1} />}
                <Tab id="challengeLandingTab-1" label="Leaderboard" onClick={() => history.push(leaderboardUrl)} value={2} />
                {voterIsChallengeParticipant && <Tab id="challengeLandingTab-2" label="Invited friends" onClick={() => history.push(friendsUrl)} value={3} />}
              </Tabs>
            </Toolbar>
          </ThemeProvider>
        </StyledEngineProvider>
      </AppBar>
    </div>
  );
}
ChallengeInviteFriendsTopNavigation.propTypes = {
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  hideAboutTab: PropTypes.bool,
};
