"use strict";
import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
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
      <Helmet title="Welcome to We Vote" />
      { this.props.children ||
        <div className="container-fluid well u-hang--md u-inset--md">
          <h2 className="text-center">We Vote</h2>
            <label htmlFor="address">
              Your Address.&nbsp;
            </label>
            <span className="medium">
              This is our best guess - feel free to change.
            </span>
            <AddressBox {...this.props} saveUrl="/ballot" />
            <br/>
            <ul className="list-group">
              <li className="list-group-item">Research ballot items</li>
              <li className="list-group-item">Learn from friends</li>
              <li className="list-group-item">Take to the polls</li>
            </ul>

            <ul className="list-group">
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign" /> &nbsp;Neutral and private
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
                  &nbsp; {numberWithCommas(voterCount)} voters
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
                  &nbsp; {numberWithCommas(orgCount)} not-for-profit organizations
              </li>
              <li className="list-group-item">
                <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
                  &nbsp; and you.
              </li>
            </ul>
          </div>
        }
      </div>;
    }
}
