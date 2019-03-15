import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';

export default class OfficeNameText extends Component {
  static propTypes = {
    contestOfficeName: PropTypes.string,
    officeLink: PropTypes.string,
    politicalParty: PropTypes.string,
    showOfficeName: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps () {
    this.setState();
  }

  render () {
    renderLog(__filename);
    let nameText = '';
    const { contestOfficeName, officeLink, politicalParty, showOfficeName } = this.props;
    if (politicalParty === undefined) {
      if (showOfficeName) {
        nameText = (
          <span className="no-political-party">
            <span>Candidate for </span>
            { officeLink ? (
              <Link to={officeLink}>
                <span className="candidate-card-main__office">{ contestOfficeName }</span>
              </Link>
            ) :
              <span className="candidate-card-main__office">{ contestOfficeName }</span>
            }
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
            <Link to={officeLink}>
              <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>
            </Link>
          ) :
            <span className="candidate-card-main__office u-bold u-gray-darker">{ contestOfficeName }</span>
          }
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
