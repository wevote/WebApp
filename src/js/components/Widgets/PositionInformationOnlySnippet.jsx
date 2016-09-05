import React, { Component, PropTypes } from "react";

export default class PositionInformationOnlySnippet extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    is_on_ballot_item_page: PropTypes.bool,
    is_on_edit_position_modal: PropTypes.bool,
    is_looking_at_self: PropTypes.bool,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool
  };

  render () {
    var stance_icon_src;
    var className;
    var alt;
    var positionLabel;
    var hasThisToSay;
    var { is_looking_at_self } = this.props;

    stance_icon_src = "/img/global/icons/mixed-rating-icon.svg";
    className = "position-rating__icon position-rating__icon--mixed";
    alt = "Neutral Rating";
    positionLabel = "Information about";
    hasThisToSay = is_looking_at_self ? "Your comment is this:" : "has this to say:";
    let stance_display_off = false;
    if (this.props.stance_display_off !== undefined) {
      stance_display_off = this.props.stance_display_off ? true : false;
    }
    let comment_text_off = false;
    if (this.props.comment_text_off !== undefined) {
      comment_text_off = this.props.comment_text_off ? true : false;
    }

    return <div className="explicit-position">
      {stance_display_off ? null : <img src={stance_icon_src} width="20" height="20" className={className} alt={alt} />}
      <p className="explicit-position__text">
        { stance_display_off ?
          null :
          <span>
            {this.props.is_on_ballot_item_page ?
              <span>
                <span className="explicit-position__position-label">{positionLabel}</span>
                <span> {this.props.ballot_item_display_name} </span>
              </span> :
              <span>
                <span> {this.props.speaker_display_name} </span>
                <span className="explicit-position__position-label">{hasThisToSay}</span>
              </span> }
            <br />
          </span>
        }
        { comment_text_off ? null :
          <span>
            <span> {this.props.statement_text}</span>
            {/* if there's an external source for the explicit position/endorsement, show it */}
            {this.props.more_info_url ?
              <span className="explicit-position__source"> (view source)</span> :
              null }
          </span>
        }
      </p>
    </div>;
  }
}
