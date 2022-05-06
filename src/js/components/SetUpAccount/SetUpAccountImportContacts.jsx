import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  InputFieldsWrapper,
  SetUpAccountIntroText,
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const inviteYourFriendsGif = '../../../img/get-started/invite-your-friends.gif';

class SetUpAccountImportContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountImportContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.submitImportContacts();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
  }

  onVoterStoreChange () {
    const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    this.setState({
      voterProfileUploadedImageUrlLarge,
    });
  }

  submitImportContacts = () => {
    console.log('SetUpAccountImportContacts submitImportContacts');
    // let voterPhotoMissing = false;
    // const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    // const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    // VoterActions.voterCompleteYourProfileSave(null, false, null, false, voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
    // VoterActions.voterFirstNameQueuedToSave(undefined);
    // VoterActions.voterLastNameQueuedToSave(undefined);
    // VoterActions.voterPhotoQueuedToSave(undefined);
    // VoterActions.voterPhotoTooBigReset();
    //
    // if (!voterPhotoQueuedToSave && !VoterStore.getVoterProfileUploadedImageUrlLarge()) {
    //   voterPhotoMissing = true;
    // }
    // if (voterPhotoMissing) {
    //   this.setState({
    //     voterPhotoMissing,
    //   }, () => this.props.functionToUseWhenProfileNotComplete());
    // } else {
    //   VoterActions.voterRetrieve();
    //   this.functionToUseWhenProfileCompleteTimer = setTimeout(() => {
    //     this.props.functionToUseWhenProfileComplete();
    //   }, 500);
    // }
  }

  render () {
    renderLog('SetUpAccountImportContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      voterProfileUploadedImageUrlLarge,
    } = this.state;
    const inviteYourFriendsSrc = normalizedImagePath(inviteYourFriendsGif);

    return (
      <StepCenteredWrapper>
        {voterProfileUploadedImageUrlLarge ? (
          <>
            <SetUpAccountTitle>Invite your friends</SetUpAccountTitle>
            <SetUpAccountIntroText>
              See how your friends are voting on We Vote.
            </SetUpAccountIntroText>
          </>
        ) : (
          <>
            <SetUpAccountTitle>Invite your friends</SetUpAccountTitle>
            <SetUpAccountIntroText>Don&apos;t be alone when you are deciding how to vote.</SetUpAccountIntroText>
          </>
        )}
        <InputFieldsWrapper>
          <InviteYourFriendsWrapper>
            <div>
              <InviteYourFriendsImg src={inviteYourFriendsSrc} width="250" height="256" alt="" />
            </div>
          </InviteYourFriendsWrapper>
        </InputFieldsWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountImportContacts.propTypes = {
  // functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  // functionToUseWhenProfileNotComplete: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

const InviteYourFriendsImg = styled('img')`
`;

const InviteYourFriendsWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;


export default withStyles(styles)(SetUpAccountImportContacts);
