import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class BallotTitleDropdown extends Component {
  static propTypes = {
    params: PropTypes.object,
    ballot_type: PropTypes.string
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

  getBallotTitle (ballot_type){
    switch (ballot_type) {
      case "CHOICES_REMAINING":
        return "Choices Remaining on My Ballot";
      case "WHAT_I_SUPPORT":
        return "What I Support on My Ballot";
      case "BOOKMARKS":
        return "What I Have Bookmarked";
      default :  // ALL_BALLOT_ITEMS
        return "All Ballot Items";
    }
  }

  render () {
    const {ballot_type} = this.props;
    const onClick = this.state.open ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);

    var position_icon = "";

    return <div className="btn-group open">
      <button onClick={onClick}
              className="dropdown ballot-title-dropdown__btn ballot-title-dropdown__btn--position-selected btn btn-default">
        {position_icon}
        <span className="ballot-title-dropdown__header-text">{this.getBallotTitle(ballot_type)}</span>
        <span className="caret" />
      </button>
      {this.state.open &&
        <ul className="dropdown-menu">
          { ballot_type == "ALL_BALLOT_ITEMS" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)} to="/ballot">
                <div>
                  <span className="ballot-title-dropdown__header-text">All Ballot Items</span>
                </div>
              </Link>
            </li>
          }
          { ballot_type == "CHOICES_REMAINING" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)}
                    to={{ pathname: "/ballot", query: { type: "filterRemaining" } }}>
                <div>
                  <span className="ballot-title-dropdown__header-text">Choices Remaining on My Ballot</span>
                </div>
              </Link>
            </li>
          }
          { ballot_type == "WHAT_I_SUPPORT" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)} to={{pathname: "/ballot", query: {type: "filterSupport"}}}>
                <div>
                  <span className="ballot-title-dropdown__header-text">What I Support on My Ballot</span>
                </div>
              </Link>
            </li>
          }
          { ballot_type == "BOOKMARKS" ?
            null :
            <li>
              <Link onClick={this.closeDropdown.bind(this)} to="/bookmarks">
                <div>
                  <span className="ballot-title-dropdown__header-text">What I Have Bookmarked</span>
                </div>
              </Link>
            </li>
          }
        </ul>
      }
    </div>;
  }
}
