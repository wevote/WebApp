import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import VoterActions from '../../actions/VoterActions';
import PhotoUploadProgressIndicator, {
  PHOTO_UPLOAD_FAILED_MESSAGE,
  PHOTO_UPLOAD_TOO_BIG_MESSAGE,
} from '../../common/components/Settings/PhotoUploadProgressIndicator';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  InputFieldsWrapper,
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
  VoterNameWrapper,
} from '../Style/SetUpAccountStyles';

const VoterPhotoUpload = React.lazy(() => import(/* webpackChunkName: 'VoterPhotoUpload' */ '../../common/components/Settings/VoterPhotoUpload'));

class SetUpAccountAddPhoto extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      photoUploadErrorMessage: '',
      photoUploadInProgress: false,
      voterFirstName: '',
      voterLastName: '',
      voterPhotoMissing: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountAddPhoto componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.submitSavePhoto();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.clearPhotoUploadSafetyTimeout();
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
    if (this.goToNextStepTimer) {
      clearTimeout(this.goToNextStepTimer);
    }
  }

  clearPhotoUploadSafetyTimeout () {
    if (this.photoUploadSafetyTimeout) {
      clearTimeout(this.photoUploadSafetyTimeout);
      this.photoUploadSafetyTimeout = null;
    }
  }

  startPhotoUploadSafetyTimeout () {
    this.clearPhotoUploadSafetyTimeout();
    this.photoUploadSafetyTimeout = setTimeout(() => {
      if (this.state.photoUploadInProgress) {
        this.setState({
          photoUploadErrorMessage: PHOTO_UPLOAD_FAILED_MESSAGE,
          photoUploadInProgress: false,
        }, () => this.functionToUseWhenProfileNotCompleteLocal());
      }
    }, 120000);
  }

  onVoterStoreChange () {
    const { photoUploadInProgress } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    const nextState = {
      voterFirstName,
      voterLastName,
      voterProfileUploadedImageUrlLarge,
    };
    if (photoUploadInProgress) {
      this.clearPhotoUploadSafetyTimeout();
      nextState.photoUploadInProgress = false;
      if (VoterStore.getVoterPhotoTooBig()) {
        nextState.photoUploadErrorMessage = PHOTO_UPLOAD_TOO_BIG_MESSAGE;
        this.setState(nextState, () => this.functionToUseWhenProfileNotCompleteLocal());
        return;
      }
      nextState.photoUploadErrorMessage = '';
      this.setState(nextState, () => this.finishAfterPhotoUpload());
      return;
    }
    this.setState(nextState);
  }

  functionToUseWhenProfileCompleteLocal = () => {
    if (this.props.functionToUseWhenProfileComplete) {
      this.props.functionToUseWhenProfileComplete();
    }
  };

  functionToUseWhenProfileNotCompleteLocal = () => {
    if (this.props.functionToUseWhenProfileNotComplete) {
      this.props.functionToUseWhenProfileNotComplete();
    }
  };

  goToNextStepLocal = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };

  finishAfterPhotoUpload = () => {
    this.functionToUseWhenProfileCompleteTimer = setTimeout(() => {
      this.functionToUseWhenProfileCompleteLocal();
    }, 500);
    this.goToNextStepTimer = setTimeout(() => {
      this.goToNextStepLocal();
    }, 500);
  };

  submitSavePhoto = () => {
    // console.log('SetUpAccountAddPhoto submitSavePhoto');
    const { photoUploadInProgress } = this.state;
    if (photoUploadInProgress) {
      return;
    }
    let voterPhotoMissing = false;
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    const uploadingNewPhoto = !!voterPhotoQueuedToSaveSet;
    VoterActions.profilePhotoTooBigReset();
    VoterActions.voterCompleteYourProfileSave(null, false, null, false, voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
    VoterActions.voterFirstNameQueuedToSave(undefined);
    VoterActions.voterLastNameQueuedToSave(undefined);
    VoterActions.voterPhotoQueuedToSave(undefined);

    if (!voterPhotoQueuedToSave && !VoterStore.getVoterProfileUploadedImageUrlLarge()) {
      voterPhotoMissing = true;
    }
    if (voterPhotoMissing) {
      this.setState({
        photoUploadErrorMessage: '',
        photoUploadInProgress: false,
        voterPhotoMissing,
      }, () => this.functionToUseWhenProfileNotCompleteLocal());
    } else if (uploadingNewPhoto) {
      // Stay on this step with a loading indicator until voterUpdate returns.
      // Set inProgress after sync queue-clear store updates so they don't clear the loader early.
      this.startPhotoUploadSafetyTimeout();
      this.setState({
        photoUploadErrorMessage: '',
        photoUploadInProgress: true,
        voterPhotoMissing: false,
      });
    } else {
      VoterActions.voterRetrieve();
      this.finishAfterPhotoUpload();
    }
  };

  render () {
    renderLog('SetUpAccountAddPhoto');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      photoUploadErrorMessage, photoUploadInProgress,
      voterFirstName, voterLastName, voterPhotoMissing, voterProfileUploadedImageUrlLarge,
    } = this.state;

    return (
      <StepCenteredWrapper>
        {voterProfileUploadedImageUrlLarge ? (
          <SetUpAccountTop>
            <SetUpAccountTitle>Looking good!</SetUpAccountTitle>
          </SetUpAccountTop>
        ) : (
          <SetUpAccountTop>
            <SetUpAccountTitle>Add your photo</SetUpAccountTitle>
            <SetUpAccountIntroText>Profile pictures help your friends find you.</SetUpAccountIntroText>
          </SetUpAccountTop>
        )}
        <InputFieldsWrapper>
          {voterPhotoMissing && (
            <VoterPhotoMissing>
              Please upload a photo, or click `Skip for now`.
            </VoterPhotoMissing>
          )}
          {!!photoUploadErrorMessage && (
            <PhotoUploadErrorMessage>{photoUploadErrorMessage}</PhotoUploadErrorMessage>
          )}
          <VoterPhotoOuterWrapper>
            <Suspense fallback={<></>}>
              <VoterPhotoUpload showLabel />
            </Suspense>
          </VoterPhotoOuterWrapper>
          <PhotoUploadProgressIndicator inProgress={photoUploadInProgress} />
        </InputFieldsWrapper>
        <VoterNameWrapper>
          {voterFirstName}
          {' '}
          {voterLastName}
        </VoterNameWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountAddPhoto.propTypes = {
  functionToUseWhenProfileComplete: PropTypes.func,
  functionToUseWhenProfileNotComplete: PropTypes.func,
  goToNextStep: PropTypes.func,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

const PhotoUploadErrorMessage = styled('div')`
  color: #d32f2f;
  font-size: 16px;
  margin-bottom: 8px;
  text-align: center;
`;

const VoterPhotoMissing = styled('div')`
  font-size: 18px;
  color: red;
`;

const VoterPhotoOuterWrapper = styled('div')`
  min-height: 240px;
`;

export default withStyles(styles)(SetUpAccountAddPhoto);
