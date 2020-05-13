import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendsIcon from '../Widgets/FriendsIcon';
import FriendStore from '../../stores/FriendStore';
import SuggestedFriendToggle from './SuggestedFriendToggle';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class FriendToggle extends Component {
  static propTypes = {
    displayFullWidth: PropTypes.bool,
    lightModeOn: PropTypes.bool,
    otherVoterWeVoteId: PropTypes.string.isRequired,
    showFriendsText: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      unFriendSubmitted: false,
      voter: {
        we_vote_id: '',
      },
    };
    this.unFriend = this.unFriend.bind(this);
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
    const { otherVoterWeVoteId } = this.props;
    const { unFriendSubmitted } = this.state;
    const isFriend = FriendStore.isFriend(otherVoterWeVoteId);
    this.setState({
      isFriend,
      unFriendSubmitted: (unFriendSubmitted && !isFriend) ? false : unFriendSubmitted,
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  unFriend () {
    const { otherVoterWeVoteId } = this.props;
    FriendActions.unFriend(otherVoterWeVoteId);
    this.setState({
      unFriendSubmitted: true,
    });
  }

  render () {
    renderLog('FriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { displayFullWidth, lightModeOn, otherVoterWeVoteId, showFriendsText } = this.props;
    const { isFriend, unFriendSubmitted } = this.state;
    const isLookingAtSelf = this.state.voter.we_vote_id === otherVoterWeVoteId;
    // You should not be able to friend yourself
    if (isLookingAtSelf) { return <div />; }

    return (
      <ButtonContainer displayFullWidth={displayFullWidth}>
        {isFriend ? (
          <InnerButtonContainer>
            <Button
              className="issues-follow-btn issues-follow-btn__main issues-follow-btn__icon issues-follow-btn--white issues-followed-btn--white"
              disabled
            >
              {showFriendsText ? (
                <span>
                  <FriendsIcon />
                  <span className="pl-2">{unFriendSubmitted ? 'Removing Friend...' : 'Friends'}</span>
                </span>
              ) : (
                <span>
                  <FriendsIcon />
                </span>
              )}
            </Button>
            <div className="issues-follow-btn__separator" />
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
                className="dropdown-item issues-follow-btn issues-follow-btn__menu-item u-z-index-5020"
                disabled={unFriendSubmitted}
                // data-toggle="dropdown"
                onClick={this.unFriend}
              >
                Remove Friend
              </Button>
            </Menu>
          </InnerButtonContainer>
        ) : (
          <InnerButtonContainer>
            <SuggestedFriendToggle
              displayFullWidth={displayFullWidth}
              lightModeOn={lightModeOn}
              otherVoterWeVoteId={otherVoterWeVoteId}
            />
          </InnerButtonContainer>
        )}
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
  margin-top: 0;
  @media(min-width: 400px) {
    ${({ displayFullWidth }) => (displayFullWidth ? 'width: 100%;' : 'width: fit-content;')}
    margin-left: auto;
  }
`;

const InnerButtonContainer = styled.div`
  margin-left: auto;
  position: relative;
  display: flex;
  justify-content: center;
  height: 32px !important;
  width: 100%;
`;
