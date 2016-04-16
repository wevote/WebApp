import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import HeaderIcons from "./Navigation/HeaderIcons";

export default class Header extends Component {
  static propTypes = {
    email: PropTypes.string,
    location: PropTypes.string,
    first_name: PropTypes.string,
    voter_photo_url: PropTypes.string,
    signed_in_personal: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount () {
    document.body.addEventListener("click", this.pageClick.bind(this), false);
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  pageClick () {
    this.hide();
  }

  show () {
    var mainContainer = document.querySelector(".container-main");
    if (this.state.visible) {
      document.addEventListener("click", this.setState({visible: false}));
      mainContainer.style.opacity = 1;
    } else {
      document.addEventListener("click", this.setState({visible: true}));
      mainContainer.style.opacity = 0.2;
    }
  }

  hide () {
    this.setState({visible: false});
    document.querySelector(".container-main").style.opacity = 1;
  }

  render () {
    var { visible } = this.state;
    let location = this.props.location;
    var { signed_in_personal: signedIn } = this.props;

    const header =
      <header className="header row">
          <section className="separate-bottom container-fluid">
            <h4 className="pull-left gutter-left--window bold">
              <span onClick={this.show.bind(this)} className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment device-icon--large">
              </span>
              <Link to="/ballot">
                My Voter Guide
              </Link>
              <span className="header-version"> demo</span>
            </h4>
            <div className="header-address pull-right gutter-right--window gutter-top--small">
              <Link to="/settings/location" className="font-lightest">
                {location}
              </Link>
            </div>
            <HeaderIcons />
          </section>
      {/* The components/MoreMenu code has to be reproduced here for mobile */}
        <div className={(visible ? "visible" : "hidden") + " device-menu--mobile container-fluid well well-90"}>
          {/* Please keep these styles up-to-date since we need to turn this on soon
          { signedIn ? <span></span> :
            <span>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    <div>
                    Sign In
                    </div>
                  </Link>
                </li>
              </ul>
              <h4 className="text-left"></h4>
            </span>
          }
          */}
          <ul className="list-group">
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/ballot">
                <div>
                All Ballot Items
                </div>
              </Link>
            </li>
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/more/opinions/followed">
                <div>
                Opinions I'm Following
                </div>
              </Link>
            </li>
            <li className="list-group-item">
            <Link onClick={this.hide.bind(this)} to={{ pathname: "/ballot", query: { type: "filterSupport" } }}>
              <div>
                What I Support
              </div>
            </Link>
            </li>
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to={{ pathname: "/ballot", query: { type: "filterRemaining" } }}>
                <div>
                Choices Remaining
                </div>
              </Link>
            </li>
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/settings/location">
                <div>
                My Address
                </div>
              </Link>
            </li>
            { signedIn ?
                <li className="list-group-item">
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    <div>
                    Account Settings
                    </div>
                  </Link>
                </li> :
                <span></span>
            }
          </ul>
          <h4 className="text-left"></h4>
          <ul className="list-group">
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/more/about">
                <div>
                About <strong>We Vote</strong>
                </div>
              </Link>
            </li>
            { signedIn ?
              <li className="list-group-item">
                <Link onClick={this.hide.bind(this)} to="/signout">
                  <div>
                  Sign Out
                  </div>
                </Link>
              </li> : <span></span> }
          </ul>
        </div>
      </header>;

    return header;
  }
}
