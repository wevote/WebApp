import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
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
      ignoreSuggestedFriendSent: false,
    };
  }

  ignoreSuggestedFriend (voterWeVoteId) {
    FriendActions.ignoreSuggestedFriend(voterWeVoteId);
    this.setState({
      ignoreSuggestedFriendSent: true,
    });
  }

  render () {
    renderLog('SuggestedFriendDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
      inSideColumn,
      linkedOrganizationWeVoteId,
      mutualFriends,
      positionsTaken,
      previewMode,
      stateCodeForDisplay,
      voterDisplayName,
      voterEmailAddress,
      voterWeVoteId: otherVoterWeVoteId,
      voterPhotoUrlLarge,
      voterTwitterDescription,
      voterTwitterHandle,
    } = this.props;
    const { ignoreSuggestedFriendSent } = this.state;

    const twitterDescription = voterTwitterDescription || '';
    // If the voterDisplayName is in the voterTwitterDescription, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterDisplayName, twitterDescription);

    // TwitterHandle-based link
    const twitterVoterGuideLink = voterTwitterHandle ? `/${voterTwitterHandle}` : null;
    const weVoteIdVoterGuideLink = linkedOrganizationWeVoteId ? `/voterguide/${linkedOrganizationWeVoteId}` : null;
    const voterGuideLink = twitterVoterGuideLink || weVoteIdVoterGuideLink;
    const voterImage = <ImageHandler sizeClassName="icon-lg " imageUrl={voterPhotoUrlLarge} kind_of_ballot_item="CANDIDATE" />;
    const detailsHTML = (
      <FriendDetails
        inSideColumn={inSideColumn}
        mutualFriends={mutualFriends}
        positionsTaken={positionsTaken}
        twitterDescriptionMinusName={twitterDescriptionMinusName}
        voterDisplayName={voterDisplayName}
        voterEmailAddress={voterEmailAddress}
        voterTwitterHandle={voterTwitterHandle}
      />
    );
    const friendButtonsExist = true;
    const friendButtonsWrapperHtml = (
      <FriendButtonsWrapper inSideColumn={inSideColumn}>
        <FriendSettingsWrapper>
          <SuggestedFriendToggle inSideColumn={inSideColumn} otherVoterWeVoteId={otherVoterWeVoteId} />
        </FriendSettingsWrapper>
        <CancelButtonWrapper inSideColumn={inSideColumn}>
          <Button
            classes={{ root: classes.ignoreButton }}
            color="primary"
            disabled={ignoreSuggestedFriendSent}
            fullWidth
            onClick={() => this.ignoreSuggestedFriend(otherVoterWeVoteId)}
            type="button"
            variant="outlined"
          >
            {ignoreSuggestedFriendSent ? 'Ignoring...' : 'Ignore'}
          </Button>
        </CancelButtonWrapper>
      </FriendButtonsWrapper>
    );

    const suggestedFriendHtml = (
      <FriendDisplayOuterWrapper inSideColumn={inSideColumn}/* previewMode={previewMode} */>
        <FriendColumnWithoutButtons>
          <Avatar inSideColumn={inSideColumn}>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </Link>
            ) : (
              <span>
                <Suspense fallback={<></>}>
                  {voterImage}
                </Suspense>
              </span>
            )}
          </Avatar>
          <ToRightOfPhoto>
            <div className="full-width">
              { voterGuideLink ? (
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
          <FriendLocationDisplay stateCodeForDisplay={stateCodeForDisplay} />
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
  classes: PropTypes.object,
  inSideColumn: PropTypes.bool,
  linkedOrganizationWeVoteId: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  previewMode: PropTypes.bool,
  stateCodeForDisplay: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterPhotoUrlLarge: PropTypes.string,
  voterTwitterDescription: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

const styles = () => ({
  ignoreButton: {
    // fontSize: '12.5px',
  },
});

const SuggestedFriendDisplayForListWrapper = styled('div')`
`;

const FriendSettingsWrapper = styled('div')`
  width: fit-content;
`;

export default withStyles(styles)(SuggestedFriendDisplayForList);
