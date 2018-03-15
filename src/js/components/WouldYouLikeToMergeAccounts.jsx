import React, { Component, PropTypes } from "react";
import { Alert, Button } from "react-bootstrap";
import { historyPush } from "../utils/cordovaUtils";

export default class WouldYouLikeToMergeAccounts extends Component {
  static propTypes = {
    pleaseMergeAccountsFunction: PropTypes.func.isRequired,
    cancelMergeFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
  }

  cancelMerge () {
    historyPush("/more/sign_in");
  }

  render () {
    const {cancelMergeFunction, pleaseMergeAccountsFunction} = this.props;

    const merge_status_html = <span>
        <Alert bsStyle="warning">
          The choices you've made in this browser (when not logged in) can be merged with choices stored the previous time you signed in.<br />
          <br />
          Press "Cancel Sign In" to stop signing in, and keep your recent changes.<br />
          <br />
          Press "Sign In and Merge My Offline Changes" to merge your recent choices with the choices that were saved when you previously signed in.
        </Alert>
      </span>;

    return <div className="guidelist card-child__list-group">
      {merge_status_html}

        <div className="u-stack--md">
          <Button onClick={cancelMergeFunction}
                  bsStyle="default"
                  bsSize="small">
            Cancel Sign In
          </Button>
          <Button onClick={pleaseMergeAccountsFunction}
                  bsStyle="primary">
            Sign In and Merge My Offline Changes</Button>
        </div>
      </div>;
  }
}
