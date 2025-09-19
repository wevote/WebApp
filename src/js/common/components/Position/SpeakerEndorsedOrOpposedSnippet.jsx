import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { BlockOutlined, CheckOutlined } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../Style/DesignTokenColors';
import { PositionText, VisibilityText } from '../Style/PositionDisplayStyles';
import { getDateFromUltimateElectionDate, getTodayAsInteger, timeFromDate } from '../../utils/dateFormat';

function SpeakerEndorsedOrOpposedSnippet ({ position, viewerIsPositionOwner }) {
  // console.log('SpeakerEndorsedOrOpposedSnippet position', position);
  if (!position || Object.keys(position).length === 0) {
    // The incoming position object is empty or not provided
    return null;
  }
  const {
    date_entered: dateEntered,
    // is_oppose_or_negative_rating: isOpposeOrNegativeRating,
    is_oppose: isOpposeOrNegativeRating,
    is_public_position: isPublicPosition,
    // is_support_or_positive_rating: isSupportOrPositiveRating,
    is_support: isSupportOrPositiveRating,
    position_ultimate_election_date: positionUltimateElectionDateAsInteger,
    position_year: positionYear,
    statement_text: statementText,
  } = position;
  // console.log('SpeakerEndorsedOrOpposedSnippet position', position);
  let howLongAgoOrThisYear = '';
  const todayAsInteger = getTodayAsInteger(0);
  const currentYear = new Date().getFullYear();
  // console.log('currentYear', currentYear, ', positionYear', positionYear);
  // console.log('todayAsInteger', todayAsInteger, ', positionUltimateElectionDateAsInteger', positionUltimateElectionDateAsInteger);
  if (todayAsInteger && currentYear) {
    if (positionYear === currentYear) {
      howLongAgoOrThisYear = 'this year';
    } else if (positionUltimateElectionDateAsInteger && (todayAsInteger <= positionUltimateElectionDateAsInteger)) {
      howLongAgoOrThisYear = 'this year';
    } else if (positionUltimateElectionDateAsInteger && (todayAsInteger > positionUltimateElectionDateAsInteger)) {
      const positionUltimateElectionDate = getDateFromUltimateElectionDate(positionUltimateElectionDateAsInteger);
      howLongAgoOrThisYear = timeFromDate(positionUltimateElectionDate);
    } else if (dateEntered) {
      // const dateEnteredAsInteger = getTodayAsInteger(dateEntered);
      // const differenceInDays = Math.floor((todayAsInteger - dateEnteredAsInteger) / (1000 * 60 * 60 * 24));
      // howLongAgoOrThisYear = `${differenceInDays} days ago`;
      howLongAgoOrThisYear = timeFromDate(dateEntered);
    }
  }
  return (
    <SpeakerPositionWrapper>
      {isSupportOrPositiveRating && (
        <SpeakerPosition>
          <CheckOutlinedStyled />
          <PositionText>
            {viewerIsPositionOwner ? (
              <>You endorsed</>
            ) : (
              <>Endorsed</>
            )}
            {' '}
            {howLongAgoOrThisYear}
          </PositionText>
        </SpeakerPosition>
      )}
      {isOpposeOrNegativeRating && (
        <SpeakerPosition>
          <BlockOutlinedStyled />
          <PositionText>
            {viewerIsPositionOwner ? (
              <>You opposed</>
            ) : (
              <>Opposed</>
            )}
            {' '}
            {howLongAgoOrThisYear}
          </PositionText>
        </SpeakerPosition>
      )}
      {(!isOpposeOrNegativeRating && !isSupportOrPositiveRating && statementText) && (
        <SpeakerPosition>
          <PositionText>
            {viewerIsPositionOwner ? (
              <>You commented</>
            ) : (
              <>Commented</>
            )}
            {' '}
            {howLongAgoOrThisYear}
          </PositionText>
        </SpeakerPosition>
      )}
      {(isOpposeOrNegativeRating || isSupportOrPositiveRating || statementText) && (
        <VisibilityText>
          {isPublicPosition ? '(visible to public)' : '(only visible to WeVote friends)'}
        </VisibilityText>
      )}
    </SpeakerPositionWrapper>
  );
}
SpeakerEndorsedOrOpposedSnippet.propTypes = {
  position: PropTypes.object,
  viewerIsPositionOwner: PropTypes.bool,
};

const styles = () => ({
  popoverRoot: {
    borderRadius: 2,
    border: `1px solid ${DesignTokenColors.neutral100}`,
    marginTop: '4px',
  },
});

const BlockOutlinedStyled = styled(BlockOutlined)`
  color: ${DesignTokenColors.neutral900}
`;

const CheckOutlinedStyled = styled(CheckOutlined)`
  color: ${DesignTokenColors.neutral900}
`;

const SpeakerPosition = styled('div')`
  display: flex;
`;

const SpeakerPositionWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export default withStyles(styles)(SpeakerEndorsedOrOpposedSnippet);
