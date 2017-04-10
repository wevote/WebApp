import React, { Component, PropTypes } from "react";
import ReactPlayer from "react-player";
import ReadMore from "../../components/Widgets/ReadMore";
import {vimeo_reg, youtube_reg} from "../../utils/textFormat";
var Icon = require("react-svg-icons");
// import ViewSourceModal from "../../components/Widgets/ViewSourceModal";

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

  componentWillMount () {
    this.setState({
      showViewSourceModal: false,
      transitioning: false
    });
  }

  closeViewSourceModal () {
    this.setState({ showViewSourceModal: false });
  }

  openViewSourceModal (event) {
    console.log(event);
    event.stopPropagation();
    this.setState({ showViewSourceModal: true });
  }

  render () {
    var className;
    var alt;
    var positionLabel;
    var hasThisToSay;
    var { is_looking_at_self, more_info_url } = this.props;
    var statement_text = this.props.statement_text || "";
    var statement_text_html = <ReadMore text_to_display={statement_text} />;
    // onViewSourceClick is onClick function for view source modal in mobile browser
    // const onViewSourceClick = this.state.showViewSourceModal ? this.closeViewSourceModal.bind(this) : this.openViewSourceModal.bind(this);

    var video_url = "";
    var youtube_url;
    var vimeo_url;
    var statement_text_no_url;

    if (more_info_url) {
      youtube_url = more_info_url.match(youtube_reg);
      vimeo_url = more_info_url.match(vimeo_reg);
    }

    if (statement_text) {
      youtube_url = statement_text.match(youtube_reg);
      vimeo_url = statement_text.match(vimeo_reg);
    }

    if (youtube_url) {
      video_url = youtube_url;
      statement_text_no_url = statement_text.replace(video_url[0], "");
      statement_text_html = <ReadMore text_to_display={statement_text_no_url} />;
    }

    if (vimeo_url) {
      video_url = vimeo_url[0];
      statement_text_no_url = statement_text.replace(video_url, "");
      statement_text_html = <ReadMore text_to_display={statement_text_no_url} />;
    }

    className = "position-rating__icon position-rating__icon--no-position";
    alt = "Neutral Rating";
    positionLabel = "About";
    hasThisToSay = is_looking_at_self ? "Your comment:" : null;
    let stance_display_off = false;
    if (this.props.stance_display_off !== undefined) {
      stance_display_off = this.props.stance_display_off ? true : false;
    }
    let comment_text_off = false;
    if (this.props.comment_text_off !== undefined) {
      comment_text_off = this.props.comment_text_off ? true : false;
    }
    if (more_info_url) {
      if (more_info_url.toLowerCase().startsWith("http")) {
        more_info_url = more_info_url;
      } else {
        more_info_url = "http://" + more_info_url;
      }
    }

    return <div className="explicit-position">
      {stance_display_off ? null : <Icon name="no-position-icon" width={24} height={24} className={className} alt={alt} />}
      <div className="explicit-position__text">
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
            <span>{statement_text_html}</span>
            {/* if there's an external source for the explicit position/endorsement, show it */}
            {video_url ?
              <ReactPlayer url={`${video_url}`} width="300px" height="231px"/> :
              null }
            {more_info_url ?
              <div className="hidden-xs">
                {/* default: open in new tab*/}
                <a href={more_info_url}
                   target="_blank"
                   className="u-gray-mid">
                  view source <i className="fa fa-external-link" aria-hidden="true" />
                </a>
                {/* link for mobile browser: open in bootstrap modal */}
                {/*<a onClick={onViewSourceClick}>
                  (view source)
                </a> */}
              </div> :
              null }
          </span>
        }
      </div>
      {/*<ViewSourceModal show={this.state.showViewSourceModal}
                     onHide={this.closeViewSourceModal.bind(this)}
                     url={this.props.more_info_url} /> */}
    </div>;
  }
}
