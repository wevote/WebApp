import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import Avatar from '../Style/avatarStyles';
import {
  CancelButtonWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons,
  FriendDisplayDesktopButtonsWrapper, FriendDisplayOuterWrapper, ToRightOfPhoto,
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

  friendInvitationByEmailSend (emailAddresses) {
    // console.log('SuggestedFriendDisplayForList friendInvitationByEmailSend');
    const emailAddressArray = '';
    const firstNameArray = '';
    const lastNameArray = '';
    const invitationMessage = FriendStore.getMessageToFriendQueuedToSave();
    const senderEmailAddress = VoterStore.getVoterEmail();
    FriendActions.friendInvitationByEmailSend(emailAddressArray, firstNameArray, lastNameArray, emailAddresses, invitationMessage, senderEmailAddress);
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
    const { friendInvitationByEmailSent, ignoreSuggestedFriendSent, ignoreVoterContactSent } = this.state;

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
        twitterDescriptionMinusName={twitterDescriptionMinusName}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
        voterWeVoteId={otherVoterWeVoteId}
      />
    );
    const friendButtonsExist = true;
    const friendButtonsWrapperHtml = (
      <FriendButtonsWrapper inSideColumn={inSideColumn}>
        <SuggestedFriendSettingsWrapper>
          {otherVoterWeVoteId ? (
            <SuggestedFriendToggle askMode={askMode} inSideColumn={inSideColumn} otherVoterWeVoteId={otherVoterWeVoteId} />
          ) : (
            <Button
              color="primary"
              disabled={friendInvitationByEmailSent}
              fullWidth
              onClick={() => this.friendInvitationByEmailSend(emailAddressForDisplay)}
              type="button"
              variant="contained"
            >
              {askMode ? (
                <span className="u-no-break">
                  {friendInvitationByEmailSent ? 'Sent' : 'Ask'}
                </span>
              ) : (
                <span className="u-no-break">
                  {friendInvitationByEmailSent ? 'Invite sent' : 'Add friend'}
                </span>
              )}
            </Button>
          )}
        </SuggestedFriendSettingsWrapper>
        <CancelButtonWrapper inSideColumn={inSideColumn}>
          {otherVoterWeVoteId ? (
            <Button
              classes={{ root: classes.ignoreButton }}
              color="primary"
              disabled={ignoreSuggestedFriendSent}
              fullWidth
              onClick={() => this.ignoreSuggestedFriend(otherVoterWeVoteId)}
              type="button"
              variant="outlined"
            >
              {ignoreSuggestedFriendSent ? 'Ignored' : 'Ignore'}
            </Button>
          ) : (
            <Button
              classes={{ root: classes.ignoreButton }}
              color="primary"
              disabled={ignoreVoterContactSent || voterContactIgnored}
              fullWidth
              onClick={() => this.ignoreVoterContact(emailAddressForDisplay, otherVoterWeVoteId)}
              type="button"
              variant="outlined"
            >
              {(ignoreVoterContactSent || voterContactIgnored) ? 'Ignored' : 'Ignore'}
            </Button>
          )}
        </CancelButtonWrapper>
      </FriendButtonsWrapper>
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
          <ToRightOfPhoto>
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
            {friendButtonsExist && (
              <div className="u-show-mobile">
                {friendButtonsWrapperHtml}
              </div>
            )}
          </ToRightOfPhoto>
          <FriendLocationDisplay cityForDisplay={cityForDisplay} stateCodeForDisplay={stateCodeForDisplay} />
        </FriendColumnWithoutButtons>
        {friendButtonsExist && (
          <FriendDisplayDesktopButtonsWrapper className="u-show-desktop-tablet">
            {friendButtonsWrapperHtml}
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
  stateCodeForDisplay: PropTypes.string,
  voterContactIgnored: PropTypes.bool,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
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
};

const SuggestedFriendDisplayForListWrapper = styled('div')`
  width: 100%;
`;

const SuggestedFriendSettingsWrapper = styled('div')`
  width: fit-content;
`;

export default withStyles(styles)(SuggestedFriendDisplayForList);
