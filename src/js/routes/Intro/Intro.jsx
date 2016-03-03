"use strict";
import React, { Component, PropTypes } from "react";

import { Button, ButtonToolbar } from "react-bootstrap";
import BallotActions from "../../actions/BallotActions";
const request = require("superagent");
import VoterStore from "../../stores/VoterStore";
const web_app_config = require("../../config");

function numberWithCommas (num) {
  if (num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return "";
}

export default class Intro extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      voterCount: null,
      orgCount: null
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this.getVoterCount();
    this.getOrgCount();
    VoterStore.getLocation( (err, location) => {
      this.setState({ location });
    });
  }

  getVoterCount () {
    request
      .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}voterCount/`)
      .end( (err, res) => {
        if (err) throw err;

        this.setState({
          voterCount: res.body.voter_count
        });
      });
  }

  getOrgCount () {
    request
      .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationCount/`)
      .end( (err, res) => {
        if (err) throw err;

        this.setState({
          orgCount: res.body.organization_count
        });
      });
  }

  updateLocation (e) {
    this.setState({
      location: e.target.value
    });
  }

  saveLocation () {
    var { location } = this.state;
    VoterStore.saveLocation( location, (res) => {
      if (res){
		/* Whether we succeed or fail, we want to go to the next step in the introduction process */
        this.props.history.push("/intro/opinions");
      } else {
        BallotActions.init(); // reinitialize ballot in case old ballot items from old addresses are stored.
        this.props.history.push("/intro/opinions");
      }
    }, (err) =>{

    });
  }

  render () {
    const {
      location,
      orgCount,
      voterCount,
    } = this.state;

    return <div>
      { this.props.children ||
        <div className="container-fluid well well-90">
          <h2 className="text-center">We Vote Social Voter Guide</h2>
            <label htmlFor="address">
              My Ballot Location.
            </label>
            <span className="small">
              This is our best guess - feel free to change.
            </span>
            <input
              type="text"
              onChange={this.updateLocation.bind(this)}
              name="address"
              value={location}
              className="form-control"
              defaultValue=""
            />
            <div className="gutter-top--small">
              <ButtonToolbar>
                <Button
                  onClick={this.saveLocation.bind(this)}
                  bsStyle="primary">Go</Button>

              </ButtonToolbar>
            </div>
            <br/>
            <ul className="list-group">
              <li className="list-group-item">Research ballot items</li>
              <li className="list-group-item">Learn from friends</li>
              <li className="list-group-item">Take to the polls</li>
            </ul>

            <ul className="list-group">
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign"></span> &nbsp;Neutral and private
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>
                  &nbsp; {numberWithCommas(voterCount)} voters
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>
                  &nbsp; {numberWithCommas(orgCount)} not-for-profit organizations
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>
                  &nbsp; and you.
              </li>
            </ul>
          </div>
        }
      </div>;
    }
}
