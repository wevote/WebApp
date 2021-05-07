import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Close } from '@material-ui/icons';
import { Dialog, DialogContent, IconButton } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { hideZenDeskHelpVisibility, setZenDeskHelpVisibility } from '../../utils/applicationUtils';
import PersonalizedScoreIntroBody from './PersonalizedScoreIntroBody';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';

class PersonalizedScoreIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    if (this.props.show) {
      hideZenDeskHelpVisibility();
    } else {
      const { location: { pathname } } = window;
      setZenDeskHelpVisibility(pathname);
    }
  }

  componentWillUnmount () {
    const { location: { pathname } } = window;
    setZenDeskHelpVisibility(pathname);
  }

  closeThisModal = () => {
    const { location: { pathname } } = window;
    setZenDeskHelpVisibility(pathname);
    const { currentStep } = this.state;
    const currentStepCompletedThreshold = 7;
    if (currentStep >= currentStepCompletedThreshold) {
      // console.log('currentStepCompletedThreshold passed');
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    this.props.toggleFunction(pathname);
  };

  personalizedScoreIntroCompleted = () => {
    const { location: { pathname } } = window;
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(pathname);
  };

  render () {
    renderLog('PersonalizedScoreIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, show } = this.props;

    if (!show) {
      return null;
    }
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={show}
        onClose={this.closeThisModal}
      >
        <ModalTitleArea>
          <Title>
            What&apos;s a Personalized Score?
          </Title>
          <IconButtonWrapper>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closeThisModal}
              id="closePersonalizedScoreIntroModal"
            >
              <Close />
            </IconButton>
          </IconButtonWrapper>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <PersonalizedScoreIntroBody
            inModal
            // markPersonalizedScoreIntroCompleted={this.markPersonalizedScoreIntroCompleted} // Not needed here
            show={show}
            toggleFunction={this.props.toggleFunction}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
PersonalizedScoreIntroModal.propTypes = {
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
      height: '600px',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '90%',
    maxHeight: '90%',
    height: '90%',
    margin: '0 auto',
    padding: '0 !important',
  },
  dialogContent: {
    background: 'white',
  },
  closeButton: {
  },
});

const IconButtonWrapper = styled.div`
  margin: 4px 0 12px 0;
`;

const ModalTitleArea = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
`;

const Title = styled.div`
  color: black;
  font-size: 24px;
  font-weight: bold;
  margin: 0 12px;
  width: 100%;
  @media (max-width: 769px) {
    font-size: 16px;
  }
`;

export default withTheme(withStyles(styles)(PersonalizedScoreIntroModal));
