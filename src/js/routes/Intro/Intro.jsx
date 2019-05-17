import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import request from 'superagent';
import webAppConfig from '../../config';
import { renderLog } from '../../utils/logging';
import AddressBox from '../../components/AddressBox';
import { numberWithCommas } from '../../utils/textFormat';

export default class Intro extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterCount: null,
      orgCount: null,
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
      .get(`${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}voterCount/`)
      .end((err, res) => {
        if (err) throw err;

        this.setState({
          voterCount: res.body.voter_count,
        });
      });
  }

  getOrgCount () {
    request
      .get(`${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}organizationCount/`)
      .end((err, res) => {
        if (err) throw err;

        this.setState({
          orgCount: res.body.organization_count,
        });
      });
  }

  render () {
    renderLog(__filename);
    const {
      orgCount,
      voterCount,
    } = this.state;

    return (
      <div>
        <Helmet title="Welcome to We Vote" />
        { this.props.children || (
        <div className="container-fluid well u-stack--md u-inset--md">
          <h2 className="text-center">We Vote</h2>
          <label // eslint-disable-line
            htmlFor="address"
          >
              Your Address.&nbsp;
          </label>
          <span className="medium">
              This is our best guess - feel free to change.
          </span>
          <AddressBox {...this.props} saveUrl="/ballot" />
          <br />
          <ul className="list-group">
            <li className="list-group-item">Research ballot items</li>
            <li className="list-group-item">Learn from friends</li>
            <li className="list-group-item">Take to the polls</li>
          </ul>

          <ul className="list-group">
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
              {' '}
              &nbsp;Neutral and private
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
              {numberWithCommas(voterCount)}
              {' '}
              voters
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
              {numberWithCommas(orgCount)}
              {' '}
              not-for-profit organizations
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <span className="glyphicon glyphicon-small glyphicon-ok-sign" />
                  &nbsp; and you.
            </li>
          </ul>
        </div>
        )
        }
      </div>
    );
  }
}
