import React, { Component, PropTypes } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import RatingPopover from "../../components/Widgets/RatingPopover";

export default class PositionRatingSnippet extends Component {
  static propTypes = {
    vote_smart_rating: PropTypes.string.isRequired,
    vote_smart_time_span: PropTypes.string.isRequired
  };

  render () {
    const rating = this.props.vote_smart_rating;
    const rating_time_span = this.props.vote_smart_time_span;
    var src;
    var className;
    var alt;
    //var Popover = <RatingPopover id="testID" placement="top" />;
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
    const popoverClickRootClose = <Popover id="popover-trigger-click-root-close" title="Popover bottom">
        <strong>Holy guacamole!</strong> Check this info.
      </Popover>;


    return <div className="position-rating">
        <img src={src} width="20" height="20" className={className} alt={alt} />
        <div className="position-rating__text">
          <span className="position-rating__percentage" data-percentage={rating}>{rating}% </span> rating
          { rating_time_span ? <span className="position-rating__timestamp"> in {rating_time_span}</span> :
            null }
          { rating ?
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
              <span className="position-rating__source">&nbsp;(source: VoteSmart.org)</span>
            </OverlayTrigger> :
            null
          }
        </div>
      </div>;
  }
}
