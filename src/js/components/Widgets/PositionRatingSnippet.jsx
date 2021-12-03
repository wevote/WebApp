import PropTypes from 'prop-types';
import React, { Component } from 'react';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';

const upArrowColorIcon = '../../../img/global/icons/up-arrow-color-icon.svg';
const downArrowColorIcon = '../../../img/global/icons/down-arrow-color-icon.svg';
const mixedRatingIcon = '../../../img/global/icons/mixed-rating-icon.svg';

export default class PositionRatingSnippet extends Component {
  render () {
    renderLog('PositionRatingSnippet');  // Set LOG_RENDER_EVENTS to log all renders
    const displayName = this.props.ballotItemDisplayName;
    const rating = this.props.voteSmartRating;
    const ratingTimeSpan = this.props.voteSmartTimeSpan;
    const showRatingDescriptionFunction = this.props.showRatingDescription;
    let src;
    let className;
    let alt;

    if (rating >= 65) {
      src = normalizedImagePath(upArrowColorIcon);
      className = 'position-rating__icon position-rating__icon--positive u-cursor--pointer';
      alt = 'Positive Rating';
    } else if (rating < 35) {
      src = normalizedImagePath(downArrowColorIcon);
      className = 'position-rating__icon position-rating__icon--negative u-cursor--pointer';
      alt = 'Negative Rating';
    } else {
      src = normalizedImagePath(mixedRatingIcon);
      className = 'position-rating__icon position-rating__icon--mixed u-cursor--pointer';
      alt = 'Mixed Rating';
    }

    return (
      <div className="position-rating">
        <span onClick={showRatingDescriptionFunction}>
          <img src={src} width="20" height="20" className={className} alt={alt} />
        </span>
        <div className="position-rating__text">
          <span className="position-rating__name">
            Gave
            {displayName}
          </span>
          <br />
          <span className="position-rating__rating u-cursor--pointer" onClick={showRatingDescriptionFunction}>
            <span className="position-rating__percentage" data-percentage={rating}>
              {rating}
              %
              {' '}
            </span>
            {' '}
            rating
            { ratingTimeSpan ? (
              <span className="position-rating__timestamp">
                {' '}
                in
                {ratingTimeSpan}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    );
  }
}
PositionRatingSnippet.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  showRatingDescription: PropTypes.func,
  voteSmartRating: PropTypes.string.isRequired,
  voteSmartTimeSpan: PropTypes.string.isRequired,
};
