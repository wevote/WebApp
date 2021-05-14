import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { renderLog } from '../utils/logging';

export default class WouldYouLikeToMergeAccounts extends Component {
  render () {
    renderLog('WouldYouLikeToMergeAccounts');  // Set LOG_RENDER_EVENTS to log all renders
    const { cancelMergeFunction, pleaseMergeAccountsFunction } = this.props;

    return (
      <div className="guidelist card-child__list-group">
        <span>
          <Alert variant="warning">
            The choices you&apos;ve made in this browser (when not signed in) can be merged with choices stored the previous time you signed in.
            <br />
            <br />
            Press &quot;Cancel Sign In&quot; to stop signing in, and keep your recent changes.
            <br />
            <br />
            Press &quot;Sign In and Merge My Offline Changes&quot; to merge your recent choices with the choices that were saved when you previously signed in.
          </Alert>
        </span>

        <div className="u-stack--md">
          <Button
            onClick={cancelMergeFunction}
            variant="default"
            size="small"
          >
            Cancel Sign In
          </Button>
          <Button
            onClick={pleaseMergeAccountsFunction}
            variant="primary"
          >
            Sign In and Merge My Offline Changes
          </Button>
        </div>
      </div>
    );
  }
}
WouldYouLikeToMergeAccounts.propTypes = {
  pleaseMergeAccountsFunction: PropTypes.func.isRequired,
  cancelMergeFunction: PropTypes.func.isRequired,
};
