import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import { renderLog } from '../../common/utils/logging';
import removeTwitterNameFromDescription from '../../common/utils/removeTwitterNameFromDescription';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import Avatar from '../Style/avatarStyles';
import {
  CancelButtonWrapper, FriendButtonWithStatsWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons,
  FriendDisplayDesktopButtonsWrapper, FriendDisplayOuterWrapper, smallButtonIfNeeded,
  ToRightOfPhotoContentBlock, ToRightOfPhotoTopRow, ToRightOfPhotoWrapper,
} from '../Style/friendStyles';
import FriendDetails from './FriendDetails';
import FriendLocationDisplay from './FriendLocationDisplay';
import SuggestedFriendToggle from './SuggestedFriendToggle';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class SuggestedFriendDisplayForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationByEmailSent: false,
      ignoreSuggestedFriendSent: false,
      ignoreVoterContactSent: false,
    };
  }

  friendInvitationByEmailSend = () => {
    const { askMode, emailAddressForDisplay, remindMode } = this.props;
    let messageToFriendType = 'inviteFriend'; // default
    if (askMode) {
      messageToFriendType = 'askFriend';
    } else if (remindMode) {
      messageToFriendType = 'remindContacts';
    }
    // console.log('SuggestedFriendDisplayForList friendInvitationByEmailSend');
    const emailAddressArray = '';
    const firstNameArray = '';
    const lastNameArray = '';
    const invitationMessage = FriendStore.getMessageToFriendQueuedToSave(messageToFriendType);
    const senderEmailAddress = VoterStore.getVoterEmail();
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray, lastNameArray, emailAddressForDisplay, invitationMessage, senderEmailAddress);
    this.setState({
      friendInvitationByEmailSent: true,
    });
  }

  primaryActionSend = () => {
    const { emailAddressForDisplay, remindMode } = this.props;
    if (remindMode) {
      this.contactReminderSend();
    } else if (emailAddressForDisplay) {
      this.friendInvitationByEmailSend();
    }
  }

  contactReminderSend () {
    const {
      emailAddressForDisplay: emailAddressText,
      voterDisplayName: otherVoterDisplayName,
      voterFirstName: otherVoterFirstName,
      voterLastName: otherVoterLastName,
      voterWeVoteId: otherVoterWeVoteId,
    } = this.props;
    const hostname = AppObservableStore.getHostname();
    const destinationFullUrl = `https://${hostname}/`; // We must provide a destinationFullUrl, so we know what hostname to use in sharedItemRetrieve
    const sharedMessage = FriendStore.getMessageToFriendQueuedToSave('remindContacts');
    ShareActions.sharedItemSaveRemindContact(destinationFullUrl, emailAddressText, otherVoterWeVoteId, sharedMessage, otherVoterDisplayName, otherVoterFirstName, otherVoterLastName);
    this.setState({
      friendInvitationByEmailSent: true,
    });
  }

  ignoreSuggestedFriend (voterWeVoteId) {
    FriendActions.ignoreSuggestedFriend(voterWeVoteId);
    this.setState({
      ignoreSuggestedFriendSent: true,
    });
  }

  ignoreVoterContact (emailAddressText, voterWeVoteId = '') {
    VoterActions.voterContactIgnore(emailAddressText, voterWeVoteId);
    this.setState({
      ignoreVoterContactSent: true,
      stopIgnoringVoterContactSent: false,
    });
  }

  stopIgnoringVoterContact (emailAddressText, voterWeVoteId = '') {
    VoterActions.voterContactStopIgnoring(emailAddressText, voterWeVoteId);
    this.setState({
      ignoreVoterContactSent: false,
      stopIgnoringVoterContactSent: true,
    });
  }

  render () {
    renderLog('SuggestedFriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      askMode,
      cityForDisplay,
      classes,
      emailAddressForDisplay,
      indicateIfAlreadyOnWeVote,
      inSideColumn,
      linkedOrganizationWeVoteId,
      mutualFriendCount,
      mutualFriendPreviewList,
      positionsTaken,
      previewMode,
      remindMode,
      stateCodeForDisplay,
      voterContactIgnored,
      voterDisplayName,
      voterEmailAddress,
      voterGuideLinkOn,
      voterWeVoteId: otherVoterWeVoteId,
      voterPhotoUrlLarge,
      voterTwitterDescription,
      voterTwitterHandle,
    } = this.props;
    const { friendInvitationByEmailSent, ignoreSuggestedFriendSent, ignoreVoterContactSent, stopIgnoringVoterContactSent } = this.state;

    const twitterDescription = voterTwitterDescription || '';
    // If the voterDisplayName is in the voterTwitterDescription, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const detailsHTML = (
      <FriendDetails
        emailAddressForDisplay={emailAddressForDisplay}
        indicateIfAlreadyOnWeVote={indicateIfAlreadyOnWeVote}
        inSideColumn={inSideColumn}
        mutualFriendCount={mutualFriendCount}
        mutualFriendPreviewList={mutualFriendPreviewList}
        positionsTaken={positionsTaken}
        remindMode={remindMode}
        twitterDescriptionMinusName={twitterDescriptionMinusName}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
        voterWeVoteId={otherVoterWeVoteId}
      />
    );
    const friendButtonsExist = true;
    const useSimpleLinkForIgnore = true;
    const voterContactIsIgnored = (ignoreVoterContactSent || voterContactIgnored) && !stopIgnoringVoterContactSent;
    const friendButtonsWrapperHtml = (
      <FriendButtonsWrapper inSideColumn={inSideColumn}>
        <SuggestedFriendSettingsWrapper>
          {(otherVoterWeVoteId && !remindMode) ? (
            <SuggestedFriendToggle
              askMode={askMode}
              inSideColumn={inSideColumn}
              otherVoterWeVoteId={otherVoterWeVoteId}
            />
          ) : (
            <Button
              color="primary"
              disabled={friendInvitationByEmailSent || voterContactIsIgnored}
              fullWidth
              onClick={() => this.primaryActionSend()}
              type="button"
              variant={(voterContactIsIgnored) ? 'outlined' : 'contained'}
            >
              {askMode ? (
                <span className="u-no-break">
                  {friendInvitationByEmailSent ? 'Sent' : 'Ask'}
                </span>
              ) : (
                <>
                  {remindMode ? (
                    <span className="u-no-break">
                      {friendInvitationByEmailSent ? 'Reminder sent' : 'Send reminder'}
                    </span>
                  ) : (
                    <span className="u-no-break">
                      {friendInvitationByEmailSent ? 'Invite sent' : 'Add friend'}
                    </span>
                  )}
                </>
              )}
            </Button>
          )}
        </SuggestedFriendSettingsWrapper>
        <CancelButtonWrapper inSideColumn={inSideColumn}>
          {(otherVoterWeVoteId && !remindMode) ? (
            <Button
              classes={useSimpleLinkForIgnore ? { root: classes.simpleLink } : { root: classes.ignoreButton }}
              color="primary"
              fullWidth
              onClick={() => this.ignoreSuggestedFriend(otherVoterWeVoteId)}
              type="button"
              variant={useSimpleLinkForIgnore ? undefined : 'outlined'}
              style={smallButtonIfNeeded()}
            >
              {ignoreSuggestedFriendSent ? 'Ignored' : 'Ignore'}
            </Button>
          ) : (
            <Button
              classes={useSimpleLinkForIgnore ? { root: classes.simpleLink } : { root: classes.ignoreButton }}
              color="primary"
              fullWidth
              onClick={(voterContactIsIgnored) ? () => this.stopIgnoringVoterContact(emailAddressForDisplay, otherVoterWeVoteId) : () => this.ignoreVoterContact(emailAddressForDisplay, otherVoterWeVoteId)}
              type="button"
              variant={useSimpleLinkForIgnore ? undefined : 'outlined'}
              style={smallButtonIfNeeded()}
            >
              {(voterContactIsIgnored) ? 'Ignored' : 'Ignore'}
            </Button>
          )}
        </CancelButtonWrapper>
      </FriendButtonsWrapper>
    );
    const friendButtonsWithStatsHtml = (
      <FriendButtonWithStatsWrapper>
        <div>
          {friendButtonsWrapperHtml}
        </div>
        {/*
        <ReminderSentText>
          Reminder sent 10 days ago
        </ReminderSentText>
        */}
      </FriendButtonWithStatsWrapper>
    );

    const suggestedFriendHtml = (
      <FriendDisplayOuterWrapper inSideColumn={inSideColumn}/* previewMode={previewMode} */>
        <FriendColumnWithoutButtons>
          <Avatar inSideColumn={inSideColumn}>
            {(voterGuideLinkOn && voterGuideLink) ? (
              <Link to={voterGuideLink} className="u-no-underline">
                <Suspense fallback={<></>}>
                  <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />
                </Suspense>
              </Link>
            ) : (
              <span>
                <Suspense fallback={<></>}>
                  <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />
                </Suspense>
              </span>
            )}
          </Avatar>
          <ToRightOfPhotoWrapper>
            <ToRightOfPhotoTopRow>
              <ToRightOfPhotoContentBlock>
                <div className="full-width">
                  {(voterGuideLinkOn && voterGuideLink) ? (
                    <Link to={voterGuideLink} className="u-no-underline">
                      {detailsHTML}
                    </Link>
                  ) : (
                    <>
                      {detailsHTML}
                    </>
                  )}
                </div>
              </ToRightOfPhotoContentBlock>
              <FriendLocationDisplay cityForDisplay={cityForDisplay} stateCodeForDisplay={stateCodeForDisplay} />
            </ToRightOfPhotoTopRow>
            {friendButtonsExist && (
              <div className="u-show-mobile">
                {friendButtonsWithStatsHtml}
              </div>
            )}
          </ToRightOfPhotoWrapper>
        </FriendColumnWithoutButtons>
        {friendButtonsExist && (
          <FriendDisplayDesktopButtonsWrapper className="u-show-desktop-tablet">
            {friendButtonsWithStatsHtml}
          </FriendDisplayDesktopButtonsWrapper>
        )}
      </FriendDisplayOuterWrapper>
    );

    if (previewMode) {
      return <span>{suggestedFriendHtml}</span>;
    } else {
      return (
        <SuggestedFriendDisplayForListWrapper key={`suggestedFriendDisplayForListWrapper-${otherVoterWeVoteId}`}>
          {suggestedFriendHtml}
        </SuggestedFriendDisplayForListWrapper>
      );
    }
  }
}
SuggestedFriendDisplayForList.propTypes = {
  askMode: PropTypes.bool,
  cityForDisplay: PropTypes.string,
  classes: PropTypes.object,
  indicateIfAlreadyOnWeVote: PropTypes.bool,
  emailAddressForDisplay: PropTypes.string,
  inSideColumn: PropTypes.bool,
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriendCount: PropTypes.number,
  mutualFriendPreviewList: PropTypes.array,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  remindMode: PropTypes.bool,
  stateCodeForDisplay: PropTypes.string,
  voterContactIgnored: PropTypes.bool,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterFirstName: PropTypes.string,
  voterLastName: PropTypes.string,
  voterGuideLinkOn: PropTypes.bool,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterDescription: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

const styles = {
  ignoreButton: {
    minWidth: 92,
  },
  simpleLink: {
    boxShadow: 'none !important',
    color: '#4371cc',
    textTransform: 'none',
    width: 64,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

// const ReminderSentText = styled('div')`
//   // color: #808080;
//   // font-weight: bold;
//   margin-top: 4px;
// `;

const SuggestedFriendDisplayForListWrapper = styled('div')`
  width: 100%;
`;

const SuggestedFriendSettingsWrapper = styled('div')`
  width: fit-content;
`;

export default withStyles(styles)(SuggestedFriendDisplayForList);
