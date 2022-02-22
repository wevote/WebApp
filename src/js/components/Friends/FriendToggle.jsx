import { Button, ClickAwayListener, MenuItem, MenuList } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import FriendsIcon from '../Widgets/FriendsIcon';
import SuggestedFriendToggle from './SuggestedFriendToggle';


export default class FriendToggle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      unFriendSubmitted: false,
      menuOpen: false,
      voter: {
        we_vote_id: '',
      },
    };
    this.unFriend = this.unFriend.bind(this);
    this.handleTriangleClick = this.handleTriangleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleClose () {
    this.setState({ menuOpen: false });
  }

  handleTriangleClick () {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
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
      menuOpen: false,
      unFriendSubmitted: true,
    });
  }

  render () {
    renderLog('FriendToggle');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state) { return <div />; }
    const { displayFullWidth, lightModeOn, otherVoterWeVoteId, showFriendsText } = this.props;
    const { isFriend, unFriendSubmitted, menuOpen } = this.state;
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
            <ToggleButton
              type="button"
              id="dropdown-toggle-id"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              data-reference="parent"
              onClick={() => this.handleTriangleClick()}
            >
              <DownwardTriangle />
            </ToggleButton>
            <StyledMenuList>
              {menuOpen ? (
                <ClickAwayListener onClickAway={this.handleClose}>
                  <StyledMenuItem
                    disabled={unFriendSubmitted}
                    onClick={this.unFriend}
                  >
                    Remove Friend
                  </StyledMenuItem>
                </ClickAwayListener>
              ) : null}
            </StyledMenuList>
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
FriendToggle.propTypes = {
  displayFullWidth: PropTypes.bool,
  lightModeOn: PropTypes.bool,
  otherVoterWeVoteId: PropTypes.string.isRequired,
  showFriendsText: PropTypes.bool,
};


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

const StyledMenuList = styled(MenuList)`
  position: absolute;
  top: 29px;
  right: 0;
  left: 0;
  z-index: 10;
`;

const StyledMenuItem = styled(MenuItem)`
  height: 30px;
  border: 1px solid;
  background-color: white;
`;

const ToggleButton = styled(Button)`
  width: 35px !important;
  min-width: 35px !important;
  padding: 4px 8px !important;
  height: 100% !important;
  vertical-align: middle !important;
  color: #0d546f !important;
  background: white !important;
  font-weight: 600 !important;
  border: 1px solid #ccc !important;
  max-height: none !important;
  white-space: nowrap;
  border-radius: 3px !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
`;

const DownwardTriangle = styled.span`
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #0d546f;
`;
