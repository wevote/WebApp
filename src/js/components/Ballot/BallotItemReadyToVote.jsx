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
            {...this.props}
            measureWeVoteId={this.props.we_vote_id}
          />
        ) : (
          <OfficeItemReadyToVote
            {...this.props}
            weVoteId={this.props.we_vote_id}
          />
        )}
      </React.Fragment>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  padding: 24px;
  transition: all 200ms ease-in;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.brandBlue};
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
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
`;

const DescriptionText = styled.p`
  font-size: 12px;
  margin: 0;
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
