import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link, browserHistory } from "react-router";

export default class VoterGuideEditIndex extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
    };

    this.onDoneButton = this.onDoneButton.bind(this);
  }

  onDoneButton () {
    browserHistory.push("/voterguide/" + this.props.organization_we_vote_id);
  }

  render () {
    let current_path_name = this.props.location.pathname;

    return <div className="col-md-8 col-sm-12">
      <div className="card">
        <div className="card-main">
          <h1 className="h1">Edit Your Voter Guide</h1>
          <Link to={current_path_name + "/name"}>
            <h3 className="h3">Edit Name and Description</h3>
          </Link>
          <Link to={current_path_name + "/add"}>
            <h3 className="h3">Add Positions to Voter Guide</h3>
          </Link>
          <Link to={current_path_name + "/issues"}>
            <h3 className="h3">Issues Related to Your Voter Guide</h3>
          </Link>
          <Link to={current_path_name + "/activity"}>
            <h3 className="h3">View Activity Reports</h3>
          </Link>
          <br />
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
