import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BallotActions from '../../actions/BallotActions';
import { renderLog } from '../../utils/logging';

export default class BallotTabsRaccoon extends Component {
  static propTypes = {
    completionLevelFilterType: PropTypes.string,
    ballotLength: PropTypes.number,
    ballotLengthRemaining: PropTypes.number,
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

  goToDifferentCompletionLevelTab (completionLevelFilterType = '') {
    BallotActions.completionLevelFilterTypeSave(completionLevelFilterType);
  }

  render () {
    // console.log("BallotTabsRaccoon render, this.props.completionLevelFilterType:", this.props.completionLevelFilterType);
    renderLog(__filename);

    const remainingDecisionsCountIsDifferentThanAllItems = this.props.ballotLength !== this.props.ballotLengthRemaining;
    const showRemainingDecisions = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const showDecisionsMade = (remainingDecisionsCountIsDifferentThanAllItems && this.props.ballotLengthRemaining) || false;
    const itemsDecidedCount = this.props.ballotLength - this.props.ballotLengthRemaining || 0;

    return (
      <ul className="nav ballot__tabs">
        <li className="tab__item">
          <Link
            onClick={() => this.goToDifferentCompletionLevelTab('filterAllBallotItems')}
            className={this.props.completionLevelFilterType === 'filterAllBallotItems' ? 'tab tab--active' : 'tab tab--default'}
          >
            {/* Desktop */}
            <span className="d-none d-sm-block">
              All Items (
              {this.props.ballotLength}
              )
            </span>
            {/* Mobile */}
            <span className="d-block d-sm-none">
              All (
              {this.props.ballotLength}
              )
            </span>
          </Link>
        </li>

        { showRemainingDecisions ? (
          <li className="tab__item">
            <Link
              onClick={() => this.goToDifferentCompletionLevelTab('filterRemaining')}
              className={this.props.completionLevelFilterType === 'filterRemaining' ? 'tab tab--active' : 'tab tab--default'}
            >
              {/* Desktop */}
              <span className="d-none d-sm-block">
                Remaining Choices (
                {this.props.ballotLengthRemaining}
                )
              </span>
              {/* Mobile */}
              <span className="d-block d-sm-none">
                Choices (
                {this.props.ballotLengthRemaining}
                )
              </span>
            </Link>
          </li>
        ) : null
        }

        { showDecisionsMade ? (
          <li className="tab__item">
            <Link
              onClick={() => this.goToDifferentCompletionLevelTab('filterDecided')}
              className={this.props.completionLevelFilterType === 'filterDecided' ? 'tab tab--active' : 'tab tab--default'}
            >
              {/* Desktop */}
              <span className="d-none d-sm-block">
                Items Decided (
                {itemsDecidedCount}
                )
              </span>
              {/* Mobile */}
              <span className="d-block d-sm-none">
                Decided (
                {itemsDecidedCount}
                )
              </span>
            </Link>
          </li>
        ) : null
        }
      </ul>
    );
  }
}
