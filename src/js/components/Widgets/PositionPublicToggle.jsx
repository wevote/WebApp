import React, { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import ReactBootstrapToggle from "react-bootstrap-toggle";

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
    let on = "Public";
    let off = "Friends";
    var onChange;
    if (is_public_position) {
      onChange = this.showItemToFriendsOnly.bind(this);
    } else {
      onChange = this.showItemToPublic.bind(this);
    }

    const positionPublicToggle =
    <div className={this.props.className}>
      <ReactBootstrapToggle on={on} off={off} active={is_public_position}
                            onstyle="success" size="mini"
                            width="55px" height="20px"
                            onChange={onChange} />
                        </div>;
    return positionPublicToggle;
  }
}
