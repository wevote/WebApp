import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import BallotActions from '../../actions/BallotActions';
import { renderLog } from '../../utils/logging';

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
  scroller: {
    overflowY: 'hidden',
  },
});

class BallotTabsRaccoon extends Component {
  static propTypes = {
    completionLevelFilterType: PropTypes.string,
    ballotLength: PropTypes.number,
    ballotLengthRemaining: PropTypes.number,
    classes: PropTypes.object,
  };

  shouldComponentUpdate (nextProps) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    // console.log("BallotTabsRaccoon shouldComponentUpdate");
    if (this.props.completionLevelFilterType !== nextProps.completionLevelFilterType) {
      // console.log("shouldComponentUpdate: this.props.completionLevelFilterType", this.props.completionLevelFilterType, ", nextProps.completionLevelFilterType", nextProps.completionLevelFilterType);
      return true;
    }
    if (this.props.ballotLength !== nextProps.ballotLength) {
      // console.log("shouldComponentUpdate: this.props.ballotLength", this.props.ballotLength, ", nextProps.ballotLength", nextProps.ballotLength);
      return true;
    }
    if (this.props.ballotLengthRemaining !== nextProps.ballotLengthRemaining) {
      // console.log("shouldComponentUpdate: this.props.ballotLengthRemaining", this.props.ballotLengthRemaining, ", nextProps.ballotLengthRemaining", nextProps.ballotLengthRemaining);
      return true;
    }
    return false;
  }

  getSelectedTab = () => {
    const { completionLevelFilterType } = this.props;
    switch (completionLevelFilterType) {
      case 'filterAllBallotItems':
        return 0;
      case 'filterRemaining':
        return 1;
      case 'filterDecided':
        return 2;
      default:
        return false;
    }
  }

  goToDifferentCompletionLevelTab (completionLevelFilterType = '') {
    BallotActions.completionLevelFilterTypeSave(completionLevelFilterType);
  }

  render () {
    // console.log("BallotTabsRaccoon render, this.props.completionLevelFilterType:", this.props.completionLevelFilterType);
    renderLog(__filename);
    const { classes, ballotLength, ballotLengthRemaining } = this.props;
    const remainingDecisionsCountIsDifferentThanAllItems = this.props.ballotLength !== this.props.ballotLengthRemaining;
    const showRemainingDecisions = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const showDecisionsMade = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const itemsDecidedCount = this.props.ballotLength - this.props.ballotLengthRemaining || 0;

    return (
      <Tabs
        value={this.getSelectedTab()}
        indicatorColor="primary"
        classes={{ root: classes.tabsRoot, flexContainer: classes.tabsFlexContainer, scroller: classes.scroller }}
      >
        <Tab
          classes={{ labelContainer: classes.tabLabelContainer }}
          onClick={() => this.goToDifferentCompletionLevelTab('filterAllBallotItems')}
          label={(
            <Badge
              classes={{ badge: classes.badge }}
              color="primary"
              badgeContent={ballotLength}
              invisible={ballotLength === 0}
            >
              All
            </Badge>
          )}
        />

        { showRemainingDecisions ? (
          <Tab
            classes={{ labelContainer: classes.tabLabelContainer }}
            onClick={() => this.goToDifferentCompletionLevelTab('filterRemaining')}
            label={(
              <Badge
                classes={{ badge: classes.badge }}
                color="primary"
                badgeContent={ballotLengthRemaining}
                invisible={ballotLengthRemaining === 0}
              >
                Choices
              </Badge>
            )}
          />
        ) : null
        }

        { showDecisionsMade ? (
          <Tab
            classes={{ labelContainer: classes.tabLabelContainer }}
            onClick={() => this.goToDifferentCompletionLevelTab('filterDecided')}
            label={(
              <Badge
                classes={{ badge: classes.badge }}
                color="primary"
                badgeContent={itemsDecidedCount}
                invisible={itemsDecidedCount === 0}
              >
                Decided
              </Badge>
            )}
          />
        ) : null
        }
      </Tabs>
    );
  }
}

export default withStyles(styles)(BallotTabsRaccoon);

