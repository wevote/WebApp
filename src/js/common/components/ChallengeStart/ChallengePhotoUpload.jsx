import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { DropzoneArea } from 'mui-file-dropzone';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import ChallengeStore from '../../stores/ChallengeStore';


class ChallengePhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount () {
    // console.log('ChallengePhotoUpload, componentDidMount');
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.onChallengeStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('ChallengePhotoUpload componentDidUpdate');
    const {
      challengeWeVoteId: challengeWeVoteIdPrevious,
    } = prevProps;
    const {
      challengeWeVoteId,
    } = this.props;
    if (challengeWeVoteId) {
      if (challengeWeVoteId !== challengeWeVoteIdPrevious) {
        this.onChallengeStartStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.challengeStartStoreListener.remove();
    this.challengeStoreListener.remove();
  }

  handleDrop (files) {
    if (files && files[0]) {
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      const fileReader = new FileReader();
      // No need to 'remove' this type of event listener
      fileReader.addEventListener('load', () => {
        const photoFromFileReader = fileReader.result;
        // console.log('photoFromFileReader:', photoFromFileReader);
        ChallengeStartActions.challengePhotoQueuedToSave(photoFromFileReader);
      });
      fileReader.readAsDataURL(fileFromDropzone);
    }
  }

  onChallengeStartStoreChange () {
    const { challengeWeVoteId, editExistingChallenge } = this.props;
    let challengePhotoLargeUrl = '';
    if (editExistingChallenge) {
      const challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
      if (challenge && challenge.challenge_we_vote_id) {
        challengePhotoLargeUrl = challenge.we_vote_hosted_challenge_photo_large_url;
      }
    } else {
      challengePhotoLargeUrl = ChallengeStartStore.getChallengePhotoLargeUrl();
    }
    const challengePhotoQueuedToDelete = ChallengeStartStore.getChallengePhotoQueuedToDelete();
    const challengePhotoQueuedToDeleteSet = ChallengeStartStore.getChallengePhotoQueuedToDeleteSet();
    this.setState({
      challengePhotoLargeUrl,
      challengePhotoQueuedToDelete,
      challengePhotoQueuedToDeleteSet,
    });
  }

  markChallengeImageForDelete = () => {
    ChallengeStartActions.challengePhotoQueuedToDelete(true);
  }

  render () {
    renderLog('ChallengePhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { challengePhotoLargeUrl, challengePhotoQueuedToDelete, challengePhotoQueuedToDeleteSet } = this.state;
    let challengePhotoExists = false;
    let dropzoneText = isMobileScreenSize() ? 'Upload challenge photo' : 'Drag challenge photo here (or click to find file)';
    if (challengePhotoLargeUrl) {
      challengePhotoExists = true;
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new photo here (or click to find file)';
    }
    const challengePhotoMarkedForDeletion = Boolean(challengePhotoQueuedToDelete && challengePhotoQueuedToDeleteSet);
    // console.log('challengePhotoMarkedForDeletion:', challengePhotoMarkedForDeletion);
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {(challengePhotoExists && !challengePhotoMarkedForDeletion) ? (
                <OverlayOuterWrapper>
                  <OverlayInnerWrapper>
                    <ChallengeImageDeleteButtonOuterWrapper>
                      <ChallengeImageDeleteButtonInnerWrapper>
                        <Button
                          classes={{ root: classes.buttonDelete }}
                          color="primary"
                          id="deleteCurrent Image"
                          onClick={this.markChallengeImageForDelete}
                          variant="contained"
                        >
                          Delete
                        </Button>
                      </ChallengeImageDeleteButtonInnerWrapper>
                    </ChallengeImageDeleteButtonOuterWrapper>
                    <ChallengeImageWrapper>
                      <ChallengeImage src={challengePhotoLargeUrl} alt="Challenge" />
                    </ChallengeImageWrapper>
                  </OverlayInnerWrapper>
                </OverlayOuterWrapper>
              ) : (
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  classes={{
                    icon: classes.dropzoneIcon,
                    root: classes.dropzoneRoot,
                  }}
                  dropzoneText={dropzoneText}
                  filesLimit={1}
                  initialFiles={challengePhotoExists ? [challengePhotoLargeUrl] : undefined}
                  maxFileSize={6000000}
                  onChange={this.handleDrop}
                />
              )}
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
ChallengePhotoUpload.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  editExistingChallenge: PropTypes.bool,
};

const styles = (theme) => ({
  buttonDelete: {
    backgroundColor: '#f44336',
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '35px !important',
    '&:hover': {
      backgroundColor: '#8C001A',
    },
    marginLeft: 10,
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneRoot: {
    color: '#999',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
});

const ChallengeImage = styled('img')`
  width: 100%;
`;

const ChallengeImageWrapper = styled('div')`
  margin-top: -44px;
`;

const ChallengeImageDeleteButtonOuterWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const ChallengeImageDeleteButtonInnerWrapper = styled('div')`
  margin-right: 8px;
  z-index: 2;
`;

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const OverlayOuterWrapper = styled('div')`
  align-self: flex-end;
  // width: 640px;
  display: flex;
  // padding: 0 15px;
`;

const OverlayInnerWrapper = styled('div')`
  min-height: 37px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  margin-top: 10px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(ChallengePhotoUpload);
