import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import PositionDropdown from "./PositionDropdown";
import ReactBootstrapToggle from "react-bootstrap-toggle";

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

  share (){
    const url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/candidate/" + this.props.ballot_item_we_vote_id;
    window.FB.ui({
      display: "popup",
      method: "share",
      href: url,
      redirect_uri: url
    }, function (){});
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

  showItemToFriendsOnly () {
    if (this.state.transitioning){ return; }
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "FRIENDS_ONLY");
    this.setState({transitioning: true});
  }

  showItemToPublic () {
    if (this.state.transitioning){ return; }
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "SHOW_PUBLIC");
    this.setState({transitioning: true});
  }

  render () {
    if (this.props.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose, is_public_position } = this.props.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return null;
    }

    const iconSize = 18;
    var iconColor = "#999";
    var selectedColor = "#0D546F";
    let on = "Public";
    let off = "Friends";
    var onChange;
    if (is_public_position) {
      onChange = this.showItemToFriendsOnly.bind(this);
    } else {
      onChange = this.showItemToPublic.bind(this);
    }
    const removePosition = is_support ? this.stopSupportingItem.bind(this) : this.stopOpposingItem.bind(this);
    const positionText = is_support ? "I Support" : "I Oppose";
    const positionIcon = is_support ?
      <span className="btn__icon"><Icon name="thumbs-up-icon" width={iconSize} height={iconSize} color={selectedColor} /></span> :
      <span className="btn__icon"><Icon name="thumbs-down-icon" width={iconSize} height={iconSize} color={selectedColor} /></span>;
    const itemActionBar =
      <div className="item-actionbar">
        { //Show the position voter has taken
          is_oppose || is_support ?
          <PositionDropdown removePosition={removePosition} positionIcon={positionIcon} positionText={positionText}/> :
          // Voter hasn't supported or opposed, show both options
          <div>
            <button className="item-actionbar__btn item-actionbar__btn--support btn btn-default" onClick={this.supportItem.bind(this)}>
              <span className="btn__icon">
                <Icon name="thumbs-up-icon" width={iconSize} height={iconSize} color={iconColor} />
              </span>
              <span>Support</span>
            </button>
            <button className="item-actionbar__btn item-actionbar__btn--oppose btn btn-default" onClick={this.opposeItem.bind(this)}>
              <span className="btn__icon">
                <Icon name="thumbs-down-icon" width={iconSize} height={iconSize} color={iconColor} />
              </span>
              <span>Oppose</span>
            </button>
          </div>
        }
        <button className={!is_oppose && !is_support ?
          "item-actionbar__btn item-actionbar__btn--share btn btn-default hidden-xs" :
          "item-actionbar__btn item-actionbar__btn--share btn btn-default"}
                onClick={this.share.bind(this)} >
          <span className="btn__icon">
            <Icon name="share-icon" width={iconSize} height={iconSize} color={iconColor} />
          </span>
          Share
        </button>
        <div className="rightToggle">
          <ReactBootstrapToggle on={on} off={off} active={is_public_position}
                                onstyle="success" size="mini"
                                width="55px" height="20px"
                                onChange={onChange} />
        </div>
      </div>;
    return itemActionBar;
  }
}
