import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import Avatar from '../Style/avatarStyles';
import { CancelButtonWrapper, FriendButtonsWrapper, FriendColumnWithoutButtons, FriendDisplayOuterWrapper } from '../Style/friendStyles';
import FriendDetails from './FriendDetails';
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
          <div>
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {detailsHTML}
              </Link>
            ) : (
              <div>
                {detailsHTML}
              </div>
            )}
          </div>
        </FriendColumnWithoutButtons>
        <FriendButtonsWrapper inSideColumn={inSideColumn}>
          <SuggestedFriendToggle inSideColumn={inSideColumn} otherVoterWeVoteId={otherVoterWeVoteId} />
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
      </FriendDisplayOuterWrapper>
    );

    if (previewMode) {
      return <span>{suggestedFriendHtml}</span>;
    } else {
      return (
        <div>
          {suggestedFriendHtml}
        </div>
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

export default withStyles(styles)(SuggestedFriendDisplayForList);
