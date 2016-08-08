import React, { Component, PropTypes } from "react";

export default class PositionInformationOnlySnippet extends Component {
  static propTypes = {
    candidate_display_name: PropTypes.string,
    is_on_candidate_page: PropTypes.bool,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string
  };

  render () {
    var src;
    var className;
    var alt;
    var positionLabel;
    var hasThisToSay;

    src = "/img/global/icons/mixed-rating-icon.svg";
    className = "position-rating__icon position-rating__icon--mixed";
    alt = "Neutral Rating";
    positionLabel = "Information about";
    hasThisToSay = "has this to say:";

    return <div className="explicit-position">
        <img src={src} width="20" height="20" className={className} alt={alt} />
        <p className="explicit-position__text">
          {this.props.is_on_candidate_page ?
              <span>
                <span className="explicit-position__position-label">{positionLabel}</span>
                <span> {this.props.candidate_display_name} </span>
              </span> :
              <span>
                <span> {this.props.speaker_display_name} </span>
                <span className="explicit-position__position-label">{hasThisToSay}</span>
              </span> }
                <br />
          <span> {this.props.statement_text}</span>
        {/* if there's an external source for the explicit position/endorsement, show it */}
        {this.props.more_info_url ?
          <span className="explicit-position__source"> (Source: {this.props.more_info_url})</span> :
            <span></span> }
        </p>
      </div>;
  }
}
