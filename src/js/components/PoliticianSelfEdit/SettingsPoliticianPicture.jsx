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
import PoliticianActions from '../../common/actions/PoliticianActions';
import PhotoUploadProgressIndicator, {
  PHOTO_UPLOAD_FAILED_MESSAGE,
  PHOTO_UPLOAD_TOO_BIG_MESSAGE,
} from '../../common/components/Settings/PhotoUploadProgressIndicator';
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import PoliticianStore from '../../common/stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

class SettingsPoliticianPicture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      photoUploadErrorMessage: '',
      photoUploadInProgress: false,
      politicianBallotpediaImageUrlLarge: '',
      politicianFacebookImageUrlLarge: '',
      politicianLinkedInImageUrlLarge: '',
      politicianPhotoQueuedToSaveSet: false,
      politicianTwitterImageUrlLarge: '',
      politicianVoteUSAImageUrlLarge: '',
      politicianWikipediaImageUrlLarge: '',
      profileImageTypeCurrentlyActive: 'UPLOADED',
      uploadedFileStaged: false,
    };
    this.changeProfileImageTypeCurrentlyActive = this.changeProfileImageTypeCurrentlyActive.bind(this);
    // this.setProfileImageTypeCurrentlyActive = this.setProfileImageTypeCurrentlyActive.bind(this);
  }

  componentDidMount () {
    // console.log('SettingsPoliticianPicture componentDidMount');
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log('SettingsPoliticianPicture componentWillUnmount');
    this.politicianStoreListener.remove();
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

  onPoliticianStoreChange = () => {
    const { politicianWeVoteId } = this.props;
    const { photoUploadInProgress, uploadedFileStaged } = this.state;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    let profileImageTypeCurrentlyActive = 'UPLOADED';
    if (politician.profile_image_type_currently_active && !uploadedFileStaged) {
      if (politician.profile_image_type_currently_active !== 'UNKNOWN') {
        profileImageTypeCurrentlyActive = politician.profile_image_type_currently_active;
      }
    }
    const nextState = {
      profileImageTypeCurrentlyActive,
      politicianBallotpediaImageUrlLarge: politician.we_vote_hosted_profile_ballotpedia_image_url_large,
      politicianFacebookImageUrlLarge: politician.we_vote_hosted_profile_facebook_image_url_large,
      politicianLinkedInImageUrlLarge: politician.we_vote_hosted_profile_linkedin_image_url_large,
      politicianTwitterImageUrlLarge: politician.we_vote_hosted_profile_twitter_image_url_large,
      politicianVoteUSAImageUrlLarge: politician.we_vote_hosted_profile_vote_usa_image_url_large,
      politicianWikipediaImageUrlLarge: politician.we_vote_hosted_profile_wikipedia_image_url_large,
    };
    if (photoUploadInProgress) {
      // politicianSave returned — clear the in-flight loader
      this.clearPhotoUploadSafetyTimeout();
      nextState.photoUploadInProgress = false;
      nextState.photoUploadErrorMessage = PoliticianStore.getPoliticianPhotoTooBig() ? PHOTO_UPLOAD_TOO_BIG_MESSAGE : '';
    }
    this.setState(nextState);
  };

  // setProfileImageTypeCurrentlyActive (type) {
  //   const { uploadedFileStaged } = this.state;
  //   console.log('SettingsPoliticianPicture setProfileImageTypeCurrentlyActive:', type);
  //   const isStaged = type === 'UPLOADED' ? 'true' : uploadedFileStaged;
  //   this.setState({
  //     profileImageTypeCurrentlyActive: type,
  //     profileImageTypeCurrentlyActiveSet: true,
  //     uploadedFileStaged: isStaged,
  //   });
  // }

  onUploadLocal = (file) => {
    console.log('SettingsPoliticianPicture onUploadLocal (not used):', file);
    this.setState({
      photoUploadErrorMessage: '',
      profileImageTypeCurrentlyActive: 'UPLOADED',
      profileImageTypeCurrentlyActiveSet: true,
      // uploadedFile: file,
      uploadedFileStaged: true,
    });
  };

  submitPoliticianPhotoSave = (buttonId) => {
    const { politicianWeVoteId } = this.props;
    const { photoUploadInProgress, profileImageTypeCurrentlyActive } = this.state;
    if (photoUploadInProgress) {
      return;
    }
    const politicianPhotoQueuedToSave = PoliticianStore.getPoliticianPhotoQueuedToSave();
    const politicianPhotoQueuedToSaveSet = PoliticianStore.getPoliticianPhotoQueuedToSaveSet();
    const uploadingPhoto = !!politicianPhotoQueuedToSaveSet;
    if (politicianPhotoQueuedToSaveSet || profileImageTypeCurrentlyActive) {
      // Fire async save before clearing the queue so the sync queue-clear store update
      // does not clear photoUploadInProgress early.
      PoliticianActions.politicianPhotoSave(politicianWeVoteId, politicianPhotoQueuedToSave, politicianPhotoQueuedToSaveSet, profileImageTypeCurrentlyActive);
      PoliticianActions.politicianPhotoQueuedToSave(undefined);

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
      if (politicianWeVoteId) {
        dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
      }
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }

    if (uploadingPhoto) {
      this.startPhotoUploadSafetyTimeout();
    }
    this.setState({
      photoUploadErrorMessage: '',
      photoUploadInProgress: uploadingPhoto,
      politicianPhotoQueuedToSaveSet: false,
      profileImageTypeCurrentlyActiveSet: false,
      uploadedFileStaged: false,
    });
  };

  changeProfileImageTypeCurrentlyActive (e) {
    // console.log('changeProfileImageTypeCurrentlyActive:', e);
    this.setState({
      profileImageTypeCurrentlyActive: e.target.value,
      profileImageTypeCurrentlyActiveSet: true,
    });
  }

  render () {
    const {
      photoUploadErrorMessage, photoUploadInProgress,
      politicianBallotpediaImageUrlLarge, profileImageTypeCurrentlyActive, profileImageTypeCurrentlyActiveSet,
      politicianFacebookImageUrlLarge, politicianLinkedInImageUrlLarge, politicianPhotoQueuedToSaveSet, politicianTwitterImageUrlLarge,
      politicianVoteUSAImageUrlLarge, politicianWikipediaImageUrlLarge,
    } = this.state;
    const { classes, politicianWeVoteId } = this.props;
    const onlyOneOption = !(politicianFacebookImageUrlLarge || politicianTwitterImageUrlLarge);
    let saveButtonLabel = 'Save photo';
    if (photoUploadInProgress) {
      saveButtonLabel = 'Uploading…';
    } else if (!politicianPhotoQueuedToSaveSet && !profileImageTypeCurrentlyActiveSet) {
      saveButtonLabel = 'Photo saved';
    }

    return (
      <Wrapper>
        <RadioWrapper
          value={profileImageTypeCurrentlyActive}
          onChange={this.changeProfileImageTypeCurrentlyActive}
          name="profile-option"
        >
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
                <VoterPhotoUpload
                  limitPhotoHeight
                  maxWidth={100}
                  onUpload={this.onUploadLocal}
                  politicianWeVoteId={politicianWeVoteId}
                />
              </ProfilePictureOption>
            </CustomColumns>
            {politicianVoteUSAImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="VOTE_USA"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'VOTE_USA'} />}
                    label="Vote-USA photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianVoteUSAImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {politicianBallotpediaImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="BALLOTPEDIA"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'BALLOTPEDIA'} />}
                    label="Ballotpedia photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianBallotpediaImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {politicianWikipediaImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="WIKIPEDIA"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'WIKIPEDIA'} />}
                    label="Wikipedia photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianWikipediaImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {politicianLinkedInImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="LINKEDIN"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'LINKEDIN'} />}
                    label="LinkedIn photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianLinkedInImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {politicianFacebookImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="FACEBOOK"
                    control={<Radio color="primary" checked={profileImageTypeCurrentlyActive === 'FACEBOOK'} />}
                    label="Facebook photo"
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianFacebookImageUrlLarge} />
                  </ProfilePictureWrapper>
                </ProfilePictureOption>
              </CustomColumns>
            )}
            {politicianTwitterImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="TWITTER"
                    control={<Radio color="primary" />}
                    label="X photo"
                    checked={profileImageTypeCurrentlyActive === 'TWITTER'}
                  />
                  <Separator />
                  <ProfilePictureWrapper>
                    <ProfilePicture src={politicianTwitterImageUrlLarge} />
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
              disabled={photoUploadInProgress || (!politicianPhotoQueuedToSaveSet && !profileImageTypeCurrentlyActiveSet)}
              id="saveEditYourPhotoBottom"
              onClick={() => this.submitPoliticianPhotoSave('saveEditYourPhotoBottom')}
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
SettingsPoliticianPicture.propTypes = {
  classes: PropTypes.object,
  politicianWeVoteId: PropTypes.string,
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

export default withStyles(styles)(SettingsPoliticianPicture);
