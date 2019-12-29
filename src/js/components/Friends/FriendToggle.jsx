import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/esm/Button';
import styled from 'styled-components';
import CheckCircle from '@material-ui/icons/CheckCircle';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class FriendToggle extends Component {
  static propTypes = {
    otherVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: '',
      },
    };
    const { otherVoterWeVoteId } = this.props;
    this.acceptFriendInvite = FriendActions.acceptFriendInvite.bind(this, otherVoterWeVoteId);
    this.unFriend = FriendActions.unFriend.bind(this, otherVoterWeVoteId);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFriendStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    // this.setState({
    //   isFriend: FriendStore.isFriend(this.props.otherVoterWeVoteId),
    // });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  render () {
    renderLog('FriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    // const { isFriend } = this.state;
    if (!this.state) { return <div />; }
    const { otherVoterWeVoteId } = this.props;
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    // You should not be able to friend yourself
    if (isLookingAtSelf) { return <div />; }

    return (
      <ButtonContainer>
        <InnerButtonContainer>
          <Button
            className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--white"
            disabled
          >
            <span>
              <CheckCircle className="friends-icon" />
            </span>
          </Button>
          <div className="issues-follow-btn__seperator" />
          <Button
            type="button"
            id="dropdown-toggle-id"
            className="dropdown-toggle dropdown-toggle-split issues-follow-btn issues-follow-btn__dropdown issues-follow-btn--white"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            data-reference="parent"
          >
            <span className="sr-only">Toggle Dropdown</span>
          </Button>
          <Menu id="issues-follow-btn__menu" className="dropdown-menu issues-follow-btn__menu" aria-labelledby="dropdown-toggle-id">
            <Button
              type="button"
              id="dropdown-item-id"
              className="dropdown-item issues-follow-btn issues-follow-btn__menu-item"
              // data-toggle="dropdown"
              onClick={this.unFriend}
            >
              Remove Friend
            </Button>
          </Menu>
        </InnerButtonContainer>
      </ButtonContainer>
    );
  }
}

const Menu = styled.div`
  position: absolute !important;
  right: 0 !important;
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 18px;
  @media(min-width: 400px) {
    width: fit-content;
    margin-top: 0;
    margin-left: auto;
  }
`;

const InnerButtonContainer = styled.div`
  margin-left: auto;
  position: relative;
  display: flex;
  justify-content: center;
  height: 32px !important;
`;
