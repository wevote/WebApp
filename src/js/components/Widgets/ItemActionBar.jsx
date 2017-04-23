import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import PositionDropdown from "./PositionDropdown";
import ShareButtonDropdown from "./ShareButtonDropdown";

var Icon = require("react-svg-icons");

const web_app_config = require("../../config");

export default class ItemActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    commentButtonHide: PropTypes.bool,
    shareButtonHide: PropTypes.bool,
    supportProps: PropTypes.object,
    toggleFunction: PropTypes.func,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false
    };
  }

  componentWillReceiveProps () {
    this.setState({transitioning: false});
  }

  supportItem (is_support) {
    console.log("is_support", is_support);
    if (is_support) {this.stopSupportingItem(); return;}
    if (this.state.transitioning){ return; }
    SupportActions.voterSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopSupportingItem () {
    console.log("Runnning stopSupportingItem", this.state.transitioning);
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  opposeItem (is_oppose) {
    console.log("is_oppose", is_oppose);
    if (is_oppose) {this.stopOpposingItem(); return;}
    if (this.state.transitioning){ return; }
    SupportActions.voterOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopOpposingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  render () {
    if (this.props.supportProps === undefined){
      // console.log("ItemActionBar, supportProps undefined");
      return null;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.props.supportProps;
   // console.log(this.props.commentButtonHide, this.props.shareButtonHide, support_count, oppose_count, is_support, is_oppose );
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      // console.log("support_count: ", support_count, ", oppose_count: ", oppose_count, ", is_support: ", is_support, ", is_oppose: ", is_oppose);
      return null;
    }
    const stance_button_class = "item-actionbar__btn item-actionbar__btn--oppose btn btn-default";
    const icon_size = 18;
    var icon_color = "#999";
    var url_being_shared;
    if (this.props.type === "CANDIDATE") {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/candidate/" + this.props.ballot_item_we_vote_id;
    } else {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/measure/" + this.props.ballot_item_we_vote_id;
    }
    const share_icon = <span className="btn__icon"><Icon name="share-icon" width={icon_size} height={icon_size} color={icon_color} /></span>;
    return <div className={ this.props.shareButtonHide ? "item-actionbar--inline" : "item-actionbar" }>
            <div className={"btn-group" + (!this.props.shareButtonHide ? " u-inline--sm" : "")}>
              <button className={is_support ? `${stance_button_class} highlight_thumb_green` : stance_button_class} onClick={this.supportItem.bind(this, is_support)}>
                <span className="btn__icon">
                  <Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={icon_color} />
                </span>
                <span className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Support</span>
              </button>
              <button className={is_oppose ? `${stance_button_class} highlight_thumb_red` : stance_button_class} onClick={this.opposeItem.bind(this, is_oppose)}>
                <span className="btn__icon">
                  <Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={icon_color} />
                </span>
                <span className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Oppose</span>
              </button>
            </div>
      { this.props.commentButtonHide ?
        null :
         <button className="item-actionbar__btn item-actionbar__btn--comment btn btn-default u-inline--sm" onClick={this.props.toggleFunction}>
            <span className="btn__icon">
              <Icon name="comment-icon" width={icon_size} height={icon_size} color={icon_color} />
            </span>
            <span className="item-actionbar__position-btn-label">Comment</span>
          </button> }

      { this.props.shareButtonHide ?
        null :
        <ShareButtonDropdown urlBeingShared={url_being_shared} shareIcon={share_icon} shareText={"Share"} /> }
    </div>;
  }
}
