import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
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
import Confetti from 'react-confetti';

const BallotChoicesAndSettingsBody = React.lazy(() => import(/* webpackChunkName: 'BallotChoicesAndSettingsBody' */ './BallotChoicesAndSettingsBody'));



class BallotChoicesAndSettingsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showConfetti: false,
    };
  }

  componentDidMount() {
    // Show confetti when modal first mounts
    if (this.props.show) {
      this.setState({ showConfetti: true });
      setTimeout(() => {
        this.setState({ showConfetti: false });
      }, 5000);
    }
  }

  closeThisModal = () => {
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BALLOT_CHOICES_AND_SETTING_COMPLETED);
    this.props.toggleFunction(normalizedHref());
  };

//  BallotChoicesAndSettingsCompleted = () => {
    // Mark this, so we know to show 'Personalized Score Modal' as completed
//    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
//   this.props.toggleFunction(normalizedHref());
//  };

  render () {
    renderLog('BallotChoicesAndSettingsModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, show } = this.props;
    //console.log('Rendering with props from balloitchoice:', this.props);
    //console.log('Rendering with state balloitchoice:', this.state);

    if (!show) {
      return null;
    }
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={show}
        onClose={this.closeThisModal}
      >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {this.state.showConfetti && (
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={150}
              recycle={false}
              confettiSource={{x: 0, y: 0, w: window.innerWidth, h: 0}}
              colors={['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF7F50']}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1
              }}
            />
          </div>
        )}
        <ModalTitleArea>
          <Title>
            Your ballot choices and settings are saved
          </Title>
          <IconButtonWrapper>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closeThisModal}
              id="closeBallotChoicesAndSettingsModal"
              size="large"
            >
              <Close />
            </IconButton>
          </IconButtonWrapper>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Suspense fallback={<></>}>
            <BallotChoicesAndSettingsBody
              inModal
              // markBallotChoicesAndSettingsCompleted={this.markBallotChoicesAndSettingsCompleted} // Not needed here
              show={show}
              toggleFunction={this.props.toggleFunction}
            />
          </Suspense>
        </DialogContent>
      </div>
      </Dialog>
    );
  }
}
BallotChoicesAndSettingsModal.propTypes = {
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



export default withTheme(withStyles(styles)(BallotChoicesAndSettingsModal));
