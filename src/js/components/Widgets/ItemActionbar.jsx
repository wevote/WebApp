import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
const web_app_config = require("../../config");

export default class ItemActionBar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    transitioning: PropTypes.bool,
    supportProps: PropTypes.object
  };

  share (){
    const url = web_app_config.WE_VOTE_HOSTNAME + "/candidate/" + this.props.we_vote_id;
    window.FB.ui({
      display: "popup",
      method: "share",
      href: url,
      redirect_uri: url
    }, function (){});
  }

  supportItem () {
    if (this.props.transitioning){ return; }
    SupportActions.voterSupportingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopSupportingItem () {
    if (this.props.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  opposeItem () {
    if (this.props.transitioning){ return; }
    SupportActions.voterOpposingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopOpposingItem () {
    if (this.props.transitioning){ return; }
    SupportActions.voterStopOpposingSave(this.props.we_vote_id, this.props.type);
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

    const removePosition = is_support ? this.stopSupportingItem.bind(this) : this.stopOpposingItem.bind(this);
    const positionText = is_support ? "I Support" : "I Oppose";
    const itemActionBar =
      <div className="item-actionbar">
        { //Show the position voter has taken
          is_oppose || is_support ?
          <div className="">
            <button className="item-actionbar__btn item-actionbar__btn--position bs-btn bs-btn-default">{positionText} <span className="bs-caret"></span>
              <ul className="">
                <li>
                  <a onClick={removePosition}>Remove Position</a>
                </li>
              </ul>
            </button> 
          </div> :
          // Voter hasn't supported or opposed, show both options
          <div>
            <button className="item-actionbar__btn item-actionbar__btn--support bs-btn bs-btn-default" onClick={this.supportItem.bind(this)}>Support</button>
            <button className="item-actionbar__btn item-actionbar__btn--oppose bs-btn bs-btn-default" onClick={this.opposeItem.bind(this)}>Oppose</button>
          </div>
        }
        <button className={!is_oppose && !is_support ? "item-actionbar__btn item-actionbar__btn--share bs-btn bs-btn-default bs-hidden-xs" : "item-actionbar__btn item-actionbar__btn--share bs-btn bs-btn-default"} onClick={this.share.bind(this)} >Share</button>
      </div>;
    return itemActionBar;
  }
}
