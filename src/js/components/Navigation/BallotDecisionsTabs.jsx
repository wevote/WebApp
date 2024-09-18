import { Badge, Tab, Tabs } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BallotActions from '../../actions/BallotActions';
import { renderLog } from '../../common/utils/logging';


class BallotDecisionsTabs extends Component {
  shouldComponentUpdate (nextProps) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    // console.log('BallotDecisionsTabs shouldComponentUpdate');
    if (this.props.completionLevelFilterType !== nextProps.completionLevelFilterType) {
      // console.log('shouldComponentUpdate: this.props.completionLevelFilterType', this.props.completionLevelFilterType, ', nextProps.completionLevelFilterType', nextProps.completionLevelFilterType);
      return true;
    }
    if (this.props.ballotLength !== nextProps.ballotLength) {
      // console.log('shouldComponentUpdate: this.props.ballotLength', this.props.ballotLength, ', nextProps.ballotLength', nextProps.ballotLength);
      return true;
    }
    if (this.props.ballotLengthRemaining !== nextProps.ballotLengthRemaining) {
      // console.log('shouldComponentUpdate: this.props.ballotLengthRemaining', this.props.ballotLengthRemaining, ', nextProps.ballotLengthRemaining', nextProps.ballotLengthRemaining);
      return true;
    }
    return false;
  }

  getSelectedTab = () => {
    const { ballotLength, ballotLengthRemaining, completionLevelFilterType } = this.props;
    const remainingDecisionsCountIsDifferentThanAllItems = ballotLength !== ballotLengthRemaining;
    const showRemainingDecisions = (remainingDecisionsCountIsDifferentThanAllItems && ballotLengthRemaining) || false;
    const showDecisionsMade = (remainingDecisionsCountIsDifferentThanAllItems && ballotLengthRemaining) || false;
    switch (completionLevelFilterType) {
      case 'filterAllBallotItems':
        return 0;
      case 'filterRemaining':
        if (showRemainingDecisions) {
          return 1;
        } else {
          return 0;
        }
      case 'filterDecided':
        if (showDecisionsMade) {
          return 2;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  };

  goToDifferentCompletionLevelTab (completionLevelFilterType = '') {
    if (this.props.setBallotItemFilterTypeToAll) {
      this.props.setBallotItemFilterTypeToAll();
    }
    BallotActions.completionLevelFilterTypeSave(completionLevelFilterType);
  }

  render () {
    renderLog('BallotDecisionsTabs');  // Set LOG_RENDER_EVENTS to log all renders
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
        sx={{
          '& .MuiTab-root': {
            '&:hover': {
              backgroundColor: '#E5E6EA',
            },
          },
        }}
      >
        {/* labelContainer: classes.tabLabelContainer,  */}
        <Tab
          classes={{ root: classes.tabRootAllChoice }}
          id="allItemsCompletionLevelTab"
          onClick={() => this.goToDifferentCompletionLevelTab('filterAllBallotItems')}
          label={(
            <Badge
              classes={{ badge: classes.badge, colorPrimary: this.getSelectedTab() === 0 ? null : classes.badgeColorPrimary }}
              color="primary"
              badgeContent={<BadgeCountWrapper>{ballotLength}</BadgeCountWrapper>}
              id="ballotDecisionsTabsAllItems"
              invisible={ballotLength === 0}
            >
              <span className="u-show-mobile">
                All
              </span>
              <span className="u-show-desktop-tablet">
                All
              </span>
            </Badge>
          )}
        />

        { showRemainingDecisions ? (
          <Tab
            classes={{ root: classes.tabRoot }}
            id="remainingChoicesCompletionLevelTab"
            onClick={() => this.goToDifferentCompletionLevelTab('filterRemaining')}
            style={{ paddingRight: '26px' }}
            label={(
              <Badge
                classes={{ badge: classes.badge, colorPrimary: this.getSelectedTab() === 1 ? null : classes.badgeColorPrimary }}
                color="primary"
                badgeContent={<BadgeCountWrapper>{ballotLengthRemaining}</BadgeCountWrapper>}
                id="ballotDecisionTabsRemainingChoices"
                invisible={ballotLengthRemaining === 0}
              >
                <span className="u-show-mobile">
                  Choices
                </span>
                <span className="u-show-desktop-tablet">
                  Remaining Choices
                </span>
              </Badge>
            )}
          />
        ) : null}

        { showDecisionsMade ? (
          <Tab
            classes={{ root: classes.tabRoot }}
            id="decidedItemsCompletionLevelTab"
            onClick={() => this.goToDifferentCompletionLevelTab('filterDecided')}
            label={(
              <Badge
                classes={{ badge: classes.badge, colorPrimary: this.getSelectedTab() === 2 ? null : classes.badgeColorPrimary }}
                color="primary"
                badgeContent={<BadgeCountWrapper>{itemsDecidedCount}</BadgeCountWrapper>}
                id="ballotDecisionsTabsItemsDecided"
                invisible={itemsDecidedCount === 0}
              >
                Chosen
              </Badge>
            )}
          />
        ) : null}
      </Tabs>
    );
  }
}
BallotDecisionsTabs.propTypes = {
  ballotLength: PropTypes.number,
  ballotLengthRemaining: PropTypes.number,
  classes: PropTypes.object,
  completionLevelFilterType: PropTypes.string,
  setBallotItemFilterTypeToAll: PropTypes.func,
};

// mobile transition: sm
const styles = (theme) => ({
  badge: {
    height: 19.5,
    right: -14,
    top: 9,
    minWidth: 16,
    width: 20,
    [theme.breakpoints.down('sm')]: {
      fontSize: 8,
      height: 16,
      right: -11,
      top: 11,
      width: 16,
    },
  },
  badgeColorPrimary: {
    background: 'rgba(0, 0, 0, .15)',
    color: '#333',
  },
  tabLabelContainer: {
    padding: '6px 6px',
    [theme.breakpoints.down('sm')]: {
      padding: '6px 20px',
    },
  },
  tabsRoot: {
    minHeight: 38,
    height: 38,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
  },
  tabsFlexContainer: {
    height: 38,
  },
  tabRootAllChoice: {
    [theme.breakpoints.down('sm')]: {
      minWidth: 75,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 180,
    },
  },
  tabRoot: {
    [theme.breakpoints.down('sm')]: {
      minWidth: 100,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 180,
    },
  },
  indicator: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 180,
    },
  },
  scroller: {
    overflowY: 'hidden',
  },
});

const BadgeCountWrapper = styled('span')(({ theme }) => (`
  padding-top: 2px;
  ${theme.breakpoints.down('md')} {
    padding-top: 1px;
  }
`));

export default withStyles(styles)(BallotDecisionsTabs);

