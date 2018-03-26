import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import RatingPopover from "../../components/Widgets/RatingPopover";
import { cordovaDot } from "../../utils/cordovaUtils";

export default class PositionRatingSnippet extends Component {
  static propTypes = {
    vote_smart_rating: PropTypes.string.isRequired,
    vote_smart_time_span: PropTypes.string.isRequired,
    popover_off: PropTypes.bool,
    placement: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const rating = this.props.vote_smart_rating;
    const rating_time_span = this.props.vote_smart_time_span;
    let src;
    let className;
    let alt;
    let popover_off = false;
    if (this.props.popover_off !== undefined) {
      popover_off = this.props.popover_off ? true : false;
    }

    let placement = "top";
    if (this.props.placement !== undefined) {
      placement = this.props.placement;
    }

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
          <span className="position-rating__percentage" data-percentage={rating}>{rating}% </span> rating
          { rating_time_span ? <span className="position-rating__timestamp"> in {rating_time_span}</span> :
            null }
          { rating ?
            <RatingPopover popover_off={popover_off} placement={placement} /> :
            null
          }
        </div>
      </div>;
  }
}
