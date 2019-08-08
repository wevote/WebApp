import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import { renderLog } from '../../utils/logging';

class EndorsementModeTabs extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      getVoterGuideSettingsDashboardEditMode: '',
    };
  }

  componentDidMount () {
    // console.log('EndorsementModeTabs componentDidMount, this.props: ', this.props);
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  shouldComponentUpdate (nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    // console.log("EndorsementModeTabs shouldComponentUpdate");
    if (this.state.getVoterGuideSettingsDashboardEditMode !== nextState.getVoterGuideSettingsDashboardEditMode) {
      // console.log("shouldComponentUpdate: this.state.getVoterGuideSettingsDashboardEditMode", this.state.getVoterGuideSettingsDashboardEditMode, ", nextProps.getVoterGuideSettingsDashboardEditMode", nextProps.getVoterGuideSettingsDashboardEditMode);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      getVoterGuideSettingsDashboardEditMode: AppStore.getVoterGuideSettingsDashboardEditMode(),
    });
  }

  getSelectedTab = () => {
    const { getVoterGuideSettingsDashboardEditMode } = this.state;
    switch (getVoterGuideSettingsDashboardEditMode) {
      default:
      case 'positions':
        return 0;
      case 'addpositions':
        return 1;
    }
  }

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppActions.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  render () {
    // console.log('EndorsementModeTabs render, this.state.getVoterGuideSettingsDashboardEditMode:', this.state.getVoterGuideSettingsDashboardEditMode);
    renderLog(__filename);
    const { classes } = this.props; // constants ballotLength and ballotLengthRemaining are supposed to be included

    return (
      <Tabs
        value={this.getSelectedTab()}
        indicatorColor="primary"
        classes={{ root: classes.tabsRoot, flexContainer: classes.tabsFlexContainer, scroller: classes.scroller }}
      >
        <Tab
          classes={{ labelContainer: classes.tabLabelContainer, root: classes.tabRoot }}
          id="allItemsCompletionLevelTab"
          onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('positions')}
          label={(
            <Badge>
              <span className="u-show-mobile">
                Endorsed
              </span>
              <span className="u-show-desktop-tablet">
                Endorsed or Opposed
              </span>
            </Badge>
          )}
        />

        <Tab
          classes={{ labelContainer: classes.tabLabelContainer, root: classes.tabRoot }}
          id="remainingChoicesCompletionLevelTab"
          onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
          label={(
            <Badge>
              <span className="u-show-mobile">
                Add Endorsements
              </span>
              <span className="u-show-desktop-tablet">
                Add Endorsements
              </span>
            </Badge>
          )}
        />
      </Tabs>
    );
  }
}

const styles = theme => ({
  badge: {
    top: 9,
    right: -14,
    minWidth: 16,
    width: 20,
    height: 19.5,
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
      right: -11,
      width: 16,
      height: 16,
      top: 11,
    },
  },
  badgeColorPrimary: {
    background: 'rgba(0, 0, 0, .15)',
    color: '#333',
  },
  tabLabelContainer: {
    padding: '6px 6px',
    [theme.breakpoints.down('md')]: {
      padding: '6px 20px',
    },
  },
  tabsRoot: {
    minHeight: 38,
    height: 38,
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
  tabsFlexContainer: {
    height: 38,
  },
  tabRoot: {
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
    },
  },
  indicator: {
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
    },
  },
  scroller: {
    overflowY: 'hidden',
  },
});

export default withStyles(styles)(EndorsementModeTabs);

