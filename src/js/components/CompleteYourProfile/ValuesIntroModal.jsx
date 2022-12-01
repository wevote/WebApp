import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import IssueActions from '../../actions/IssueActions';
import VoterActions from '../../actions/VoterActions';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { ContinueButtonType1Wrapper, ExplanationTextType1, ExplanationTextLighterType1, ModalTitleType1, ModalTitleAreaType1 } from '../Style/ModalType1Styles';
import VoterConstants from '../../constants/VoterConstants';
import IssueStore from '../../stores/IssueStore';

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
    IssueActions.issuesFollowedRetrieve();

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
    // Mark this, so we know to show 'Interests' in CompleteYourProfile as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.VALUES_INTRO_COMPLETED);
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  valuesIntroCompleted = () => {
    // Mark this, so we know to show 'Interests' in CompleteYourProfile as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.VALUES_INTRO_COMPLETED);
    const { location: { pathname } } = window;
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
        <ModalTitleAreaType1>
          <ModalTitleType1>
            {/* What do you care about? */}
          </ModalTitleType1>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeValuesIntroModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaType1>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationTextLighterType1>
              When you follow a value, the endorsements from all organizations categorized under that value are added to your personalized score.
            </ExplanationTextLighterType1>
            <ExplanationTextType1>
              Choose from some popular options:
            </ExplanationTextType1>
            <ValuesListWrapper id="valuesIntroModalValueList">
              <Suspense fallback={<></>}>
                <FriendInvitationOnboardingValuesList />
              </Suspense>
            </ValuesListWrapper>
            <ContinueButtonType1Wrapper>
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
            </ContinueButtonType1Wrapper>
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
      margin: '15px',
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
    paddingBottom: '24px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    margin: '15px',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  continueButtonRoot: {
    width: '100%',
  },
});

const ValuesListWrapper = styled('div')`
  margin: 15px;
`;

export default withTheme(withStyles(styles)(ValuesIntroModal));
