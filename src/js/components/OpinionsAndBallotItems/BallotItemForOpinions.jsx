import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';

import MeasureItemForOpinions from './MeasureItemForOpinions';
import OfficeItemForOpinions from './OfficeItemForOpinions';


class BallotItemForOpinions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      kindOfBallotItem: '',
      measureText: '',
    };
  }

  componentDidMount () {
    // console.log('componentDidMount, this.props.candidateList', this.props.candidateList);
    // console.log('componentDidMount, this.props.kindOfBallotItem', this.props.kindOfBallotItem);
    const candidateList = this.props.candidateList || [];
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      ballotItemDisplayName: this.props.ballotItemDisplayName,
      candidateList,
      kindOfBallotItem: this.props.kindOfBallotItem,
      measureText: this.props.measureText,
      organizationWeVoteId,
      organization: this.props.organization,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('componentDidMount, nextProps.candidateList', nextProps.candidateList);
    // console.log('componentDidMount, nextProps.kindOfBallotItem', nextProps.kindOfBallotItem);
    const candidateList = nextProps.candidateList || [];
    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organizationWeVoteId;
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      ballotItemDisplayName: nextProps.ballotItemDisplayName,
      candidateList,
      kindOfBallotItem: nextProps.kindOfBallotItem,
      measureText: nextProps.measureText,
      organizationWeVoteId,
      organization: nextProps.organization,
    });
  }

  isMeasure () {
    const { kindOfBallotItem } = this.state;
    if (kindOfBallotItem === 'MEASURE') {
      // console.log('isMeasure, kindOfBallotItem:', kindOfBallotItem, ', TRUE');
      return true;
    } else {
      // console.log('isMeasure, kindOfBallotItem:', kindOfBallotItem, ', FALSE');
      return false;
    }
  }

  render () {
    renderLog('BallotItemForOpinions');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemDisplayName, ballotItemWeVoteId, candidateList,
      kindOfBallotItem, measureText, organization, organizationWeVoteId,
    } = this.state;
    const { externalUniqueId } = this.props;
    if (!kindOfBallotItem) {
      // console.log('No value in kindOfBallotItem: ', kindOfBallotItem, ', for ballotItemDisplayName: ', ballotItemDisplayName, ', ballotItemWeVoteId:', ballotItemWeVoteId);
      return null;
    }
    return (
      <BallotItemCard className="BallotItem card" key={`ballotItemForAddPositions-${ballotItemWeVoteId}-${externalUniqueId}`}>
        { this.isMeasure() ? (
          <Suspense fallback={<></>}>
            <MeasureItemForOpinions
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              measureText={measureText}
              key={`measureItem-${externalUniqueId}`}
              organization={organization}
              externalUniqueId={`measureItem-${externalUniqueId}`}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<></>}>
            <OfficeItemForOpinions
              ballotItemWeVoteId={ballotItemWeVoteId}
              ballotItemDisplayName={ballotItemDisplayName}
              candidateList={candidateList}
              candidatesToShowForSearchResults={this.props.candidatesToShowForSearchResults}
              key={`officeItem-${externalUniqueId}`}
              organization={organization}
              organizationWeVoteId={organizationWeVoteId}
              ref={(ref) => { this.ballotItem = ref; }}
              externalUniqueId={`officeItem-${externalUniqueId}`}
            />
          </Suspense>
        )}
      </BallotItemCard>
    );
  }
}
BallotItemForOpinions.propTypes = {
  ballotItemDisplayName: PropTypes.string.isRequired,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  candidatesToShowForSearchResults: PropTypes.array,
  kindOfBallotItem: PropTypes.string.isRequired,
  measureText: PropTypes.string,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  externalUniqueId: PropTypes.string,
};

const styles = (theme) => ({
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
    marginLeft: '.3rem',
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
  },
});

// Dale to update when I have time to work out the kinks
const BallotItemCard = styled.div`
  $item-padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 2px 1px -1px rgba(0, 0, 0, .12);
  margin-bottom: 16px;
  overflow-y: none;
  border: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 0;
  }
`;

export default withTheme(withStyles(styles)(BallotItemForOpinions));
