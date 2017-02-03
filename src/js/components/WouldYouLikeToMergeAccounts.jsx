import React, { Component, PropTypes } from "react";
import { Alert, Button } from "react-bootstrap";
import { browserHistory } from "react-router";

export default class WouldYouLikeToMergeAccounts extends Component {
  static propTypes = {
    pleaseMergeAccountsFunction: PropTypes.func.isRequired,
    cancelMergeFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
      super(props);
  }

  cancelMerge () {
    browserHistory.push("/more/sign_in");
  }

  render () {
    const {cancelMergeFunction, pleaseMergeAccountsFunction} = this.props;

    const merge_status_html = <span>
        <Alert bsStyle="warning">
          If you sign in now, all of your positions and friends will be merged with the account
          that is already signed into this browser. Would you like to merge? (If NOT, please cancel.)
        </Alert>
      </span>;

    return <div className="guidelist card-child__list-group">
      {merge_status_html}

        <div className="u-hang--md">
          <Button onClick={cancelMergeFunction}
                  bsStyle="default"
                  bsSize="small">
            Cancel
          </Button>
          <Button onClick={pleaseMergeAccountsFunction}
                  bsStyle="primary">
            Merge These Accounts</Button>
        </div>
      </div>;
  }
}
