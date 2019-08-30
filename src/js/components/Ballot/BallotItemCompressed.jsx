import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import MeasureItemCompressed from './MeasureItemCompressed';
import OfficeItemCompressed from './OfficeItemCompressed';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

export default class BallotItemCompressed extends Component {
  static propTypes = {
    allBallotItemsCount: PropTypes.number,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    // urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    // updateOfficeDisplayUnfurledTracker: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateListCount: 0,
    };
  }

  componentDidMount () {
    const candidateList = this.props.candidate_list || [];
    const candidateListCount = candidateList.length;
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organization_we_vote_id;
    this.setState({
      candidateListCount,
      organizationWeVoteId,
    });
  }

  componentWillReceiveProps (nextProps) {
    const candidateList = nextProps.candidate_list || [];
    const candidateListCount = candidateList.length;
    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organization_we_vote_id;
    this.setState({
      candidateListCount,
      organizationWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.allBallotItemsCount !== nextProps.allBallotItemsCount) {
      // console.log('this.props.allBallotItemsCount:', this.props.allBallotItemsCount, ', nextProps.allBallotItemsCount:', nextProps.allBallotItemsCount);
      return true;
    }
    if (this.state.candidateListCount !== nextState.candidateListCount) {
      // console.log('this.state.candidateListCount:', this.state.candidateListCount, ', nextState.candidateListCount:', nextState.candidateListCount);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }
    if (this.props.we_vote_id !== nextProps.we_vote_id) {
      // console.log('this.props.we_vote_id:', this.props.we_vote_id, ', nextProps.we_vote_id:', nextProps.we_vote_id);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    // console.log('BallotItemCompressed render');
    renderLog(__filename);
    return (
      <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ? (
          <MeasureItemCompressed
            measureWeVoteId={this.props.we_vote_id}
            organization={this.props.organization}
          />
        ) : (
          <OfficeItemCompressed
            officeWeVoteId={this.props.we_vote_id}
            ballotItemDisplayName={this.props.ballot_item_display_name}
            candidateList={this.props.candidate_list}
            organization={this.props.organization}
            organizationWeVoteId={this.props.organization_we_vote_id}
            ref={(ref) => { this.ballotItem = ref; }}
          />
        )}
      </div>
    );
  }
}
