import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import ReactBootstrapToggle from "react-bootstrap-toggle";
const Icon = require("react-svg-icons");

export default class PositionPublicToggle extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    supportProps: PropTypes.object
  };

  showItemToFriendsOnly () {
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "FRIENDS_ONLY");
  }

  showItemToPublic () {
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "SHOW_PUBLIC");
  }

  render () {
    if (this.props.supportProps === undefined){
      return <div className="undefined-props" />;
    }

    var { is_public_position } = this.props.supportProps;
    let visibilityPublic = "Public";
    let visibilityFriendsOnly = "Your friends";
    const publicIcon = <Icon alt="Visible to Public" name="public-icon" color="#fff" width={18} height={18} />;
    const friendsIcon = <Icon alt="Visible to Friends Only" name="group-icon" color="#555" width={18} height={18} />;
    const tooltip = <Tooltip id="visibility-tooltip">{is_public_position ? visibilityPublic : visibilityFriendsOnly}</Tooltip>;

    var onChange;
    var that = this;
    if (is_public_position) {
      onChange = function () {
        is_public_position = false;
        that.showItemToFriendsOnly();
      };
    } else {
      onChange = function () {
        is_public_position = true;
        that.showItemToPublic();
      };
    }
// this onKeyDown function is for accessibility: the parent div of the toggle
// has a tab index so that users can use tab key to select the toggle, and then
// press either space or enter (key codes 32 and 13, respectively) to toggle
    var onKeyDown = function (e) {
      let enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onChange();
      }
    };

    const positionPublicToggle =
    <div className={this.props.className}>
      <div style={{display: "inline-block"}}>
        <OverlayTrigger className="trigger" placement="top" overlay={tooltip}>
          <div tabIndex="0" onKeyDown={onKeyDown}> {/*tabIndex and onKeyDown are for accessibility*/}
            <ReactBootstrapToggle on={publicIcon} off={friendsIcon}
                                    active={is_public_position}
                                    onstyle="success" size="mini"
                                    width="40px"
                                    onChange={onChange} /></div>
                                  </OverlayTrigger>
                                </div>
                              </div>;
    return positionPublicToggle;
  }
}
