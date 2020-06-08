import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import HelpOutline from '@material-ui/icons/HelpOutline';
import BallotIcon from '@material-ui/icons/Ballot';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import PeopleIcon from '@material-ui/icons/People';
import AppStore from '../../stores/AppStore';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
import { historyPush, isCordova, cordovaOpenSafariView } from '../../utils/cordovaUtils';
import { stringContains } from '../../utils/textFormat';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import VoterStore from '../../stores/VoterStore';
// import Notifications from '@material-ui/icons/Notifications';


function isFriendsTabSelected () {
  const { pathname } = window.location;
  return (stringContains('/friends', pathname.toLowerCase()));
}

class FooterBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: 0, // eslint-disable-line react/no-unused-state
      showingOneCompleteYourProfileModal: false,
      showSignInModal: false,
      // voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppStore.showShareModal();
    const showSharedItemModal = AppStore.showSharedItemModal();
    const showSignInModal = AppStore.showSignInModal();
    const showVoterPlanModal = AppStore.showVoterPlanModal();
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(), // eslint-disable-line react/no-unused-state
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSharedItemModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppStore.showShareModal();
    const showSharedItemModal = AppStore.showSharedItemModal();
    const showSignInModal = AppStore.showSignInModal();
    const showVoterPlanModal = AppStore.showVoterPlanModal();
    this.setState({
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSharedItemModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  onFriendStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('FooterBar, onFriendStoreChange');
      this.setState({
        friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(), // eslint-disable-line react/no-unused-state
      });
    }
  }

  onVoterStoreChange () {
    // const voter = VoterStore.getVoter();
    // const voterIsSignedIn = voter.is_signed_in || false;
    // this.setState({
    //   voterIsSignedIn,
    // });
  }

  handleChange = (event, value) => {
    if (isCordova()) {
      const { impact } = window.TapticEngine;
      impact({
        style: 'heavy', // light | medium | heavy
      });
    }
    switch (value) {
      case 0:
        return historyPush('/ready');
      case 1:
        return historyPush('/ballot');
      case 2:
        return historyPush('/values');
      case 3:
        return historyPush('/friends');
      // case 4:
      //   return historyPush('/news');
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ready', pathname.toLowerCase())) return 0;
    if (stringContains('/ballot', pathname.toLowerCase())) return 1;
    if (stringContains('/value', pathname.toLowerCase())) return 2; // '/values'
    if (stringContains('/friends', pathname.toLowerCase())) return 3;
    if (stringContains('/news', pathname.toLowerCase())) return 4;
    return -1;
  };

  handleNavigation = to => historyPush(to);

  render () {
    renderLog('FooterBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      friendInvitationsSentToMe, showingOneCompleteYourProfileModal, showShareModal, showSharedItemModal, showSignInModal,
      showVoterPlanModal,
    } = this.state;
    const numberOfIncomingFriendRequests = friendInvitationsSentToMe.length || 0;

    const badgeStyle = {
      display: 'inline-block',
    };
    const hideFooterBehindModal = showingOneCompleteYourProfileModal || showShareModal || showSharedItemModal || showSignInModal || showVoterPlanModal;
    return (
      <FooterBarWrapper>
        <div
          className={`footer-container u-show-mobile-tablet ${hideFooterBehindModal ? ' u-z-index-1000' : ' u-z-index-9000'}`}
          style={{ height: `${cordovaFooterHeight()}` }}
        >
          <BottomNavigation
            value={this.getSelectedTab()}
            onChange={this.handleChange}
            showLabels
          >
            <BottomNavigationAction className="no-outline" id="readyTabFooterBar" label="Ready?" showLabel icon={<HowToVoteIcon />} />
            <BottomNavigationAction className="no-outline" id="ballotTabFooterBar" label="Ballot" showLabel icon={<BallotIcon />} />
            {/* OFF FOR NOW !voterIsSignedIn && () */}
            <BottomNavigationAction className="no-outline" id="valuesTabFooterBar" label="Values" showLabel icon={<QuestionAnswerIcon />} />
            <BottomNavigationAction
              className="no-outline"
              id="friendsTabFooterBar"
              label="Friends"
              showLabel
              icon={(
                <Badge badgeContent={numberOfIncomingFriendRequests} className={classes.anchorOriginTopRightRectangle} color="primary" max={9} style={badgeStyle} onClick={() => this.handleNavigation('/friends')}>
                  <PeopleIcon />
                </Badge>
              )}
            />
            {/* OFF FOR NOW voterIsSignedIn && <BottomNavigationAction className="no-outline" id="newsTabFooterBar" label="News" showLabel icon={<Notifications />} /> */}
            {isCordova() ? (
              <BottomNavigationAction
                className="no-outline"
                id="helpTabFooterBar"
                label="Help"
                showLabel
                icon={<HelpOutline style={{ color: 'rgba(0, 0, 0, 0.541176)' }} />}
                onClick={() => cordovaOpenSafariView('https://help.wevote.us', null, 50)}
              />
            ) : (
              <BottomNavigationAction className="no-outline" id="helpTabFooterBar" />
            )}
          </BottomNavigation>
        </div>
      </FooterBarWrapper>
    );
  }
}

const styles = () => ({
  anchorOriginTopRightRectangle: {
    top: isFriendsTabSelected ? 5 : 2,
  },
});

const FooterBarWrapper = styled.div`
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(FooterBar);
