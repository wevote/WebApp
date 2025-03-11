import React, { useState, Suspense } from 'react';
import { AppBar, Tab, Tabs, Toolbar, useMediaQuery } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import { InfoOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import { endsWith } from '../../utils/startsWith';
import stringContains from '../../utils/stringContains';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import DesignTokenColors from '../Style/DesignTokenColors';

// Lazy-load the PointsExplanationModal
const PointsExplanationModal = React.lazy(() => import('../Challenge/PointsExplanationModal'));

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'Poppins, sans-serif', // Set font family for the theme
  },
  components: {
    MuiButtonBase: {
      root: {
        '&:hover': {
          color: '#4371cc',
        },
      },
    },
  },
});

const ChallengeInviteFriendsTopNavigation = ({ challengeSEOFriendlyPath, challengeWeVoteId, classes, hideAboutTab }) => {
  const [value, setValue] = React.useState(0);
  const [voterIsChallengeParticipant, setVoterIsChallengeParticipant] = React.useState(false);
  // console.log('ChallengeInviteFriendsTopNavigation challengeWeVoteId:', challengeWeVoteId, ', voterIsChallengeParticipant:', voterIsChallengeParticipant);

  // State to handle modal visibility and hover effect
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const history = useHistory();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Functions to toggle modal and handle hover
  const toggleMoreInfoModal = React.useCallback(() => {
    setIsMoreInfoOpen((prev) => !prev);
  }, []);

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
            <ToolbarStyled disableGutters
              className={classes.toolbarRoot}
              component={Toolbar}
            >
              <TabsStyled value={value} onChange={handleChange} aria-label="Tab menu">
                {!hideAboutTab && <TabStyled id="challengeLandingTab-0" label="About" onClick={() => history.push(aboutUrl)} value={1} isSmallScreen={isSmallScreen} />}
                <TabStyled id="challengeLandingTab-1" label="Leaderboard" onClick={() => history.push(leaderboardUrl)} value={2} isSmallScreen={isSmallScreen} />
                {voterIsChallengeParticipant && <TabStyled id="challengeLandingTab-2" label={isSmallScreen ? 'Invited' : 'Invited friends'} onClick={() => history.push(friendsUrl)} value={3} />}
              </TabsStyled>
              <MoreInfoIconWrapper
                hovered={hovered}
                isSmallScreen={isSmallScreen}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setIsMoreInfoOpen(!isMoreInfoOpen)}
              >
                <InfoOutlined />
                {!isSmallScreen && <MoreInfoText>More info</MoreInfoText>}
              </MoreInfoIconWrapper>
            </ToolbarStyled>
          </ThemeProvider>
        </StyledEngineProvider>
      </AppBar>
      {isMoreInfoOpen && ( // Conditional rendering for modal
        <Suspense fallback={<div>Loading...</div>}>
          <PointsExplanationModal show={isMoreInfoOpen} toggleModal={toggleMoreInfoModal} />
        </Suspense>
      )}
    </div>
  );
};
ChallengeInviteFriendsTopNavigation.propTypes = {
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  hideAboutTab: PropTypes.bool,
};

const styles = () => ({
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
});

const MoreInfoIconWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hovered', 'isSmallScreen'].includes(prop),
})(({ hovered, isSmallScreen }) => ({
  alignItems: 'center',
  color: hovered ? DesignTokenColors.primary500 : DesignTokenColors.neutral600,
  cursor: 'pointer',
  display: 'flex',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.25,
  position: 'absolute',
  right: isSmallScreen ? '12px' : '16px',
}));

const MoreInfoText = styled('span')({
  marginLeft: 4,
});

const TabsStyled = styled(Tabs)({
  flexGrow: 1,
});

const TabStyled = styled(Tab)(() => ({
  marginRight: 16,
  minWidth: 'auto',
  padding: '12px 16px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '0',
    padding: '12px 10px',
  },
  '&:last-child': {
    marginRight: 0,
  },
}));

const ToolbarStyled = styled(Toolbar)(() => ({
  alignItems: 'center',
  display: 'flex',
  minHeight: 48,
  position: 'relative',
  width: '100%',
}));

export default withStyles(styles)(ChallengeInviteFriendsTopNavigation);
