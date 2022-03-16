import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import VoterStore from '../../stores/VoterStore';


class SettingsProfilePicture extends Component {
  constructor (props) {
    super(props);
    this.state = {
      profileImageTypeCurrentlyActive: 'UPLOADED',
    };
    this.changeProfileImageTypeCurrentlyActive = this.changeProfileImageTypeCurrentlyActive.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    let profileImageTypeCurrentlyActive = 'UPLOADED';
    if (voter.profile_image_type_currently_active) {
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

  submitVoterPhotoSave = () => {
    const { profileImageTypeCurrentlyActive } = this.state;
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    if (voterPhotoQueuedToSaveSet || profileImageTypeCurrentlyActive) {
      VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet, profileImageTypeCurrentlyActive);
      VoterActions.voterPhotoQueuedToSave(undefined);
    }
    this.setState({
      voterPhotoQueuedToSaveSet: false,
      profileImageTypeCurrentlyActiveSet: false,
    });
  }

  changeProfileImageTypeCurrentlyActive (e) {
    // console.log(e.target.value);
    this.setState({
      profileImageTypeCurrentlyActive: e.target.value,
      profileImageTypeCurrentlyActiveSet: true,
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
            <CustomColumns onlyOneOption={onlyOneOption} style={isCordova() ? {  display: 'none' } : {}}>
              <ProfilePictureOption>
                <FormControlLabel
                  value="UPLOADED"
                  control={<Radio color="primary" />}
                  label="Custom photo"
                />
                <Separator />
                <VoterPhotoUpload maxWidth={100} />
              </ProfilePictureOption>
            </CustomColumns>
            {voterFacebookImageUrlLarge && (
              <CustomColumns>
                <ProfilePictureOption>
                  <FormControlLabel
                    value="FACEBOOK"
                    control={<Radio color="primary" />}
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
              onClick={this.submitVoterPhotoSave}
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

const ColumnWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CustomColumns = styled('div', {
  shouldForwardProp: (prop) => !['onlyOneOption'].includes(prop),
})(({ onlyOneOption }) => (`
  ${onlyOneOption ? 'width: 100% !important;' : 'width: 49% !important;'}
`));

const ProfilePictureOption = styled('div')`
  border: 2px solid #e8e8e8;
  border-radius: 3px;
  padding: 4px 12px 12px 12px;
  display: flex !important;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 3px;
`;

const ProfilePicture = styled('img')`
  border-radius: 50px;
  margin: 0 auto;
  max-width: 100px;
`;

const ProfilePictureWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 9px;
  margin-bottom: 26px;
  width: 100%;
`;

const RadioWrapper = styled(RadioGroup)`
`;

const SaveInnerWrapper = styled('div')`
  display: flex;
`;

const SaveOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 0 0 8px 0;
`;

const Separator = styled('div')`
  width: 100%;
  margin: 12px 0;
  background: #e8e8e8;
  height: 1px;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(SettingsProfilePicture);
