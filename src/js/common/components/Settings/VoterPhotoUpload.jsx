import { AccountCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import { heicTo, isHeic } from 'heic-to';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getPNGfromFile } from 'tiff-to-png-client';
import { DropzoneArea } from 'mui-file-dropzone';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import PoliticianActions from '../../actions/PoliticianActions';
import PoliticianStore from '../../stores/PoliticianStore';
import VoterActions from '../../../actions/VoterActions';
import VoterStore from '../../../stores/VoterStore';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { getPageDetails } from '../../../utils/lookupPageNameAndPageTypeDict';

class VoterPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isWebApp: !isCordova(),
      showDropzoneIcon: true,
      politicianProfileUploadedImageUrlLarge: '',
      voterProfileUploadedImageUrlLarge: '',
    };
    this.canvas = null;
    this.handleWebAppDrop = this.handleWebAppDrop.bind(this);
    this.handleCordovaDrop = this.handleCordovaDrop.bind(this);
  }

  componentDidMount () {
    const { politicianWeVoteId } = this.props;
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }

    let politicianProfileUploadedImageUrlLarge;
    let voterProfileUploadedImageUrlLarge;
    if (politicianWeVoteId) {
      politicianProfileUploadedImageUrlLarge = PoliticianStore.getPoliticianProfileUploadedImageUrlLarge(politicianWeVoteId);
    } else {
      voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    }
    let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
    let showDropzoneIcon = true;
    const uploadedImagePresent = (!politicianWeVoteId && voterProfileUploadedImageUrlLarge) || (politicianWeVoteId && politicianProfileUploadedImageUrlLarge);
    if (uploadedImagePresent) {
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new profile photo here (or click to find file)';
      showDropzoneIcon = false;
    }
    this.setState({
      dropzoneText,
      showDropzoneIcon,
    });
  }

  componentWillUnmount () {
    // console.log('VoterPhotoUpload componentWillUnmount');
    this.politicianStoreListener.remove();
    this.voterStoreListener.remove();
  }

  async handleWebAppDrop (files) {
    const { politicianWeVoteId } = this.props;
    const { politicianProfileUploadedImageUrlLarge, voterProfileUploadedImageUrlLarge } = this.state;
    if (files && files[0]) {
      let dataUrl = '';
      let fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      if (await isHeic(fileFromDropzone)) {
        const convertedBlob = await heicTo({
          blob: fileFromDropzone,
          type: 'image/jpeg',
          quality: 0.5,
        });
        fileFromDropzone = convertedBlob;
        dataUrl = await this.readFileAsDataUrl(fileFromDropzone);
        await this.preparePhotoForUpload(dataUrl);
      } else if (fileFromDropzone.type === 'image/svg+xml') {
        dataUrl = await this.convertImageToAcceptedFormat();
        await this.preparePhotoForUpload(dataUrl);
      } else if (fileFromDropzone.type === 'image/tiff') {
        [dataUrl] = await getPNGfromFile(fileFromDropzone);
        await this.preparePhotoForUpload(dataUrl);
      } else {
        dataUrl = await this.readFileAsDataUrl(fileFromDropzone);
        await this.preparePhotoForUpload(dataUrl);
      }
      const dropzoneText = isMobileScreenSize() ? 'A small preview of your photo is shown below. You can: 1) Click button below to continue, or 2) click here to upload different photo.' : 'A small preview of your photo is shown below. You can: 1) click button below to continue, 2) delete it (hover over photo to see trash can), or 3) drag a NEW version here (or click here to find file).';
      this.setState({
        dropzoneText,
        showDropzoneIcon: false,
      });
    } else {
      let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
      let showDropzoneIcon = true;
      const uploadedImagePresent = (!politicianWeVoteId && voterProfileUploadedImageUrlLarge) || (politicianWeVoteId && politicianProfileUploadedImageUrlLarge);
      if (uploadedImagePresent) {
        dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new profile photo here (or click to find file)';
        showDropzoneIcon = false;
      }
      this.setState({
        dropzoneText,
        showDropzoneIcon,
      });
    }
  }

  handleCordovaDrop (files) {
    console.log('files:', files);
    const { camera: { getPicture, DestinationType: { FILE_URI }, PictureSourceType: { PHOTOLIBRARY }, PopoverArrowDirection: { ARROW_ANY } } } = navigator;
    const { CameraPopoverOptions } = window;
    getPicture(async (pictureUrl) => {
      await this.cameraCallback(pictureUrl);
    }, (err) => console.log(err), {
      destinationType: FILE_URI,
      sourceType: PHOTOLIBRARY,
      popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, ARROW_ANY, 300, 600),
    });
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    if (politicianWeVoteId) {
      const { politicianProfileUploadedImageUrlLarge: politicianProfileUploadedImageUrlLargePrior } = this.state;
      const politicianProfileUploadedImageUrlLarge = PoliticianStore.getPoliticianProfileUploadedImageUrlLarge(politicianWeVoteId);
      // console.log('onPoliticianStoreChange, politicianProfileUploadedImageUrlLarge:', politicianProfileUploadedImageUrlLarge, ', politicianProfileUploadedImageUrlLargePrior:', politicianProfileUploadedImageUrlLargePrior);
      if (politicianProfileUploadedImageUrlLarge !== politicianProfileUploadedImageUrlLargePrior) {
        this.setState({
          politicianProfileUploadedImageUrlLarge,
        });
        // Clear the substitute image
        if (politicianProfileUploadedImageUrlLarge && politicianProfileUploadedImageUrlLarge.length > 0) {
          const thumbnail = document.getElementById('cordova');
          if (thumbnail) {
            thumbnail.style.display = 'none';
            thumbnail.src = '';
          }
        }
      }
    }
  }

  onVoterStoreChange () {
    const { politicianWeVoteId } = this.props;
    if (!politicianWeVoteId) {
      const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
      // console.log('onVoterStoreChange, voterProfileUploadedImageUrlLarge:', voterProfileUploadedImageUrlLarge);
      this.setState({
        voterProfileUploadedImageUrlLarge,
      });
      // Clear the substitute image
      if (voterProfileUploadedImageUrlLarge && voterProfileUploadedImageUrlLarge.length > 0) {
        const thumbnail = document.getElementById('cordova');
        if (thumbnail) {
          thumbnail.style.display = 'none';
          thumbnail.src = '';
        }
      }
    }
  }

  convertImageToAcceptedFormat = async (type = 'image/png') => {
    // If the given type is not supported, convert the image to a PNG
    const img = document.querySelector('img[role="presentation"]');
    await img.decode();
    const w = img.width;
    const h = img.height;
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = this.canvas.toDataURL(type);
    ctx.clearRect(0, 0, w, h);
    return dataUrl;
  };

  clearThumbnail = () => {
    const thumbnail = document.querySelector('img#cordova');
    if (thumbnail) {
      thumbnail.style.display = 'none';
      thumbnail.src = '';
    }
  };

  preparePhotoForUpload = async (url) => {
    let dataUrl;
    const isDataUrl = url.startsWith('data:');
    if (!isDataUrl) {
      const res = await fetch(url);
      const blob = await res.blob();
      dataUrl = await this.readFileAsDataUrl(blob);
    } else {
      dataUrl = url;
    }
    let thumbnail;
    const { isWebApp } = this.state;
    if (isWebApp) {
      thumbnail = document.querySelector('img[role="presentation"]');
    } else {
      thumbnail = document.querySelector('img#cordova');
    }
    if (thumbnail) {
      thumbnail.style.display = 'inline';
      thumbnail.src = dataUrl;
    }
    const { politicianWeVoteId, onUpload } = this.props;
    if (politicianWeVoteId) {
      PoliticianActions.politicianPhotoQueuedToSave(dataUrl);
    } else {
      VoterActions.voterPhotoQueuedToSave(dataUrl);
    }
    if (onUpload) {
      onUpload(dataUrl);
    }
  };

  deleteYourPhoto = (buttonId) => {
    const { politicianWeVoteId } = this.props;
    if (politicianWeVoteId) {
      PoliticianActions.politicianPhotoDelete(politicianWeVoteId);
      PoliticianActions.politicianPhotoQueuedToSave(undefined);
    } else {
      VoterActions.voterPhotoDelete();
      VoterActions.voterPhotoQueuedToSave(undefined);
    }
    // Adding event data to dataLayer for Google Tag Manager
    const dataLayerObject = {
      event: 'action',
      actionDetails: {
        actionType: 'delete',
        buttonId,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
      pageDetails: getPageDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
    this.clearThumbnail();
  };

  readFileAsDataUrl = (file) => {
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
    return promise;
  };

  async cameraCallback (uri) {
    const { resolveLocalFileSystemURL } = window;
    resolveLocalFileSystemURL(uri, async (fileEntry) => {
      const entryUrl = fileEntry.toURL();
      await this.save(entryUrl);
    }, (err) => console.error('camera resolveLocalFileSystemURL error', err));
  }

  render () {
    renderLog('VoterPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, limitPhotoHeight, maxWidth, politicianWeVoteId } = this.props;
    const {
      dropzoneText, isWebApp, politicianProfileUploadedImageUrlLarge, showDropzoneIcon,
      voterProfileUploadedImageUrlLarge,
    } = this.state;
    let imageToDisplay = '';
    let initialFiles;
    if (politicianWeVoteId) {
      imageToDisplay = politicianProfileUploadedImageUrlLarge;
      if (politicianProfileUploadedImageUrlLarge && politicianProfileUploadedImageUrlLarge.length > 0) {
        initialFiles = [politicianProfileUploadedImageUrlLarge];
      }
    } else {
      imageToDisplay = voterProfileUploadedImageUrlLarge;
      if (voterProfileUploadedImageUrlLarge && voterProfileUploadedImageUrlLarge.length > 0) {
        initialFiles = [voterProfileUploadedImageUrlLarge];
      }
    }
    return (
      <OuterWrapper>
        <form onSubmit={(e) => e.preventDefault()}>
          <Wrapper>
            <ColumnFullWidth>
              {imageToDisplay ? (
                <VoterPhotoWrapper limitPhotoHeight={limitPhotoHeight}>
                  <VoterPhotoImage maxWidth={maxWidth} src={imageToDisplay} alt="Profile Photo" />
                  <DeleteLink
                    id="removePhotoLink"
                    className="u-link-color u-link-underline u-cursor--pointer"
                    onClick={() => this.deleteYourPhoto('removePhotoLink')}
                  >
                    remove photo
                  </DeleteLink>
                </VoterPhotoWrapper>
              ) : (
                <>
                  {isWebApp ? (
                    <DropzoneArea
                      acceptedFiles={['image/*']}
                      classes={showDropzoneIcon ? {
                        icon: classes.dropzoneIcon,
                        root: classes.dropzoneRoot,
                        text: classes.dropzoneText,
                      } : {
                        icon: classes.dropzoneIconHidden,
                        root: classes.dropzoneRoot,
                        text: classes.dropzoneText,
                      }}
                      dropzoneText={dropzoneText}
                      filesLimit={1}
                      Icon={AccountCircle}
                      initialFiles={initialFiles}
                      maxFileSize={20000000}
                      onChange={this.handleWebAppDrop}
                    />
                  ) : (
                    <>
                      <ChooseLink
                        id="choosePhotoLink"
                        className="u-link-color u-link-underline u-cursor--pointer"
                        onClick={this.handleCordovaDrop}
                      >
                        Choose Photo
                      </ChooseLink>
                      <img src="" id="cordova" alt="" />
                    </>
                  )}
                </>
              )}
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </OuterWrapper>
    );
  }
}
VoterPhotoUpload.propTypes = {
  classes: PropTypes.object,
  limitPhotoHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  onUpload: PropTypes.func,
  politicianWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneIconHidden: {
    display: 'none',
  },
  dropzoneRoot: {
    color: '#999',
    minHeight: '162px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
  dropzoneText: {
    color: '#818181',
    fontSize: '18px',
    fontFamily: "'Poppins', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const DeleteLink = styled('div')`
`;

const ChooseLink = styled('div')`
  margin: 0 0 20px 18px;
`;

const OuterWrapper = styled('div')`
  width: 100%;
`;

const VoterPhotoImage = styled('img', {
  shouldForwardProp: (prop) => !['maxWidth'].includes(prop),
})(({ maxWidth }) => (`
  border-radius: 100px;
  max-width: 100px;
  ${maxWidth ? `max-width: ${maxWidth}px;` : 'max-width: 200px;'}
`));

const VoterPhotoWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitPhotoHeight'].includes(prop),
})(({ limitPhotoHeight }) => (`
  align-items: center;
  display: flex;
  flex-direction: column;
  ${limitPhotoHeight ? 'height: 130px;' : ''}
  justify-content: flex-end;
  margin-bottom: 0;
  width: 100%;
`));

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  padding: 0 !important;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(VoterPhotoUpload);
