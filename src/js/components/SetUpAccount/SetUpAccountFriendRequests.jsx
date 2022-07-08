import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationList from '../Friends/FriendInvitationList';
import SuggestedFriendList from '../Friends/SuggestedFriendList';
import FriendStore from '../../stores/FriendStore';
import { SectionTitle } from '../Style/friendStyles';
import {
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';


class SetUpAccountFriendRequests extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: [],
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountFriendRequests componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const friendInvitationsSentToMeUnsorted = FriendStore.friendInvitationsSentToMe();
    const friendInvitationsSentToMe = friendInvitationsSentToMeUnsorted;
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      friendInvitationsSentToMe,
      suggestedFriendList,
    });
  }

  render () {
    renderLog('SetUpAccountFriendRequests');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentToMe, suggestedFriendList } = this.state;
    const friendInvitationsSentToMeLength = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
    const suggestedFriendListLength = (suggestedFriendList) ? suggestedFriendList.length : 0;
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>Friends</SetUpAccountTitle>
          <SetUpAccountIntroText>&nbsp;</SetUpAccountIntroText>
        </SetUpAccountTop>
        {/* Chip filters here */}
        {friendInvitationsSentToMeLength > 0 && (
          <FriendInvitationsSentToMeWrapper>
            <SetUpAccountSubTitleWrapper>
              <SectionTitle>
                Invitations sent to me
              </SectionTitle>
            </SetUpAccountSubTitleWrapper>
            <FriendInvitationList
              editMode
              friendList={friendInvitationsSentToMe}
            />
          </FriendInvitationsSentToMeWrapper>
        )}
        {suggestedFriendListLength > 0 && (
          <SuggestedFriendListWrapper>
            <SetUpAccountSubTitleWrapper>
              <SectionTitle>
                People you may know
              </SectionTitle>
            </SetUpAccountSubTitleWrapper>
            <SuggestedFriendList
              friendList={suggestedFriendList}
              editMode
            />
          </SuggestedFriendListWrapper>
        )}
        {(!(suggestedFriendListLength > 0) && !(friendInvitationsSentToMeLength > 0)) && (
          <>Suggested friends not found yet.</>
        )}
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountFriendRequests.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

const FriendInvitationsSentToMeWrapper = styled('div')`
  max-width: 538px;
  width: 100%;
`;

const SetUpAccountSubTitleWrapper = styled('div')`
  max-width: 538px;
  width: 100%;
`;

const SuggestedFriendListWrapper = styled('div')`
  margin-top: 32px;
  max-width: 538px;
  width: 100%;
`;

export default withStyles(styles)(SetUpAccountFriendRequests);
