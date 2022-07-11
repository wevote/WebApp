import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export default function PositionScoreIntroForBallotItem (props) {
  const { ballotItemDisplayName, organizationsToFollowExist } = props;
  return (
    <PositionScoreIntroForBallotItemWrapper>
      Your
      {' '}
      <strong>
        personalized score
      </strong>
      {ballotItemDisplayName && (
        <>
          {' '}
          for
          {' '}
          <strong>
            {ballotItemDisplayName}
          </strong>
        </>
      )}
      {' '}
      is the number of people who support this candidate,
      from among the people you trust.
      {organizationsToFollowExist ? (
        <>
          {' '}
          Click
          {' '}
          <strong>
            Add to score
          </strong>
          {' '}
          next to the people you trust. This builds your score
          {(ballotItemDisplayName) && (
            <span>
              {' '}
              for
              {' '}
              <strong>
                {ballotItemDisplayName}
              </strong>
            </span>
          )}
          .
        </>
      ) : (
        <>
          {' '}
          There aren&apos;t any people who support
          {' '}
          {(ballotItemDisplayName) && (
            <span>
              <strong>
                {ballotItemDisplayName}
              </strong>
              {' '}
            </span>
          )}
          at this time. Ask your friends
          {(ballotItemDisplayName) && (
            <span>
              {' '}
              if they support
              {' '}
              <strong>
                {ballotItemDisplayName}
              </strong>
            </span>
          )}
          !
        </>
      )}
    </PositionScoreIntroForBallotItemWrapper>
  );
}
PositionScoreIntroForBallotItem.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  organizationsToFollowExist: PropTypes.bool,
};


const PositionScoreIntroForBallotItemWrapper = styled('div')`
`;
