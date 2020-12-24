import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { renderLog } from '../../utils/logging';

export default class OfficeNameText extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps () {
    this.setState();
  }

  render () {
    renderLog('OfficeNameText');  // Set LOG_RENDER_EVENTS to log all renders
    let nameText = '';
    const { contestOfficeName, officeLink, politicalParty, showOfficeName } = this.props;
    if (politicalParty === undefined) {
      if (showOfficeName) {
        nameText = (
          <span className="no-political-party">
            <span>Candidate for </span>
            { officeLink ? (
              <Link to={officeLink}>
                <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>
              </Link>
            ) :
              <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>}
          </span>
        );
      }
    } else if (showOfficeName) {
      nameText = (
        <span>
          <span className="card-main__political-party u-bold u-gray-darker">
            {politicalParty}
            {' '}
          </span>
          <span>candidate for </span>
          { officeLink ? (
            <Link id="officeNameTextContestOfficeName" to={officeLink}>
              <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>
            </Link>
          ) :
            <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>}
        </span>
      );
    } else {
      nameText = (
        <span className="card-main__political-party u-gray-darker">
          {politicalParty}
        </span>
      );
    }

    return nameText;
  }
}
OfficeNameText.propTypes = {
  contestOfficeName: PropTypes.string,
  officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
  showOfficeName: PropTypes.bool,
};
