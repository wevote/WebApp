import { AccountCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import { heicTo, isHeic } from 'heic-to';
import { DropzoneArea } from 'mui-file-dropzone';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import VoterActions from '../../../actions/VoterActions';
import VoterStore from '../../../stores/VoterStore';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { getPageDetails } from '../../../utils/lookupPageNameAndPageTypeDict';

class VoterPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDropzoneIcon: true,
      voterProfileUploadedImageUrlLarge: '',
    };

    this.handleWebAppDrop = this.handleWebAppDrop.bind(this);
    this.handleCordovaDrop = this.handleCordovaDrop.bind(this);
  }

  componentDidMount () {
    // console.log('VoterPhotoUpload, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();

    const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
    let showDropzoneIcon = true;
    if (voterProfileUploadedImageUrlLarge) {
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new profile photo here (or click to find file)';
      showDropzoneIcon = false;
    }
    this.setState({
      dropzoneText,
      showDropzoneIcon,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    // TODO Figure out how to add fileReader.removeEventListener
  }

  async handleWebAppDrop (files) {
    const { voterProfileUploadedImageUrlLarge } = this.state;
    if (files && files[0]) {
      this.props.onUpload('UPLOADED');
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      if (await isHeic(fileFromDropzone)) {
        const blobJpegFromDropzone = await heicTo({
          blob: fileFromDropzone,
          type: 'image/jpeg',
          quality: 0.5,
        });
        this.insertBlobInDom(blobJpegFromDropzone);   // Hack only needed for HEIC
        await this.saveTheBlob(blobJpegFromDropzone);
      } else {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
          const photoFromFileReader = fileReader.result;
          // data:image/jpeg;base64,9j/4Qo2RXhpZgAATU0AKgAAAAgADQEPAAIAAAAGAAAAqgEQAAIAAAASAAAAsAESAAMAAAABAAEAAAEaAAUAAAABAAAAwgEbAAUAAAABAAAAygEoAAMAAAABAAIAAAExAAIAAAAFAAAA0gEyAAIAAAAUAAAA2AE8AAIAAAASAAAA7AFCAAQAAAABAA
          VoterActions.voterPhotoQueuedToSave(photoFromFileReader);
        });
        fileReader.readAsDataURL(fileFromDropzone);
      }
      // console.log('fileFromDropzone:', fileFromDropzone);
      const dropzoneText = isMobileScreenSize() ? 'A small preview of your photo is shown below. You can: 1) Click button below to continue, or 2) click here to upload different photo.' : 'A small preview of your photo is shown below. You can: 1) click button below to continue, 2) delete it (hover over photo to see trash can), or 3) drag a NEW version here (or click here to find file).';
      this.setState({
        dropzoneText,
        showDropzoneIcon: false,
      });
    } else {
      let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
      let showDropzoneIcon = true;
      if (voterProfileUploadedImageUrlLarge) {
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
    getPicture(async (pictureUrl) => this.cameraCallback(pictureUrl), (err) => console.log(err), {
      destinationType: FILE_URI,
      sourceType: PHOTOLIBRARY,
      popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, ARROW_ANY, 300, 600),
    });
  }

  onVoterStoreChange () {
    const voterProfileUploadedImageUrlLarge = VoterStore.getVoterProfileUploadedImageUrlLarge();
    this.setState({
      voterProfileUploadedImageUrlLarge,
    });
    if (voterProfileUploadedImageUrlLarge && voterProfileUploadedImageUrlLarge.length > 0) {
      const image = document.getElementById('chosenImage');
      image.style.display = 'none';
      image.src = '';   // Clear the substitute image for Cordova
    }
  }

  submitDeleteYourPhoto = (buttonId) => {
    VoterActions.voterPhotoDelete();
    VoterActions.voterPhotoQueuedToSave(undefined);
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

    const image = document.getElementById('chosenImage');
    image.style.display = 'none';
    image.src = '';   // Clear the substitute image for Cordova
  };

  insertBlobInDom (blobJpeg) {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      // The result will be a Data URL string
      const base64String = fileReader.result;
      const elem = document.querySelectorAll('img[role="presentation"]');
      if (elem && elem.length > 0) {
        elem[0].display = 'inline';
        elem[0].src = base64String;
      }
    });
    fileReader.readAsDataURL(blobJpeg);
  }

  async cameraCallback (uri) {
    const { resolveLocalFileSystemURL } = window;
    resolveLocalFileSystemURL(uri, (fileEntry) => {
      const image = document.getElementById('chosenImage');
      // app://localhost/_app_file_/Users/stevepodell/Library/Developer/CoreSimulator/Devices/42B70AFF-9963-4BA1-81A7-807966BC22E3/data/Containers/Data/Application/FD844A5A-D4AD-4E38-80B6-7C1345F8486B/tmp/cdv_photo_1750440590.jpg
      const entryURL = fileEntry.toURL();
      image.style.display = 'inline';
      image.src = entryURL;
      this.saveTheFile(entryURL);
    }, (err) => console.error('camera resolveLocalFileSystemURL error', err));
  }

  async saveTheBlob (imageBlob) {
    const reader = new FileReader();   // HTML5 FileReader
    this.props.onUpload('UPLOADED');
    reader.onload = (evt) => {
      const fileString = evt.target.result;
      // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIA...
      // console.log('photoFromFileReader cordova:', fileString);
      const image = document.getElementById('chosenImage');
      if (isCordova()) {
        image.style.display = 'inline';
        image.src = fileString;
      }
      VoterActions.voterPhotoQueuedToSave(fileString);
    };
    reader.readAsDataURL(imageBlob);
  }

  // pictureURL:  file:///Users/stevepodell/Library/Developer/CoreSimulator/Devices/42B70AFF-9963-4BA1-81A7-807966BC22E3/data/Containers/Data/Application/F5C07F62-181E-467D-9200-E5B2F2248C90/tmp/cdv_photo_1750439639.jpg
  async saveTheFile (pictureUrl) {
    // console.log('saveTheFile: ', pictureUrl);   // URL
    const response = await fetch(pictureUrl);   // Response stream
    const imageBlob = await response.blob();    // Get the blob
    await this.saveTheBlob(imageBlob);
    this.props.onUpload('UPLOADED');
  }

  render () {
    renderLog('VoterPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, limitPhotoHeight, maxWidth } = this.props;
    const { dropzoneText, showDropzoneIcon, voterProfileUploadedImageUrlLarge } = this.state;
    return (
      <OuterWrapper>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {/* eslint-disable-next-line no-nested-ternary */}
              {voterProfileUploadedImageUrlLarge ? (
                <VoterPhotoWrapper limitPhotoHeight={limitPhotoHeight}>
                  <VoterPhotoImage maxWidth={maxWidth} src={voterProfileUploadedImageUrlLarge} alt="Profile Photo" />
                  <DeleteLink
                    id="removePhotoLink"
                    className="u-link-color u-link-underline u-cursor--pointer"
                    onClick={() => this.submitDeleteYourPhoto('removePhotoLink')}
                  >
                    remove photo
                  </DeleteLink>
                </VoterPhotoWrapper>
              ) : isWebApp() ? (
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
                  initialFiles={voterProfileUploadedImageUrlLarge ? [voterProfileUploadedImageUrlLarge] : undefined}
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
                </>
              )}
              <img src="" id="chosenImage" alt="" />
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
