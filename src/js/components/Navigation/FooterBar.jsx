import { Home, HowToVote, People, QuestionAnswer, QuestionMark } from '@mui/icons-material';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';


class FooterBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMeCount: 0,
      showingOneCompleteYourProfileModal: false,
      showSignInModal: false,
      // voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSharedItemModal = AppObservableStore.showSharedItemModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const friendInvitationsSentToMeCount = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
    this.setState({
      friendInvitationsSentToMeCount,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSharedItemModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const showActivityTidbitDrawer = AppObservableStore.showActivityTidbitDrawer();
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSharedItemModal = AppObservableStore.showSharedItemModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      showActivityTidbitDrawer,
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
      const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
      const friendInvitationsSentToMeCount = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
      this.setState({
        friendInvitationsSentToMeCount,
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
        return historyPush('/friends');
      case 3:
        return historyPush('/news');
      case 4:
        return this.openHowItWorksModal();
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const pathname = normalizedHref();
    if (stringContains('/ready', pathname.toLowerCase())) return 0;
    if (stringContains('/ballot', pathname.toLowerCase())) return 1;
    if (stringContains('/friends', pathname.toLowerCase())) return 2;
    if (stringContains('/news', pathname.toLowerCase())) return 3;
    return -1;
  };

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  render () {
    renderLog('FooterBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      friendInvitationsSentToMeCount,
      showActivityTidbitDrawer, showingOneCompleteYourProfileModal, showShareModal,
      showSharedItemModal, showSignInModal, showVoterPlanModal,
    } = this.state;
    // const badgeStyle = {
    //   display: 'inline-block',
    // };
    const hideFooterBehindModal = showActivityTidbitDrawer || showingOneCompleteYourProfileModal || showShareModal || showSharedItemModal || showSignInModal || showVoterPlanModal;
    // console.log('friendInvitationsSentToMeCount:', friendInvitationsSentToMeCount);
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
            <BottomNavigationAction className="no-outline" id="readyTabFooterBar" label="Home" showLabel icon={<Home />} />
            <BottomNavigationAction className="no-outline" id="ballotTabFooterBar" label="Ballot" showLabel icon={<HowToVote />} />
            <BottomNavigationAction
              className="no-outline"
              id="friendsTabFooterBar"
              label="Friends"
              showLabel
              // icon={<People />}
              icon={friendInvitationsSentToMeCount > 0 ? (
                <Badge
                  badgeContent={<BadgeCountWrapper>{friendInvitationsSentToMeCount}</BadgeCountWrapper>}
                  classes={{
                    badge: classes.footerFriendsNotificationBadge,
                  }}
                  color="primary"
                  max={9}
                  style={{
                    fontSize: 10,
                    right: 0,
                    top: 4,
                  }}
                >
                  <People />
                </Badge>
              ) : (
                <People />
              )}
            />
            <BottomNavigationAction className="no-outline" id="newsTabFooterBar" label="Discuss" showLabel icon={<QuestionAnswer />} />
            <BottomNavigationAction className="no-outline u-no-break" id="howItWorksFooterBar" label="How It Works" showLabel icon={<QuestionMark />} />
          </BottomNavigation>
        </div>
      </FooterBarWrapper>
    );
  }
}
FooterBar.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  footerFriendsNotificationBadge: {
    backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    height: 15,
    marginRight: 0,
    marginTop: 0,
    minWidth: 15,
    width: 15,
  },
});

const BadgeCountWrapper = styled('span')(({ theme }) => (`
  display: flex;
  justify-content: center;
  padding-top: 0;
  ${theme.breakpoints.down('md')} {
    padding-top: 1px;
  }
`));

const FooterBarWrapper = styled('div')`
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(FooterBar);
