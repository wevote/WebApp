"use strict";
import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
const request = require("superagent");
const web_app_config = require("../../config");
import AddressBox from "../../components/AddressBox";
import { numberWithCommas } from "../../utils/textFormat";

export default class IntroStory extends Component {
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
        <div className="container-fluid well u-gutter__top--small fluff-full1 intro-story">
          <h2>We Vote</h2>
          <p> Intro page 1 </p>
        </div>
        }
      </div>;
    }
}
