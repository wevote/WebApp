import React, { Component, PropTypes } from "react";

export default class PositionRatingIcon extends Component {
  static propTypes = {
    rating: PropTypes.number.isRequired
  };

  render () {
    const rating = this.props.rating;
    var src;
    if (rating >= 65){
      src = "/img/global/icons/up-arrow-color-icon@2x.png";
    } else if ( rating < 35) {
      src = "/img/global/icons/down-arrow-color-icon@2x.png";
    } else {
      src = "/img/global/icons/mixed-rating-icon@2x.png";
    }
    return <img src={src} width="20" height="20" />;
  }
}
