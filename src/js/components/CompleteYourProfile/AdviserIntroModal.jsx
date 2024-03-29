import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { ModalTitleType1, ModalTitleAreaType1 } from '../Style/ModalType1Styles';

class AdviserIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  closeThisModal = () => {
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('AdviserIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
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
              Choose Your First Adviser
            </ModalTitleType1>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeAdviserIntroModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaType1>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationText>
              We take what the people you trust think, and calculate your personalized score for each candidate.
            </ExplanationText>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
AdviserIntroModal.propTypes = {
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
    margin: '0 auto',
  },
  dialogContent: {
    padding: '0 12px 24px 24px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
});


const ExplanationText = styled('div')`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  padding: 6px 0 0 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

export default withTheme(withStyles(styles)(AdviserIntroModal));
