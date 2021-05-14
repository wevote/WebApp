import { Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AddressBox from '../../components/AddressBox';
import webAppConfig from '../../config';
import { renderLog } from '../../utils/logging';
import { numberWithCommas } from '../../utils/textFormat';

const { $ } = window;

export default class Intro extends Component {
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
    $.ajax({
      url: `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}voterCount/`,
      context: document.body,
    }).done((resp) => {
      this.setState({
        voterCount: resp.voter_count,
      });
    });
  }

  getOrgCount () {
    $.ajax({
      url: `${webAppConfig.WE_VOTE_SERVER_API_ROOT_URL}organizationCount/`,
      context: document.body,
    }).done((resp) => {
      this.setState({
        orgCount: resp.organization_count,
      });
    });
  }

  render () {
    renderLog('Intro');  // Set LOG_RENDER_EVENTS to log all renders
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
              <Check style={{ paddingRight: 5 }} />
              {' '}
              &nbsp;Neutral and private
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <Check style={{ paddingRight: 5 }} />
              {numberWithCommas(voterCount)}
              {' '}
              voters
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <Check style={{ paddingRight: 5 }} />
              {numberWithCommas(orgCount)}
              {' '}
              not-for-profit organizations
            </li>
            <li className="list-group-item">
              {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
              <Check style={{ paddingRight: 5 }} />
                  &nbsp; and you.
            </li>
          </ul>
        </div>
        )}
      </div>
    );
  }
}
Intro.propTypes = {
  children: PropTypes.object,
};
