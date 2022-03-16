import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import VoterActions from '../../actions/VoterActions';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import VoterConstants from '../../constants/VoterConstants';

const PersonalizedScoreIntroBody = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroBody' */ './PersonalizedScoreIntroBody'));

class PersonalizedScoreIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  closeThisModal = () => {
    const { currentStep } = this.state;
    const currentStepCompletedThreshold = 7;
    if (currentStep >= currentStepCompletedThreshold) {
      // console.log('currentStepCompletedThreshold passed');
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    this.props.toggleFunction(normalizedHref());
  };

  personalizedScoreIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(normalizedHref());
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
              size="large"
            >
              <Close />
            </IconButton>
          </IconButtonWrapper>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Suspense fallback={<></>}>
            <PersonalizedScoreIntroBody
              inModal
              // markPersonalizedScoreIntroCompleted={this.markPersonalizedScoreIntroCompleted} // Not needed here
              show={show}
              toggleFunction={this.props.toggleFunction}
            />
          </Suspense>
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
    width: '100%',
    height: isCordova() ? '83%' : '90%',
    margin: '0 auto',
    padding: '0 !important',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    transitionDuration: '.25s',
    '@media (min-width: 400px)': {   // Doesn't work in cordova
      width: '90%',
      height: '83%',
    },
    '@media (min-width: 576px)': {
      width: '90%',
      height: '600px',
    },
  },
  dialogContent: {
    background: 'white',
  },
  closeButton: {
  },
});

const IconButtonWrapper = styled('div')`
  margin: 4px 0 12px 0;
`;

const ModalTitleArea = styled('div')`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
`;

const Title = styled('div')`
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
