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
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

class SettingsProfilePicture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      profileImageTypeCurrentlyActive: 'UPLOADED',
      uploadedFileStaged: false,
    };
    this.changeProfileImageTypeCurrentlyActive = this.changeProfileImageTypeCurrentlyActive.bind(this);
    this.setProfileImageTypeCurrentlyActive = this.setProfileImageTypeCurrentlyActive.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    const { uploadedFileStaged } = this.state;
    const voter = VoterStore.getVoter();
    let profileImageTypeCurrentlyActive = 'UPLOADED';
    if (voter.profile_image_type_currently_active && !uploadedFileStaged) {
      if (voter.profile_image_type_currently_active !== 'UNKNOWN') {
        profileImageTypeCurrentlyActive = voter.profile_image_type_currently_active;
      }
    }
    this.setState({
      profileImageTypeCurrentlyActive,
      voterFacebookImageUrlLarge: voter.we_vote_hosted_profile_facebook_image_url_large,
      voterPhotoQueuedToSaveSet: VoterStore.getVoterPhotoQueuedToSaveSet(),
      voterTwitterImageUrlLarge: voter.we_vote_hosted_profile_twitter_image_url_large,
    });
  };

  setProfileImageTypeCurrentlyActive (type) {
    const { uploadedFileStaged } = this.state;
    const isStaged = type === 'UPLOADED' ? 'true' : uploadedFileStaged;
    this.setState({
      profileImageTypeCurrentlyActive: type,
      profileImageTypeCurrentlyActiveSet: true,
      uploadedFileStaged: isStaged,
    });
  }

  submitVoterPhotoSave = (buttonId) => {
    const { profileImageTypeCurrentlyActive } = this.state;
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    if (voterPhotoQueuedToSaveSet || profileImageTypeCurrentlyActive) {
      VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet, profileImageTypeCurrentlyActive);
      VoterActions.voterPhotoQueuedToSave(undefined);

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
    }

    this.setState({
      voterPhotoQueuedToSaveSet: false,
      profileImageTypeCurrentlyActiveSet: false,
      uploadedFileStaged: false,
    });
  }

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
      profileImageTypeCurrentlyActive, profileImageTypeCurrentlyActiveSet,
      voterFacebookImageUrlLarge, voterPhotoQueuedToSaveSet, voterTwitterImageUrlLarge,
    } = this.state;
    const { classes } = this.props;
    const onlyOneOption = !(voterFacebookImageUrlLarge || voterTwitterImageUrlLarge);

    return (
      <Wrapper>
        <RadioWrapper value={profileImageTypeCurrentlyActive} onChange={this.changeProfileImageTypeCurrentlyActive} name="profile-option">
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
                <VoterPhotoUpload limitPhotoHeight maxWidth={100} onUpload={this.setProfileImageTypeCurrentlyActive} />
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
        <SaveOuterWrapper>
          <SaveInnerWrapper>
            <Button
              classes={{ root: classes.buttonSave }}
              color="primary"
              disabled={!voterPhotoQueuedToSaveSet && !profileImageTypeCurrentlyActiveSet}
              id="saveEditYourPhotoBottom"
              onClick={() => this.submitVoterPhotoSave('saveEditYourPhotoBottom')}
              variant="contained"
            >
              {(!voterPhotoQueuedToSaveSet && !profileImageTypeCurrentlyActiveSet) ? 'Photo saved' : 'Save photo'}
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

const Wrapper = styled('div')`
`;

export default withStyles(styles)(SettingsProfilePicture);
