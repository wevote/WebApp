import { ContentCopy } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { formatDateMMMDoYYYY } from '../../common/utils/dateFormat';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import { ModalTitleType1 } from '../Style/ModalType1Styles';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import { openSnackbar } from '../Widgets/SnackNotifier';

const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ './MessageToFriendInputField'));

class ShareWithFriendsModalTitleWithController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      copyLinkCopied: false,
      electionDateInFutureFormatted: '',
      messageToFriendDefault: '',
      messageToFriendType: 'shareWithFriend', // Alternate is shareWithFriendAllOpinions
    };
  }

  componentDidMount () {
    console.log('ShareWithFriendsModalTitleWithController componentDidMount');
    // We expect this API call from ShareWithFriendsModalBodyWithController
    // if (apiCalming('friendListsAll', 5000)) {
    //   FriendActions.friendListsAll();
    // }
    this.setElectionDateInformation();
    this.onFriendStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    if (this.linkCopiedTimer) clearTimeout(this.linkCopiedTimer);
    if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setElectionDateInformation();
  }

  onFriendStoreChange () {
    const currentFriendListUnsorted = FriendStore.currentFriends();
    // console.log('onFriendStoreChange currentFriendListUnsorted:', currentFriendListUnsorted);
    const totalCurrentFriendListCount = currentFriendListUnsorted.length;
    this.setState({
      totalCurrentFriendListCount,
    });
  }

  copyLink = () => {
    // console.log('copyLink');
    openSnackbar({ message: 'Copied!' });
    this.setState({
      copyLinkCopied: true,
    });
    if (this.linkCopiedTimer) clearTimeout(this.linkCopiedTimer);
    this.linkCopiedTimer = setTimeout(() => {
      this.setState({
        copyLinkCopied: false,
      });
    }, 4000);
  }

  createMessageToFriendDefault = () => {
    const { shareModalStep } = this.props;
    const { electionDateInFutureFormatted } = this.state;
    const includingAllOpinions = stringContains('AllOpinions', shareModalStep);
    let shareBallotOnlyMessage = '';
    let shareWithAllOpinionsMessage = '';

    shareWithAllOpinionsMessage += "Here's my ballot for ";
    shareBallotOnlyMessage += 'Check out the ballot for ';

    let messageToFriendDefault = '';
    const messageToFriendType = includingAllOpinions ? 'shareWithFriendAllOpinions' : 'shareWithFriend';
    // const electionDayText = ElectionStore.getElectionDayText(VoterStore.electionId());
    const electionDayText = BallotStore.currentBallotElectionDate;
    let electionDateFound = false;
    const electionName = BallotStore.currentBallotElectionName;
    if (electionName) {
      shareWithAllOpinionsMessage += `the ${electionName}`;
      shareBallotOnlyMessage += `the ${electionName}`;
    } else {
      shareWithAllOpinionsMessage += 'the election';
      shareBallotOnlyMessage += 'the election';
    }

    if (electionDayText !== undefined && electionDateInFutureFormatted) {
      const daysUntilElection = daysUntil(electionDayText);
      if (daysUntilElection === 0) {
        // Election is today
        shareWithAllOpinionsMessage += ` today, ${electionDayText}`;
        shareBallotOnlyMessage += ` today, ${electionDayText}`;
        electionDateFound = true;
      } else if (daysUntilElection > 0) {
        shareWithAllOpinionsMessage += ` on ${electionDateInFutureFormatted}`;
        shareBallotOnlyMessage += ` on ${electionDateInFutureFormatted}`;
        electionDateFound = true;
      }
    }
    if (!electionDateFound) {
      // messageToFriendDefault += "I'm getting ready to vote.";
    }

    if (includingAllOpinions) {
      messageToFriendDefault = shareWithAllOpinionsMessage;
    } else {
      messageToFriendDefault = shareBallotOnlyMessage;
    }
    // console.log('ShareWithFriendsModalTitleWithController createMessageToFriendDefault:', messageToFriendDefault);
    this.setState({
      messageToFriendDefault,
      messageToFriendType,
    }, () => this.setMessageToFriendQueuedToSave());
  }

  setMessageToFriendQueuedToSave = () => {
    const { messageToFriendType } = this.state;
    const messageToFriendQueuedToSaveSetPreviously = FriendStore.getMessageToFriendQueuedToSaveSet(messageToFriendType);
    if (!messageToFriendQueuedToSaveSetPreviously) {
      // Only proceed if it hasn't already been set
      if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
      this.setMessageTimer = setTimeout(() => {
        const { messageToFriendDefault } = this.state;
        const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
        if (messageToFriendDefault !== messageToFriendQueuedToSave) {
          // If voter hasn't changed this, update this.
          FriendActions.messageToFriendQueuedToSave(messageToFriendDefault, messageToFriendType);
        }
      }, 500);
    }
  }

  setElectionDateInformation = () => {
    // const electionDayText = ElectionStore.getElectionDayText(VoterStore.electionId());
    const electionDayText = BallotStore.currentBallotElectionDate;
    const electionDateFormatted = formatDateMMMDoYYYY(electionDayText);
    let electionDateInFutureFormatted = '';
    if (electionDayText !== undefined && electionDateFormatted) {
      const daysUntilElection = daysUntil(electionDayText);
      if (daysUntilElection === 0) {
        // Election is today
        electionDateInFutureFormatted = electionDateFormatted;
      } else if (daysUntilElection > 0) {
        electionDateInFutureFormatted = electionDateFormatted;
      }
    }
    this.setState({
      electionDateInFutureFormatted,
    }, () => this.createMessageToFriendDefault());
  }

  render () {
    renderLog('ShareWithFriendsModalTitleWithController');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendsModalTitle, urlToShare } = this.props;
    const { copyLinkCopied, messageToFriendType, totalCurrentFriendListCount } = this.state;

    return (
      <ShareWithFriendsModalTitle>
        <ShareWithFriendsTop>
          <div className="full-width">
            <ModalTitleType1>
              {friendsModalTitle}
            </ModalTitleType1>
          </div>
        </ShareWithFriendsTop>
        <ShareWithFriendsTitleBottom>
          <div className="full-width">
            {totalCurrentFriendListCount > 0 && (
              <Suspense fallback={<></>}>
                <MessageToFriendInputField messageToFriendType={messageToFriendType} />
              </Suspense>
            )}
            {(urlToShare) && (
              <UrlToShareWrapper>
                <CopyToClipboard text={urlToShare} onCopy={this.copyLink}>
                  <CopyToClipboardInnerWrapper>
                    <UrlToShareInnerWrapper>
                      {urlToShare}
                    </UrlToShareInnerWrapper>
                    <ContentCopyWrapper>
                      <ContentCopy style={{ fontSize: 18, margin: '-3px 0 0 3px', color: '#999' }} />
                    </ContentCopyWrapper>
                    {copyLinkCopied && (
                      <CopiedText>
                        <span className="u-show-mobile">
                          Copied
                        </span>
                        <span className="u-show-desktop-tablet">
                          Copied to clipboard
                        </span>
                      </CopiedText>
                    )}
                  </CopyToClipboardInnerWrapper>
                </CopyToClipboard>
              </UrlToShareWrapper>
            )}
          </div>
        </ShareWithFriendsTitleBottom>
      </ShareWithFriendsModalTitle>
    );
  }
}
ShareWithFriendsModalTitleWithController.propTypes = {
  friendsModalTitle: PropTypes.string,
  shareModalStep: PropTypes.string,
  urlToShare: PropTypes.string,
};

const styles = () => ({
});

const ContentCopyWrapper = styled('div')`
  cursor: pointer;
`;

const CopiedText = styled('div')`
  color: black !important;
  cursor: pointer;
  font-size: 16px;
  font-weight: normal;
  margin-left: 8px;
`;

const CopyToClipboardInnerWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ShareWithFriendsModalTitle = styled('div')`
`;

const ShareWithFriendsTop = styled('div')`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  // padding: 10px 24px 0 24px;
  z-index: 999;
  display: flex;
`;

const ShareWithFriendsTitleBottom = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  z-index: 999;
  // @media (min-width: 769px) {
  //   border-bottom: 2px solid #f7f7f7;
  // }
`;

const UrlToShareInnerWrapper = styled('div')`
  color: #999;
  cursor: pointer;
  font-size: 16px;
`;

const UrlToShareWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  margin-left: 12px;
`;

export default withTheme(withStyles(styles)(ShareWithFriendsModalTitleWithController));
