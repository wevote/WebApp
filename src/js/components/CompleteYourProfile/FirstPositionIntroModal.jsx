import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import CandidateItem from '../Ballot/CandidateItem';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';

class FirstPositionIntroModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      actionButtonText: 'Show Personalized Score',
      explanationText: 'For every candidate on your ballot, we add up the opinions of the people you trust.',
      pathname: '',
    };
  }

  componentDidMount () {
    // this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // FriendActions.currentFriends();

    this.setState({
      pathname: this.props.pathname,
    });
  }

  componentWillUnmount () {
    // this.friendStoreListener.remove();
  }

  // onFriendStoreChange () {
  //   const { currentFriendsList } = this.state;
  //   if (currentFriendsList.length !== FriendStore.currentFriends().length) {
  //     this.setState({ currentFriendsList: FriendStore.currentFriends() });
  //   }
  // }

  closeThisModal = () => {
    this.props.toggleFunction(this.state.pathname);
  }

  personalizedScoreIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(this.state.pathname);
  }

  clickNextStepButton = () => {
    const { openAdviserDetailsButtonClicked, personalizedScoreModalButtonClicked, personalizedScoreButtonClicked } = this.state;
    if (openAdviserDetailsButtonClicked) {
      this.setState({
        explanationText: 'Success! Now you know what a personalized score is.',
        hideNextStepButton: true,
      });
    } else if (personalizedScoreModalButtonClicked) {
      this.setState({
        actionButtonText: 'Next',
        explanationText: 'Click on any trusted adviser to see why they are part of your personalized score.',
        // Buttons clicked
        openAdviserDetailsButtonClicked: true,
        // Results
        openAdviserDetails: true,
        openPersonalizedScoreModal: true,
        showPersonalizedScoreArrow: false,
      });
    } else if (personalizedScoreButtonClicked) {
      this.setState({
        actionButtonText: 'Show Adviser Details',
        explanationText: 'These are examples of trusted advisers.',
        // Buttons clicked
        personalizedScoreModalButtonClicked: true,
        // Results
        openAdviserDetails: false,
        openPersonalizedScoreModal: true,
        showPersonalizedScoreArrow: false,
      });
    } else {
      this.setState({
        actionButtonText: 'Show Score Details',
        explanationText: 'We put an example personalized score of +3 in this green box.',
        // Buttons clicked
        personalizedScoreButtonClicked: true,
        // Results
        openAdviserDetails: false,
        openPersonalizedScoreModal: false,
        showPersonalizedScoreArrow: true,
      });
    }
  }

  render () {
    renderLog('FirstPositionIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { actionButtonText, explanationText, hideNextStepButton, showPersonalizedScoreArrow } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              Choose Your First Candidate
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeFirstPositionIntroModal"
          >
            <CloseIcon />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationText>
              {explanationText}
            </ExplanationText>
            <ActionButtonWrapper>
              <ActionButtonInsideWrapper>
                {!hideNextStepButton && (
                  <Button
                    classes={{ root: classes.actionButtonRoot }}
                    color="primary"
                    id="showPersonalizedScoreButton"
                    onClick={this.clickNextStepButton}
                    variant="contained"
                  >
                    <div className="u-no-break">
                      {actionButtonText}
                    </div>
                  </Button>
                )}
              </ActionButtonInsideWrapper>
            </ActionButtonWrapper>
            <section className="card">
              <CandidateItem
                candidateWeVoteId="candidateAlexanderHamilton"
                hideBallotItemSupportOpposeComment
                hideCandidateText
                hideCandidateUrl
                hideIssuesRelatedToCandidate
                hideShowMoreFooter
                showDownArrow={showPersonalizedScoreArrow}
                showLargeImage
                showOfficeName
              />
            </section>
            <ExplanationTextLighter>
              Your personalized score is the number of friends (or advisers you follow) who support a candidate, minus the number who oppose.
            </ExplanationTextLighter>
            <ContinueButtonWrapper>
              <Button
                classes={{ root: classes.continueButtonRoot }}
                color="primary"
                disabled={!hideNextStepButton}
                id="howItWorksNext"
                onClick={this.personalizedScoreIntroCompleted}
                variant="contained"
              >
                Continue
              </Button>
            </ContinueButtonWrapper>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
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
    // display: 'flex',
    // justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  actionButtonRoot: {
    margin: 'auto',
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
  margin: 6px 0 12px 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

const ActionButtonWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActionButtonInsideWrapper = styled.div`
`;

const ExplanationTextLighter = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding-top: 24px;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

const ContinueButtonWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default withTheme(withStyles(styles)(FirstPositionIntroModal));
