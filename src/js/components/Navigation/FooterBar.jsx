import React from "react";
import PropTypes from "prop-types";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { historyPush } from "../../utils/cordovaUtils";
import { stringContains } from "../../utils/textFormat";

class FooterBar extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
  };

  handleChange = (event, value) => {
    switch (value) {
      case 0:
        return historyPush("/ballot");
      case 1:
        return historyPush("/more/network/issues");
      case 2:
        return historyPush("/more/network/friends");
      case 3:
        return historyPush("/settings/menu");
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains("/ballot", pathname)) return 0;
    if (stringContains("/more/network/friends", pathname)) return 2;
    if (stringContains("/more/network", pathname)) return 1;
    if (stringContains("/settings/", pathname)) return 3;
    return -1;
  }

  render () {
    return (
      <div className="footer-container u-show-mobile-tablet">
        <BottomNavigation
          value={this.getSelectedTab()}
          onChange={this.handleChange}
          showLabels
        >
          <BottomNavigationAction className="no-outline" label="Ballot" showLabel icon={<ion-icon class="footer-icon" name="paper" />} />
          <BottomNavigationAction className="no-outline" label="Values" showLabel icon={<ion-icon class="footer-icon" name="chatbubbles" />} />
          <BottomNavigationAction className="no-outline" label="Friends" showLabel icon={<ion-icon class="footer-icon" name="people" />} />
          {/* <BottomNavigationAction className="no-outline" label="Vote" showLabel icon={<ion-icon class="footer-icon" name="clipboard" />} /> */}
          <BottomNavigationAction className="no-outline" label="Settings" showLabel icon={<ion-icon class="footer-icon" name="settings" />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default FooterBar;
