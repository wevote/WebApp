import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import VoterActions from '../../actions/VoterActions';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import { ContinueButtonType1Wrapper, ModalTitleType1, ModalTitleAreaType1 } from '../Style/ModalType1Styles';
import VoterConstants from '../../constants/VoterConstants';

const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ '../Ballot/CandidateItem'));

class FirstPositionIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      explanationText: 'Please click the "CHOOSE" or "OPPOSE" button.',
    };
  }

  closeThisModal = () => {
    this.props.toggleFunction(normalizedHref());
  };

  personalizedScoreIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(normalizedHref());
  };

  // clickNextStepButton = () => {
  //   const { openAdviserDetailsButtonClicked, personalizedScoreModalButtonClicked, personalizedScoreButtonClicked } = this.state;
  //   if (openAdviserDetailsButtonClicked) {
  //     this.setState({
  //       explanationText: 'Success! Now you know what a personalized score is.',
  //       hideNextStepButton: true,
  //     });
  //   } else if (personalizedScoreModalButtonClicked) {
  //     this.setState({
  //       /* actionButtonText: 'Next', */
  //       explanationText: 'Click on any trusted adviser to see why they are part of your personalized score.',
  //       // Buttons clicked
  //       openAdviserDetailsButtonClicked: true,
  //       // Results
  //       /* openAdviserDetails: true,
  //       openPersonalizedScoreModal: true, */
  //       showPersonalizedScoreArrow: false,
  //     });
  //   } else if (personalizedScoreButtonClicked) {
  //     this.setState({
  //       /* actionButtonText: 'Show Adviser Details', */
  //       explanationText: 'These are examples of trusted advisers.',
  //       // Buttons clicked
  //       personalizedScoreModalButtonClicked: true,
  //       // Results
  //       /* openAdviserDetails: false,
  //       openPersonalizedScoreModal: true, */
  //       showPersonalizedScoreArrow: false,
  //     });
  //   } else {
  //     this.setState({
  //       /* actionButtonText: 'Show Score Details', */
  //       explanationText: 'We put an example personalized score of +3 in this green box.',
  //       // Buttons clicked
  //       personalizedScoreButtonClicked: true,
  //       // Results
  //       /* openAdviserDetails: false,
  //       openPersonalizedScoreModal: false, */
  //       showPersonalizedScoreArrow: true,
  //     });
  //   }
  // };

  render () {
    renderLog('FirstPositionIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { /* actionButtonText */ explanationText, hideNextStepButton, showPersonalizedScoreArrow } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(normalizedHref()); }}
      >
        <ModalTitleAreaType1>
          <div>
            <ModalTitleType1>
              Choose Your First Candidate
            </ModalTitleType1>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeFirstPositionIntroModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaType1>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationText>
              {explanationText}
            </ExplanationText>
            <section className="card">
              <Suspense fallback={<></>}>
                <CandidateItem
                  inModal
                  candidateWeVoteId="candidateAlexanderHamilton"
                  // hideBallotItemSupportOpposeComment
                  hideCandidateText
                  hideCandidateUrl
                  hideIssuesRelatedToCandidate
                  hideShowMoreFooter
                  showDownArrow={showPersonalizedScoreArrow}
                  showLargeImage
                  showOfficeName
                  showPositionStatementActionBar
                  // showPositionPublicToggle={false}
                  // hidePositionPublicToggle
                />
              </Suspense>
            </section>
            <ExplanationTextLighter>
              Your personalized score is the number of friends (or advisers you follow) who support a candidate, minus the number who oppose.
            </ExplanationTextLighter>
            <ContinueButtonType1Wrapper>
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
            </ContinueButtonType1Wrapper>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
FirstPositionIntroModal.propTypes = {
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
    padding: '0 24px 24px 24px',
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

const ExplanationText = styled('div')`
  color: #2e3c5d;
  font-size: 16px;
  font-weight: 500;
  margin: 6px 0 12px 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

const ExplanationTextLighter = styled('div')`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding-top: 24px;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
  margin-bottom: 12px;
`;

export default withTheme(withStyles(styles)(FirstPositionIntroModal));
