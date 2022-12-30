import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import YearState from '../../common/components/Widgets/YearState';
import { renderLog } from '../../common/utils/logging';

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
    const { contestOfficeName, politicalParty, showOfficeName, stateName, year } = this.props; // officeLink, // Dec 2022: Turning off officeLink until we can do design review
    const officeLink = null;
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
            <YearState year={year} stateName={stateName} />
          </span>
        );
      }
    } else if (showOfficeName) {
      nameText = (
        <PartyAndOfficeWrapper>
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
          <YearState year={year} stateName={stateName} />
        </PartyAndOfficeWrapper>
      );
    } else {
      nameText = (
        <>
          <span className="card-main__political-party u-gray-darker">
            {politicalParty}
          </span>
          <YearState year={year} stateName={stateName} />
        </>
      );
    }

    return nameText;
  }
}
OfficeNameText.propTypes = {
  contestOfficeName: PropTypes.string,
  // officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
  showOfficeName: PropTypes.bool,
  stateName: PropTypes.string,
  year: PropTypes.string,
};

const PartyAndOfficeWrapper = styled('div')`
  line-height: 17px;
`;
