import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { ModalTitleType1, ModalTitleAreaType1 } from '../Style/ModalType1Styles';
import DragAndDrop from './DragAndDrop';

class ImageUploadModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      files: [],
    };
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop (droppedFiles) {
    const { files: { fileList = []} } = this.state;
    for (let i = 0; i < droppedFiles.length; i++) {
      if (!droppedFiles[i].name) return;
      fileList.push(droppedFiles[i].name);
    }
    this.setState({ files: fileList });
  }

  closeThisModal = () => {
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('ImageUploadModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;


    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
      >
        <ModalTitleAreaType1>
          <div>
            <ModalTitleType1>
              Upload Image
            </ModalTitleType1>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeImageUploadModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaType1>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            {this.state.files.length > 0 ? (
              <img src={this.state.files[0]} style={{ width: '100%' }} />
            ) : (
              <DragAndDrop handleDrop={this.handleDrop} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
ImageUploadModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 0 64px 0',
  },
  dialogContent: {
    padding: '32px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  continueButtonRoot: {
    width: '100%',
  },
});

export default withTheme(withStyles(styles)(ImageUploadModal));
