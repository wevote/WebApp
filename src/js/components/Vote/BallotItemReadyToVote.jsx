import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { renderLog } from '../../utils/logging';
import MeasureItemReadyToVote from './MeasureItemReadyToVote';
import OfficeItemReadyToVote from './OfficeItemReadyToVote';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

class BallotItemReadyToVote extends Component {
  static propTypes = {
    kind_of_ballot_item: PropTypes.string.isRequired,
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog(__filename);
    return (
      <React.Fragment>
        { this.isMeasure() ? (
          <MeasureItemReadyToVote
            ballotItemDisplayName={this.props.ballot_item_display_name}
            measureWeVoteId={this.props.we_vote_id}
          />
        ) : (
          <OfficeItemReadyToVote
            candidateList={this.props.candidate_list}
          />
        )}
      </React.Fragment>
    );
  }
}

const Wrapper = styled.div`
  padding: 24px 24px 20px 24px;
  transition: all 200ms ease-in;
  border: 1px solid transparent;
  border-radius: 4px;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  width: 100%;
`;

const BioColumn = styled.div`
  display: flex;
`;

const OfficeColumn = styled.div`
  display: flex;
`;

const OfficeText = styled.p`
  font-weight: 500;
  margin: auto 0;
  margin-right: 16px;
`;

const BioInformation = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

const NameText = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  @media print{
    font-size: 1.5rem;
  }
`;

const DescriptionText = styled.p`
  font-size: 12px;
  margin: 0;
  @media print {
    font-size: 1.5rem;
  } 
`;

const HR = styled.hr`
  margin: 0 24px;
`;

const DesktopTabletView = styled.div`
  display: inherit;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

export { Wrapper, InnerWrapper, BioColumn, OfficeColumn, OfficeText, BioInformation, NameText, DescriptionText, HR, DesktopTabletView, MobileView };

export default withTheme(BallotItemReadyToVote);
