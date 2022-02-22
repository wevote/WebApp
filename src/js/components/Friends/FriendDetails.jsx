import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FriendDetailsLine, FriendDetailsWrapper, FriendName } from '../Style/friendStyles';
import { renderLog } from '../../common/utils/logging';


class FriendDetails extends Component {
  render () {
    renderLog('FriendDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      inSideColumn,
      invitationStateText,
      mutualFriends,
      positionsTaken,
      twitterDescriptionMinusName,
      voterEmailAddress,
      voterTwitterHandle,
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
  inSideColumn: PropTypes.bool,
  invitationStateText: PropTypes.string,
  mutualFriends: PropTypes.number,
  positionsTaken: PropTypes.number,
  twitterDescriptionMinusName: PropTypes.string,
  voterDisplayName: PropTypes.string,
  voterEmailAddress: PropTypes.string,
  voterTwitterHandle: PropTypes.string,
};

export default FriendDetails;
