import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Close } from '@material-ui/icons';
import { Dialog, DialogContent, IconButton } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import DragAndDrop from './DragAndDrop';

class ImageUploadModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      files: [],
    };
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop (files) {
    const fileList = this.state.files;
    for (let i = 0; i < files.length; i++) {
      if (!files[i].name) return;
      fileList.push(files[i].name);
    }
    this.setState({ files: fileList });
  }

  closeThisModal = () => {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('ImageUploadModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              Upload Image
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeImageUploadModal"
          >
            <Close />
          </IconButton>
        </ModalTitleArea>
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
  pathname: PropTypes.string,
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

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px 12px 0 24px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: flex;
`;

const Title = styled.h3`
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
  @media (max-width: 769px) {
    font-size: 18px;
  }
`;

const ExplanationText = styled.div`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 18px 0;
  padding: 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

const ExplanationTextLighter = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin: 24px 0 0 0;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

const ValuesListWrapper = styled.div`
`;

const ContinueButtonWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default withTheme(withStyles(styles)(ImageUploadModal));
