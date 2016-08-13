import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class followingDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    following_type: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {open: false };
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  openDropdown () {
    this.setState({open: true});
  }

  getFollowingTitle (following_type){
    switch (following_type) {
      case "WHO_YOU_FOLLOW":
        return "Who You're Following";
      case "YOUR_FRIENDS":
        return "Your Friends";
      case "WHO_YOU_CAN_FOLLOW":
      default :
        return "Who You Can Follow";
    }
  }

  render () {
    const {following_type} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);

    var position_icon = "";

    return <div className="bs-btn-group bs-open">
      <button onClick={onClick}
              className="dropdown voter-following-dropdown__btn voter-following-dropdown__btn--position-selected bs-btn bs-btn-default">
        {position_icon}
        <span className="voter-following-dropdown__header-text">{this.getFollowingTitle(following_type)}</span>
        <span className="bs-caret" />
      </button>
      {this.state.open &&
        <ul className="bs-dropdown-menu">
          { following_type == "WHO_YOU_CAN_FOLLOW" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)} to="/opinions">
                <div>
                  <span className="voter-following-dropdown__header-text">Who You Can Follow</span>
                </div>
              </Link>
            </li>
          }
          { following_type == "WHO_YOU_FOLLOW" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)} to="/more/opinions/followed">
                <div>
                  <span className="voter-following-dropdown__header-text">Who You're Following</span>
                </div>
              </Link>
            </li>
          }
        </ul>
      }
    </div>;
  }
          // TODO Coming soon
          // { following_type == "YOUR_FRIENDS" ?
          //   null :
          //   <li>
          //     <Link onClick={this.closeDropdown.bind(this)} to="/friends">
          //       <div>
          //         <span className="voter-following-dropdown__header-text">Your Friends</span>
          //       </div>
          //     </Link>
          //   </li>
          // }
}
