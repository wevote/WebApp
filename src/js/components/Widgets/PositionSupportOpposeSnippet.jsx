import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { cordovaDot } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import ReadMore from "../../components/Widgets/ReadMore";
import { vimeo_reg, youtube_reg } from "../../utils/textFormat";

// import ViewSourceModal from "../../components/Widgets/ViewSourceModal";

export default class PositionSupportOpposeSnippet extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    is_on_ballot_item_page: PropTypes.bool,
    is_looking_at_self: PropTypes.bool,
    is_support: PropTypes.bool.isRequired,
    is_oppose: PropTypes.bool.isRequired,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
  };

  componentWillMount () {
    this.setState({
      showViewSourceModal: false,
      transitioning: false,
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
    renderLog(__filename);
    let stance_icon_src;
    let className;
    let alt;
    let actorSupportsBallotItemLabel;
    let ballotItemIsSupportedByActorLabel;
    let { is_looking_at_self, more_info_url } = this.props;
    let moreInfoUrl = more_info_url;
    let statement_text = this.props.statement_text || "";
    let statement_text_html = <ReadMore text_to_display={statement_text} />;
    // onViewSourceClick is onClick function for view source modal in mobile browser
    // const onViewSourceClick = this.state.showViewSourceModal ? this.closeViewSourceModal.bind(this) : this.openViewSourceModal.bind(this);

    let video_url = "";
    let youtube_url;
    let vimeo_url;
    let statement_text_no_url;

    if (statement_text) {
      youtube_url = statement_text.match(youtube_reg);
      vimeo_url = statement_text.match(vimeo_reg);
    }

    if (youtube_url) {
      video_url = youtube_url[0];
      statement_text_no_url = statement_text.replace(video_url, "");
      statement_text_html = <ReadMore text_to_display={statement_text_no_url} />;
    }

    if (vimeo_url) {
      video_url = vimeo_url[0];
      statement_text_no_url = statement_text.replace(video_url, "");
      statement_text_html = <ReadMore text_to_display={statement_text_no_url} />;
    }

    if (this.props.is_support) {
      stance_icon_src = cordovaDot("/img/global/svg-icons/thumbs-up-color-icon.svg");
      className = "explicit-position__icon";
      alt = "Supports";
      actorSupportsBallotItemLabel = is_looking_at_self ? "You Support" : "Supports"; // Actor supports Ballot item (Active voice)
      ballotItemIsSupportedByActorLabel = is_looking_at_self ? "is Supported by You" : "is Supported by"; // Ballot item is supported by Actor (Passive voice)
    } else if (this.props.is_oppose) {
      stance_icon_src = cordovaDot("/img/global/svg-icons/thumbs-down-color-icon.svg");
      className = "explicit-position__icon";
      alt = "Opposes";
      actorSupportsBallotItemLabel = is_looking_at_self ? "You Oppose" : "Opposes";
      ballotItemIsSupportedByActorLabel = is_looking_at_self ? "is Opposed by You" : "is Opposed by";
    } else {
      // We shouldn't be here. Do not display position information. See instead PositionInformationOnlySnippet.jsx
      return <span />;
    }

    let stance_display_off = false;
    if (this.props.stance_display_off !== undefined) {
      stance_display_off = this.props.stance_display_off ? true : false;
    }

    let comment_text_off = false;
    if (this.props.comment_text_off !== undefined) {
      comment_text_off = this.props.comment_text_off ? true : false;
    }

    if (moreInfoUrl) {
      if (moreInfoUrl.toLowerCase().startsWith("http")) {
        moreInfoUrl = moreInfoUrl;
      } else {
        moreInfoUrl = "http://" + moreInfoUrl;
      }
    }

    return <div className="explicit-position">
      { stance_display_off ? null : <img src={stance_icon_src} width="24" height="24" className={className} alt={alt} /> }
      { stance_display_off ?
        null :
        <div className="explicit-position__text">
          <span className="explicit-position__voter-guide-increase">
            {this.props.is_on_ballot_item_page ?
              <span>
                <span className="explicit-position__position-label">{actorSupportsBallotItemLabel}</span>
                <span> {this.props.ballot_item_display_name} </span>
              </span> :
              <span>
                <span className="explicit-position__position-label">{ballotItemIsSupportedByActorLabel}</span>
                <span> {this.props.speaker_display_name} </span>
              </span> }
            <br />
          </span>
          { comment_text_off ? null :
            <span>
              <span className="u-wrap-links hidden-print">{statement_text_html}</span>
              {/* if there's an external source for the explicit position/endorsement, show it */}
              { video_url ?
                <ReactPlayer className="explicit-position__media-player" url={`${video_url}`} width="100%" height="100%"/> :
                null }
              {moreInfoUrl ?
                <div className="hidden-xs">
                  {/* default: open in new tab*/}
                  <OpenExternalWebSite url={moreInfoUrl}
                                       target="_blank"
                                       className="u-gray-mid"
                                       body={<span>view source <i className="fa fa-external-link" aria-hidden="true" /></span>} />
                  {/* link for mobile browser: open in bootstrap modal */}
                  {/*
                  <a onClick={onViewSourceClick}>
                    (view source)
                  </a> */}
                </div> :
                null }
            </span>
          }
        </div>
      }
      {/*<ViewSourceModal show={this.state.showViewSourceModal}
                     onHide={this.closeViewSourceModal.bind(this)}
                     url={this.props.moreInfoUrl} /> */}
    </div>;
  }
}
