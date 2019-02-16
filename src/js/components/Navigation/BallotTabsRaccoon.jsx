import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import BallotActions from '../../actions/BallotActions';
import { renderLog } from '../../utils/logging';

const styles = theme => ({
  tabLabelContainer: {
    padding: '6px 6px',
  },
  root: {
    color: theme.palette.primary,
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
    const { classes } = this.props;
    const remainingDecisionsCountIsDifferentThanAllItems = this.props.ballotLength !== this.props.ballotLengthRemaining;
    const showRemainingDecisions = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const showDecisionsMade = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const itemsDecidedCount = this.props.ballotLength - this.props.ballotLengthRemaining || 0;

    return (
      <Tabs value={this.getSelectedTab()} indicatorColor="primary">
        <Tab
          classes={{ labelContainer: classes.tabLabelContainer }}
          onClick={() => this.goToDifferentCompletionLevelTab('filterAllBallotItems')}
          label={`All (${this.props.ballotLength})`}
        />

        { showRemainingDecisions ? (
          <Tab
            classes={{ labelContainer: classes.tabLabelContainer }}
            onClick={() => this.goToDifferentCompletionLevelTab('filterRemaining')}
            label={`Choices (${this.props.ballotLengthRemaining})`}
          />
        ) : null
        }

        { showDecisionsMade ? (
          <Tab
            classes={{ labelContainer: classes.tabLabelContainer }}
            onClick={() => this.goToDifferentCompletionLevelTab('filterDecided')}
            label={`Decided (${itemsDecidedCount})`}
          />
        ) : null
        }
      </Tabs>
    );
  }
}

export default withStyles(styles)(BallotTabsRaccoon);

