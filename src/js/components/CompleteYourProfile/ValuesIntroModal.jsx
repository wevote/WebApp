import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import IssueActions from '../../actions/IssueActions';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';

const FriendInvitationOnboardingValuesList = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationOnboardingValuesList' */ '../Values/FriendInvitationOnboardingValuesList'));

class ValuesIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      atLeastOneValueChosen: false,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());

    this.setState({
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const issueWeVoteIdsVoterIsFollowing = IssueStore.getIssueWeVoteIdsVoterIsFollowing() || [];
    this.setState({
      atLeastOneValueChosen: !!(issueWeVoteIdsVoterIsFollowing.length),
    });
  }

  closeThisModal = () => {
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  valuesIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    const { location: { pathname } } = window;
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.VALUES_INTRO_COMPLETED);
    this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('ValuesIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { atLeastOneValueChosen } = this.state;
    const { location: { pathname } } = window;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              What do you care about?
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeValuesIntroModal"
            size="large">
            <Close />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationTextLighter>
              When you follow a value, the endorsements from all organizations categorized under that value are added to your personalized score.
            </ExplanationTextLighter>
            <ExplanationText>
              Choose from some popular options:
            </ExplanationText>
            <ValuesListWrapper id="valuesIntroModalValueList">
              <Suspense fallback={<></>}>
                <FriendInvitationOnboardingValuesList
                  displayOnlyIssuesNotFollowedByVoter
                />
              </Suspense>
            </ValuesListWrapper>
            <ContinueButtonWrapper>
              <Button
                classes={{ root: classes.continueButtonRoot }}
                color="primary"
                disabled={!atLeastOneValueChosen}
                id="valuesIntroModalNext"
                onClick={this.valuesIntroCompleted}
                variant="contained"
              >
                Got It!
              </Button>
            </ContinueButtonWrapper>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
ValuesIntroModal.propTypes = {
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
    margin: '0 auto',
    paddingBottom: '24px',
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
const ModalTitleArea = styled('div')`
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

const Title = styled('h3')`
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
  @media (max-width: 769px) {
    font-size: 18px;
  }
`;

const ExplanationText = styled('div')`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 18px 0;
  padding: 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

const ExplanationTextLighter = styled('div')`
  font-size: 14px;
  font-weight: 400;
  margin: 24px 0 0 0;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

const ValuesListWrapper = styled('div')`
`;

const ContinueButtonWrapper = styled('div')`
  width: 100%;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default withTheme(withStyles(styles)(ValuesIntroModal));
