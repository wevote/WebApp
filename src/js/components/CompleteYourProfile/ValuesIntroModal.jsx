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
import FriendInvitationOnboardingValuesList from '../Values/FriendInvitationOnboardingValuesList';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';

class ValuesIntroModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      atLeastOneValueChosen: false,
      pathname: '',
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.issuesFollowedRetrieve();

    this.setState({
      pathname: this.props.pathname,
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
    this.props.toggleFunction(this.state.pathname);
  }

  valuesIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.VALUES_INTRO_COMPLETED);
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('ValuesIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { atLeastOneValueChosen } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
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
          >
            <CloseIcon />
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
              <FriendInvitationOnboardingValuesList
                displayOnlyIssuesNotFollowedByVoter
              />
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

export default withTheme(withStyles(styles)(ValuesIntroModal));
