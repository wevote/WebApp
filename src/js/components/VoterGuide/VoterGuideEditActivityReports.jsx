import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link, browserHistory } from "react-router";
import IssueActions from "../../actions/IssueActions";
import IssueLinkToggle from "../Issues/IssueLinkToggle";
import IssueStore from "../../stores/IssueStore";

export default class VoterGuideEditName extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
    };

    this.onDoneButton = this.onDoneButton.bind(this);
  }

  componentDidMount () {
    let active_tab = "temp";
    this.setState({
      active_tab: active_tab,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      active_tab: nextProps.params.active_tab || "issues_to_link",
    });
  }

  componentWillUnmount () {
  }

  onDoneButton () {
    browserHistory.push("/voterguideedit/" + this.props.organization_we_vote_id);
  }

  render () {

    return <div className="col-md-8 col-sm-12">
      <div className="card">
        <div className="card-main">
          <h1 className="h2">Activity Reports</h1>
          <p>Coming soon.</p>
          <div className="pull-right">
            <Button bsStyle="success" bsSize="small" onClick={this.onDoneButton} >
              <span>Done</span>
            </Button>
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>;
  }
}
