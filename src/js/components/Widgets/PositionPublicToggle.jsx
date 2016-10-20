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
      return <div className="undefined-props"></div>;
    }

    var { is_public_position } = this.props.supportProps;
    let visibilityPublic = "Public";
    let visibilityFriendsOnly = "Your friends";
    const publicIcon = <Icon name="public-icon" color="#fff" width={18} height={18} />;
    const friendsIcon = <Icon name="group-icon" color="#555" width={18} height={18} />;
    const tooltip = <Tooltip id="visibility-tooltip">{is_public_position ? visibilityPublic : visibilityFriendsOnly}</Tooltip>;

    var onChange;
    var that = this;
    if (is_public_position) {
      onChange = function () {
        is_public_position = !is_public_position;
        that.showItemToFriendsOnly();
      };
    } else {
      onChange = function () {
        is_public_position = !is_public_position;
        that.showItemToPublic();
      };
    }

    const positionPublicToggle =
    <div className={this.props.className}>
      <div style={{display: "inline-block"}}>
        <OverlayTrigger className="trigger" placement="top" overlay={tooltip}>
          <div><ReactBootstrapToggle on={publicIcon} off={friendsIcon}
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
