import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { FriendDetailsLine, FriendDetailsWrapper, FriendName } from '../Style/friendStyles';
import { renderLog } from '../../common/utils/logging';


class FriendDetails extends Component {
  render () {
    renderLog('FriendDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      emailAddressForDisplay,
      indicateIfAlreadyOnWeVote,
      inSideColumn,
      invitationStateText,
      mutualFriends,
      positionsTaken,
      twitterDescriptionMinusName,
      voterEmailAddress,
      voterTwitterHandle,
      voterWeVoteId,
    } = this.props;

    const alternateVoterDisplayName = voterEmailAddress || voterTwitterHandle;
    const voterDisplayName = this.props.voterDisplayName || alternateVoterDisplayName;

    // Link to their voter guide
    const voterDisplayNameFormatted = <span className="card-child__display-name">{voterDisplayName}</span>;
    return (
      <FriendDetailsWrapper inSideColumn={inSideColumn}>
        <FriendName inSideColumn={inSideColumn}>
          {voterDisplayNameFormatted}
        </FriendName>
        {!!(emailAddressForDisplay) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <EmailSmaller>
              {emailAddressForDisplay}
            </EmailSmaller>
          </FriendDetailsLine>
        )}
        {!!(indicateIfAlreadyOnWeVote && voterWeVoteId) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            <span style={{ fontWeight: 600 }}>Found on We Vote!</span>
          </FriendDetailsLine>
        )}
        {!!(positionsTaken) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            Opinions:
            {' '}
            <strong>{positionsTaken}</strong>
          </FriendDetailsLine>
        )}
        {!!(mutualFriends) && (
          <FriendDetailsLine inSideColumn={inSideColumn}>
            Mutual Friends:
            {' '}
            <strong>{mutualFriends || 0}</strong>
          </FriendDetailsLine>
        )}
        { invitationStateText ? <p>{invitationStateText}</p> : null }
        { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
      </FriendDetailsWrapper>
    );
  }
}
FriendDetails.propTypes = {
  emailAddressForDisplay: PropTypes.string,
  indicateIfAlreadyOnWeVote: PropTypes.bool,
  inSideColumn: PropTypes.bool,
  invitationStateText: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  twitterDescriptionMinusName: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
  voterWeVoteId: PropTypes.string,
};

const EmailSmaller = styled('div')`
  font-size: 14px;
  max-width: 21ch;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default FriendDetails;
