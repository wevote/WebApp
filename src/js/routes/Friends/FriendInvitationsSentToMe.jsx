import { Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import MessageCard from '../../components/Widgets/MessageCard';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../common/utils/logging';

class FriendInvitationsSentToMe extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: [],
    };
  }

  componentDidMount () {
    FriendActions.friendInvitationsSentToMe();
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  render () {
    renderLog('FriendInvitationsSentToMe');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { friendInvitationsSentToMe } = this.state;
    // console.log(this.state.suggestedFriends);
    const numberOfIncomingFriendRequests = friendInvitationsSentToMe.length || 0;

    return (
      <div className="opinion-view">
        <Helmet title="Friend Requests - We Vote" />
        <div>
          { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
            <span>
              <SectionTitle>
                { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
                  <Badge
                    classes={{ badge: classes.headerBadge }}
                    badgeContent={numberOfIncomingFriendRequests}
                    color="primary"
                  >
                    Friend Requests
                  </Badge>
                ) : (
                  <>
                    Friend Requests (0)
                  </>
                )}
              </SectionTitle>
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentToMe}
              />
            </span>
          ) : (
            <MessageCard
              mainText="You have no incoming friend requests. Send some invites to connect with your friends!"
              buttonText="Invite Friends"
              buttonURL="/friends/invite"
            />
          )}
        </div>
      </div>
    );
  }
}
FriendInvitationsSentToMe.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  headerBadge: {
    right: -15,
    top: 9,
  },
});

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

export default withStyles(styles)(FriendInvitationsSentToMe);
