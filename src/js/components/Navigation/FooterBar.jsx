import React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import { historyPush } from '../../utils/cordovaUtils';
import { stringContains } from '../../utils/textFormat';

class FooterBar extends React.Component {
  static propTypes = {
    pathname: PropTypes.string,
  };

  handleChange = (event, value) => {
    switch (value) {
      case 0:
        return historyPush('/ballot');
      case 1:
        return historyPush('/values');
      case 2:
        return historyPush('/friends');
      case 3:
        return historyPush('/settings/menu');
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot', pathname)) return 0;
    if (stringContains('/friends', pathname)) return 2;
    if (stringContains('/value', pathname)) return 1; // '/values'
    if (stringContains('/settings/', pathname)) return 3;
    return -1;
  };

  render () {
    // console.log('FooterBar render');
    return (
      <div className="footer-container u-show-mobile-tablet">
        <BottomNavigation
          value={this.getSelectedTab()}
          onChange={this.handleChange}
          showLabels
        >
          <BottomNavigationAction className="no-outline" label="Ballot" showLabel icon={<DescriptionIcon />} />
          <BottomNavigationAction className="no-outline" label="Values" showLabel icon={<QuestionAnswerIcon />} />
          <BottomNavigationAction className="no-outline" label="Friends" showLabel icon={<PeopleIcon />} />
          {/* <BottomNavigationAction className="no-outline" label="Vote" showLabel icon={<ion-icon class="footer-icon" name="clipboard" />} /> */}
          <BottomNavigationAction className="no-outline" id="valuesTabFooterBar" label="Settings" showLabel icon={<SettingsIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default FooterBar;
