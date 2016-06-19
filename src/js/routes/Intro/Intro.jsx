"use strict";
import React, { Component, PropTypes } from "react";

const request = require("superagent");
const web_app_config = require("../../config");
import AddressBox from "../../components/AddressBox";
import { numberWithCommas } from "../../utils/textFormat";

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

  render () {
    const {
      orgCount,
      voterCount,
    } = this.state;

    return <div>
      { this.props.children ||
        <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
          <h2 className="bs-text-center">We Vote</h2>
            <label htmlFor="address">
              My Address.&nbsp;
            </label>
            <span className="small">
              This is our best guess - feel free to change.
            </span>
            <AddressBox {...this.props} saveUrl="/intro/opinions" />
            <br/>
            <ul className="bs-list-group">
              <li className="bs-list-group-item">Research ballot items</li>
              <li className="bs-list-group-item">Learn from friends</li>
              <li className="bs-list-group-item">Take to the polls</li>
            </ul>

            <ul className="bs-list-group">
              <li className="bs-list-group-item">
                <span className="bs-glyphicon bs-glyphicon-small bs-glyphicon-ok-sign"></span> &nbsp;Neutral and private
              </li>
              <li className="bs-list-group-item">
                <span className="bs-glyphicon bs-glyphicon-small bs-glyphicon-ok-sign"></span>
                  &nbsp; {numberWithCommas(voterCount)} voters
              </li>
              <li className="bs-list-group-item">
                <span className="bs-glyphicon bs-glyphicon-small bs-glyphicon-ok-sign"></span>
                  &nbsp; {numberWithCommas(orgCount)} not-for-profit organizations
              </li>
              <li className="bs-list-group-item">
                <span className="bs-glyphicon bs-glyphicon-small bs-glyphicon-ok-sign"></span>
                  &nbsp; and you.
              </li>
            </ul>
          </div>
        }
      </div>;
    }
}
