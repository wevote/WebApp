import React, { Component, PropTypes } from "react";

export default class PositionSupportOpposeSnippet extends Component {
  static propTypes = {
    candidate_display_name: PropTypes.string,
    is_on_candidate_page: PropTypes.bool,
    is_looking_at_self: PropTypes.bool,
    is_support: PropTypes.bool.isRequired,
    is_oppose: PropTypes.bool.isRequired,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string
  };

  render () {
    var src;
    var className;
    var alt;
    var positionLabel;
    var isSupportedBy;
    var { is_looking_at_self } = this.props;
    if (this.props.is_support){
      src = "/img/global/icons/thumbs-up-color-icon.svg";
      className = "explicit-position__icon";
      alt = "Supports";
      positionLabel = (is_looking_at_self) ? "You Support" : "Supports";
      isSupportedBy = "is Supported by";
    } else if (this.props.is_oppose) {
      src = "/img/global/icons/thumbs-down-color-icon.svg";
      className = "explicit-position__icon";
      alt = "Opposes";
      positionLabel = (is_looking_at_self) ? "You Oppose" : "Opposes";
      isSupportedBy = "is Opposed by";
    } else {
      // We shouldn't be here. Do not display position information. See instead PositionInformationOnlySnippet.jsx
      return <span></span>;
    }
    return <div className="explicit-position">
        <img src={src} width="20" height="20" className={className} alt={alt} />
        <p className="explicit-position__text">
          {this.props.is_on_candidate_page ?
              <span>
                <span className="explicit-position__position-label">{positionLabel}</span>
                <span> {this.props.candidate_display_name} </span>
              </span> :
              <span>
                <span className="explicit-position__position-label">{isSupportedBy}</span>
                <span> {this.props.speaker_display_name} </span>

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
