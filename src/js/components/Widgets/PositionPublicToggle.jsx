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

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false
    };
  }

  componentWillReceiveProps () {
    this.setState({transitioning: false});
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
      return <div className="undefined-props"></div>;
    }

    var { is_public_position } = this.props.supportProps;
    let vPublic = "Public";
    let vFriendsOnly = "Your friends";
    const publicIcon = <Icon name="public-icon" color="#fff" width={18} height={18} />;
    const friendsIcon = <Icon name="group-icon" color="#555" width={18} height={18} />;
    const tooltip = <Tooltip id="tooltip">{is_public_position ? vPublic : vFriendsOnly}</Tooltip>;

    var onChange;
    if (is_public_position) {
      onChange = this.showItemToFriendsOnly.bind(this);
    } else {
      onChange = this.showItemToPublic.bind(this);
    }


    const positionPublicToggle =
    <div className={this.props.className}>
      <OverlayTrigger className="trigger" placement="top" overlay={tooltip}><div>
        <ReactBootstrapToggle on={publicIcon} off={friendsIcon} active={is_public_position}
                              onstyle="success" size="mini"
                              width="40px"
                              onChange={onChange} />
                            </div></OverlayTrigger>
                          </div>;
    return positionPublicToggle;
  }
}
