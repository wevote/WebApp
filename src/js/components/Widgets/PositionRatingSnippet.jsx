import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import { cordovaDot } from "../../utils/cordovaUtils";

export default class PositionRatingSnippet extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    vote_smart_rating: PropTypes.string.isRequired,
    vote_smart_time_span: PropTypes.string.isRequired,
    popover_off: PropTypes.bool,
    placement: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const display_name = this.props.ballot_item_display_name;
    const rating = this.props.vote_smart_rating;
    const rating_time_span = this.props.vote_smart_time_span;
    let src;
    let className;
    let alt;

    if (rating >= 65) {
      src = cordovaDot("/img/global/icons/up-arrow-color-icon.svg");
      className = "position-rating__icon position-rating__icon--positive";
      alt = "Positive Rating";
    } else if (rating < 35) {
      src = cordovaDot("/img/global/icons/down-arrow-color-icon.svg");
      className = "position-rating__icon position-rating__icon--negative";
      alt = "Negative Rating";
    } else {
      src = cordovaDot("/img/global/icons/mixed-rating-icon.svg");
      className = "position-rating__icon position-rating__icon--mixed";
      alt = "Mixed Rating";
    }

    return <div className="position-rating">
        <img src={src} width="20" height="20" className={className} alt={alt} />
        <div className="position-rating__text">
          <span className="position-rating__name">Gave {display_name}</span>
          <br />
          <span className="position-rating__percentage" data-percentage={rating}>{rating}% </span> rating
          { rating_time_span ? <span className="position-rating__timestamp"> in {rating_time_span}</span> :
            null }
        </div>
      </div>;
  }
}
