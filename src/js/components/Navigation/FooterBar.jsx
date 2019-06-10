import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import Badge from '@material-ui/core/Badge'; // DALE: FRIENDS TEMPORARILY DISABLED
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import BallotIcon from '@material-ui/icons/Ballot';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
// import PeopleIcon from '@material-ui/icons/People'; // DALE: FRIENDS TEMPORARILY DISABLED
import { cordovaFooterHeight, historyPush } from '../../utils/cordovaUtils';
import { stringContains } from '../../utils/textFormat';
import FriendStore from '../../stores/FriendStore';

class FooterBar extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: 0,
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));

    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  handleChange = (event, value) => {
    switch (value) {
      case 0:
        return historyPush('/ballot');
      case 1:
        return historyPush('/values');
      // case 2:
      //   return historyPush('/friends'); // DALE: FRIENDS TEMPORARILY DISABLED
      case 2: // DALE: FRIENDS TEMPORARILY DISABLED - Switch back to "3"
        return historyPush('/ballot/vote');
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot/vote', pathname.toLowerCase())) return 2; // // DALE: FRIENDS TEMPORARILY DISABLED - Switch back to "3"
    if (stringContains('/ballot', pathname.toLowerCase())) return 0;
    // if (stringContains('/friends', pathname.toLowerCase())) return 2; // DALE: FRIENDS TEMPORARILY DISABLED
    if (stringContains('/value', pathname.toLowerCase())) return 1; // '/values'
    return -1;
  };

  handleNavigation = to => historyPush(to);

  render () {
    // console.log('FooterBar render');
    // const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length || 0; // DALE: FRIENDS TEMPORARILY DISABLED

    // const badgeStyle = { // DALE: FRIENDS TEMPORARILY DISABLED
    //   display: 'inline-block',
    // };

    return (
      <div className="footer-container u-show-mobile-tablet" style={{ height: `${cordovaFooterHeight()}` }}>
        <BottomNavigation value={this.getSelectedTab()} onChange={this.handleChange} showLabels>
          <BottomNavigationAction className="no-outline" id="ballotTabFooterBar" label="Ballot" showLabel icon={<BallotIcon />} />
          <BottomNavigationAction className="no-outline" id="valuesTabFooterBar" label="Values" showLabel icon={<QuestionAnswerIcon />} />
          {/* <BottomNavigationAction
            className="no-outline"
            id="friendsTabFooterBar"
            label="Friends"
            showLabel
            icon={(
              <Badge badgeContent={numberOfIncomingFriendRequests} color="primary" max={9} style={badgeStyle} onClick={() => this.handleNavigation('/friends')}>
                <PeopleIcon />
              </Badge>
            )}
          /> */}
          <BottomNavigationAction className="no-outline" id="voteTabFooterBar" label="Vote" showLabel icon={<HowToVoteIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default FooterBar;
