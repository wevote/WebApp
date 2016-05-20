import React, { Component, PropTypes } from "react";

export default class PositionRatingSnippet extends Component {
  static propTypes = {
    rating: PropTypes.number.isRequired,
    rating_time_span: PropTypes.string.isRequired
  };

  render () {
    const rating = this.props.rating;
    const rating_time_span = this.props.rating_time_span;
    var src;
    var className;
    var alt;
    if (rating >= 65){
      src = "/img/global/icons/up-arrow-color-icon.svg";
      className = "position-rating__icon position-rating__icon--positive";
      alt = "Positive Rating";
    } else if ( rating < 35) {
      src = "/img/global/icons/down-arrow-color-icon.svg";
      className = "position-rating__icon position-rating__icon--negative";
      alt = "Negative Rating";
    } else {
      src = "/img/global/icons/mixed-rating-icon.svg";
      className = "position-rating__icon position-rating__icon--mixed";
      alt = "Mixed Rating";
    }
    return <div className="position-rating">
        <img src={src} width="20" height="20" className={className} alt={alt} />
        <div className="position-rating__text">
          <span className="position-rating__percentage" data-percentage={rating}>{rating}% </span> rating
          { rating_time_span ? <span className="position-rating__timestamp"> in {rating_time_span}</span> :
            null }
          { rating ? <span className="position-rating__source"> (source: VoteSmart.org)</span> : null }
        </div>
      </div>;
  }
}
