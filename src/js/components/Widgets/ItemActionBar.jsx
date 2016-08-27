import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import PositionDropdown from "./PositionDropdown";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
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

  render () {
    if (this.props.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.props.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return null;
    }

    const iconSize = 18;
    var iconColor = "#999";
    var selectedColor = "#0D546F";

    const removePosition = is_support ? this.stopSupportingItem.bind(this) : this.stopOpposingItem.bind(this);
    const positionText = is_support ? "I Support" : "I Oppose";
    const positionIcon = is_support ?
      <span className="btn__icon"><Icon name="thumbs-up-icon" width={iconSize} height={iconSize} color={selectedColor} /></span> :
      <span className="btn__icon"><Icon name="thumbs-down-icon" width={iconSize} height={iconSize} color={selectedColor} /></span>;
    const shareIcon = <span className="btn__icon"><Icon name="share-icon" width={iconSize} height={iconSize} color={iconColor} /></span>
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
        <ShareButtonDropdown removePosition={removePosition} positionIcon={shareIcon} positionText={"Share"} />
        <PositionPublicToggle ballot_item_we_vote_id={this.props.ballot_item_we_vote_id}
                              type={this.props.type}
                              supportProps={this.props.supportProps}
                              className="candidate-card-position-public-toggle"/>
      </div>;
    return itemActionBar;
  }
}
