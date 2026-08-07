import { Button, FormControlLabel, Radio } from '@mui/material';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ColumnWrapper, CustomColumns, ProfilePicture, ProfilePictureOption,
  ProfilePictureWrapper, RadioWrapper, SaveInnerWrapper, SaveOuterWrapper,
  Separator,
} from '../Style/ProfilePictureStyles';
import VoterActions from '../../actions/VoterActions';
import PhotoUploadProgressIndicator, {
  PHOTO_UPLOAD_FAILED_MESSAGE,
  PHOTO_UPLOAD_TOO_BIG_MESSAGE,
} from '../../common/components/Settings/PhotoUploadProgressIndicator';
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

class SettingsProfilePicture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      photoUploadErrorMessage: '',
      photoUploadInProgress: false,
      profileImageTypeCurrentlyActive: 'UPLOADED',
      profileImageTypeCurrentlyActiveSet: false,
      uploadedFile: '',
      uploadedFileStaged: false,
      voterFacebookImageUrlLarge: '',
      voterTwitterImageUrlLarge: '',
    };
    this.changeProfileImageTypeCurrentlyActive = this.changeProfileImageTypeCurrentlyActive.bind(this);
    this.setProfileImageTypeCurrentlyActive = this.setProfileImageTypeCurrentlyActive.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.clearPhotoUploadSafetyTimeout();
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
        });
      }
    }, 120000);
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { photoUploadInProgress } = this.state;
    const nextState = {
      profileImageTypeCurrentlyActive: voter.profile_image_type_currently_active,
      voterFacebookImageUrlLarge: voter.we_vote_hosted_profile_facebook_image_url_large,
      voterTwitterImageUrlLarge: voter.we_vote_hosted_profile_twitter_image_url_large,
    };
    if (photoUploadInProgress) {
      // voterUpdate (or related) returned — clear the in-flight loader
      this.clearPhotoUploadSafetyTimeout();
      nextState.photoUploadInProgress = false;
      nextState.photoUploadErrorMessage = VoterStore.getVoterPhotoTooBig() ? PHOTO_UPLOAD_TOO_BIG_MESSAGE : '';
    }
    this.setState(nextState);
  }

  setProfileImageTypeCurrentlyActive () {
    this.setState({
      profileImageTypeCurrentlyActive: 'UPLOADED',
      profileImageTypeCurrentlyActiveSet: true,
    });
  }

  save = (buttonId) => {
    const {
      photoUploadInProgress,
      profileImageTypeCurrentlyActive,
      profileImageTypeCurrentlyActiveSet,
      uploadedFile,
      uploadedFileStaged,
    } = this.state;
    if (photoUploadInProgress) {
      return;
    }
    // const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    // const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    if (profileImageTypeCurrentlyActiveSet && uploadedFileStaged) {
      VoterActions.profilePhotoTooBigReset();
      VoterActions.voterPhotoSave(uploadedFile, uploadedFileStaged, profileImageTypeCurrentlyActive);
      // VoterActions.voterPhotoQueuedToSave(undefined);

      // Adding event data to dataLayer for Google Tag Manager
      const dataLayerObject = {
        event: 'action',
        actionDetails: {
          actionType: 'upload',
          buttonId,
        },
        userDetails: VoterStore.getAnalyticsUserDetails(),
        pageDetails: getPageDetails(),
      };
      TagManager.dataLayer({ dataLayer: dataLayerObject });

      this.startPhotoUploadSafetyTimeout();
      this.setState({
        photoUploadErrorMessage: '',
        photoUploadInProgress: true,
        profileImageTypeCurrentlyActiveSet: false,
        uploadedFile: '',
        uploadedFileStaged: false,
      });
      return;
    }

    this.setState({
      photoUploadErrorMessage: '',
      profileImageTypeCurrentlyActiveSet: false,
      uploadedFile: '',
      uploadedFileStaged: false,
    });
  };

  onUploadLocal = (file) => {
    this.setState({
      photoUploadErrorMessage: '',
      profileImageTypeCurrentlyActive: 'UPLOADED',
      profileImageTypeCurrentlyActiveSet: true,
      uploadedFile: file,
      uploadedFileStaged: true,
    });
  };

  changeProfileImageTypeCurrentlyActive (e) {
    // console.log('changeProfileImageTypeCurrentlyActive:', e);
    this.setState({
      profileImageTypeCurrentlyActive: e.target.value,
      profileImageTypeCurrentlyActiveSet: true,
    });
  }

  facebookClicked () {
    this.setState({
      profileImageTypeCurrentlyActive: 'FACEBOOK',
      profileImageTypeCurrentlyActiveSet: true,
      uploadedFileStaged: false,
    });
  }

  render () {
    const {
      photoUploadErrorMessage, photoUploadInProgress,
      profileImageTypeCurrentlyActive, profileImageTypeCurrentlyActiveSet, uploadedFileStaged, voterFacebookImageUrlLarge, voterTwitterImageUrlLarge,
    } = this.state;
    const { classes } = this.props;
    const onlyOneOption = !(voterFacebookImageUrlLarge || voterTwitterImageUrlLarge);
    let saveButtonLabel = 'Save photo';
    if (photoUploadInProgress) {
      saveButtonLabel = 'Uploading…';
    } else if (!profileImageTypeCurrentlyActiveSet && !uploadedFileStaged) {
      saveButtonLabel = 'Photo saved';
    }

    return (
      <Wrapper>
        <RadioWrapper defaultValue="UPLOADED" onChange={this.changeProfileImageTypeCurrentlyActive} name="profile-option">
          <ColumnWrapper>
            <CustomColumns onlyOneOption={onlyOneOption}>
              <ProfilePictureOption>
                <FormControlLabel
                  value="UPLOADED"
                  control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'UPLOADED'} />}
                  label="Custom photo"
                  checked={profileImageTypeCurrentlyActive === 'UPLOADED'}
                />
                <Separator />
                <VoterPhotoUpload limitPhotoHeight maxWidth={100} onUpload={this.onUploadLocal} />
              </ProfilePictureOption>
            </CustomColumns>
            {voterFacebookImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="FACEBOOK"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'FACEBOOK'} onClick={this.facebookClicked} />}
                    label="Facebook photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={voterFacebookImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {voterTwitterImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="TWITTER"
                    control={<Radio color="primary" />}
                    label="Twitter photo"
                    checked={profileImageTypeCurrentlyActive === 'TWITTER'}
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={voterTwitterImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
          </ColumnWrapper>
        </RadioWrapper>
        <PhotoUploadProgressIndicator inProgress={photoUploadInProgress} />
        {!!photoUploadErrorMessage && (
          <PhotoUploadErrorMessage>{photoUploadErrorMessage}</PhotoUploadErrorMessage>
        )}
        <SaveOuterWrapper>
          <SaveInnerWrapper>
            <Button
              classes={{ root: classes.buttonSave }}
              color="primary"
              disabled={photoUploadInProgress || (!profileImageTypeCurrentlyActiveSet && !uploadedFileStaged)}
              id="saveEditYourPhotoBottom"
              onClick={() => this.save('saveEditYourPhotoBottom')}
              variant="contained"
            >
              {saveButtonLabel}
            </Button>
          </SaveInnerWrapper>
        </SaveOuterWrapper>
      </Wrapper>
    );
  }
}
SettingsProfilePicture.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
  buttonSave: {
    boxShadow: 'none !important',
    // fontSize: '18px',
    // height: '45px !important',
    marginLeft: 10,
    padding: '0 30px',
    textTransform: 'none',
    // width: 150,
  },
});

const PhotoUploadErrorMessage = styled('div')`
  color: #d32f2f;
  font-family: 'Poppins', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
  width: 100%;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(SettingsProfilePicture);
