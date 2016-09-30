import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import PositionDropdown from "./PositionDropdown";
import ShareButtonDropdown from "./ShareButtonDropdown";

var Icon = require("react-svg-icons");

const web_app_config = require("../../config");

export default class ItemActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    supportProps: PropTypes.object
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

  supportItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopSupportingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  opposeItem () {
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
      return null;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.props.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return null;
    }

    const icon_size = 18;
    var icon_color = "#999";
    var url_being_shared;
    if (this.props.type === "CANDIDATE") {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/candidate/" + this.props.ballot_item_we_vote_id;
    } else {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/measure/" + this.props.ballot_item_we_vote_id;
    }
    const remove_position_function = is_support ? this.stopSupportingItem.bind(this) : this.stopOpposingItem.bind(this);
    const position_text = is_support ? "Support" : "Oppose";
    const position_icon = is_support ?
      <span className="btn__icon"><Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={icon_color} /></span> :
      <span className="btn__icon"><Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={icon_color} /></span>;
    const share_icon = <span className="btn__icon"><Icon name="share-icon" width={icon_size} height={icon_size} color={icon_color} /></span>;
    return <div className="item-actionbar">
      { //Show the position voter has taken
        is_oppose || is_support ?
        <PositionDropdown removePositionFunction={remove_position_function} positionIcon={position_icon} positionText={position_text}/> :
        // Voter hasn't supported or opposed, show both options
        <div className="btn-group item-actionbar__btn-set">
          <button className="item-actionbar__btn item-actionbar__btn--support btn btn-default" onClick={this.supportItem.bind(this)}>
            <span className="btn__icon">
              <Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={icon_color} />
            </span>
            <span className="item-actionbar__position-btn-label">Support</span>
          </button>
          <button className="item-actionbar__btn item-actionbar__btn--oppose btn btn-default" onClick={this.opposeItem.bind(this)}>
            <span className="btn__icon">
              <Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={icon_color} />
            </span>
            <span className="item-actionbar__position-btn-label">Oppose</span>
          </button>
        </div>
      }
      <ShareButtonDropdown urlBeingShared={url_being_shared} shareIcon={share_icon} shareText={"Share"} />
    </div>;
  }
}
