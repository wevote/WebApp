import React, { Component, PropTypes } from "react";
import ReadMore from "../../components/Widgets/ReadMore";
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
    var stance_icon_src;
    var className;
    var alt;
    var positionLabel;
    var isSupportedBy;
    var { is_looking_at_self, more_info_url } = this.props;
    var statement_text = this.props.statement_text || "";
    var statement_text_html = <ReadMore text_to_display={statement_text} />;
    // onViewSourceClick is onClick function for view source modal in mobile browser
    // const onViewSourceClick = this.state.showViewSourceModal ? this.closeViewSourceModal.bind(this) : this.openViewSourceModal.bind(this);

    if (this.props.is_support){
      stance_icon_src = "/img/global/icons/thumbs-up-color-icon.svg";
      className = "explicit-position__icon";
      alt = "Supports";
      positionLabel = is_looking_at_self ? "You Support" : "Supports";
      isSupportedBy = is_looking_at_self ? "is Supported by You" : "is Supported by";
    } else if (this.props.is_oppose) {
      stance_icon_src = "/img/global/icons/thumbs-down-color-icon.svg";
      className = "explicit-position__icon";
      alt = "Opposes";
      positionLabel = is_looking_at_self ? "You Oppose" : "Opposes";
      isSupportedBy = is_looking_at_self ? "is Opposed by You" : "is Opposed by";
    } else {
      // We shouldn't be here. Do not display position information. See instead PositionInformationOnlySnippet.jsx
      return <span></span>;
    }
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
      { stance_display_off ? null : <img src={stance_icon_src} width="20" height="20" className={className} alt={alt} /> }
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
                <span className="explicit-position__position-label">{isSupportedBy}</span>
                <span> {this.props.speaker_display_name} </span>
              </span> }
            <br />
          </span>
        }
        { comment_text_off ? null :
          <span>
            <span>{statement_text_html}</span>
            {/* if there's an external source for the explicit position/endorsement, show it */}
            {more_info_url ?
              <div className="view-source">
                {/* default: open in new tab*/}
                <a href={more_info_url}
                   target="_blank"
                   className="explicit-position__source">
                  view source <i className="fa fa-external-link-square" aria-hidden="true"></i>
                </a>
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
      {/*<ViewSourceModal show={this.state.showViewSourceModal}
                     onHide={this.closeViewSourceModal.bind(this)}
                     url={this.props.more_info_url} /> */}
    </div>;
  }
}
