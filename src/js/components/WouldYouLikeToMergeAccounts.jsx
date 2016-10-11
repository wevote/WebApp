import React, { Component, PropTypes } from "react";
import { Alert, Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../components/LoadingWheel";

export default class WouldYouLikeToMergeAccounts extends Component {
  static propTypes = {
    pleaseMergeAccountsFunction: PropTypes.func.isRequired,
    cancelMergeFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
      super(props);
      this.state = {
        loading: true,
      };
  }

  cancelMerge () {
    browserHistory.push("/more/sign_in");
  }

  render () {
    const {cancelMergeFunction, pleaseMergeAccountsFunction} = this.props;
    var { saving } = this.state;
    if (saving){
      return LoadingWheel;
    }
    const merge_status_html = <span>
      { !this.state.yes_please_merge_accounts ?
        <Alert bsStyle="warning">
          If you sign in now, all of your positions and friends will be merged with the account
          that is already signed into this browser. Would you like to merge? (If NOT, please cancel.)
        </Alert> :
        null }
      </span>;

    return <div className="guidelist card-child__list-group">
      {merge_status_html}

        <div className="u-gutter__top--small">
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
