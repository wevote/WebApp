import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import MeasureItemForAddPositions from './MeasureItemForAddPositions';
import OfficeItemForAddPositions from './OfficeItemForAddPositions';


class BallotItemForAddPositions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateListCount: 0,
      kindOfBallotItem: '',
      measureText: '',
    };
  }

  componentDidMount () {
    // console.log('componentDidMount, this.props.candidateList', this.props.candidateList);
    // console.log('componentDidMount, this.props.kindOfBallotItem', this.props.kindOfBallotItem);
    const candidateList = this.props.candidateList || [];
    const candidateListCount = candidateList.length;
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      ballotItemDisplayName: this.props.ballotItemDisplayName,
      candidateList,
      candidateListCount,
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
    const candidateListCount = candidateList.length;
    const candidatesToShowForSearchResults = nextProps.candidatesToShowForSearchResults || [];
    const candidatesToShowForSearchResultsCount = candidatesToShowForSearchResults.length;
    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organizationWeVoteId;
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      ballotItemDisplayName: nextProps.ballotItemDisplayName,
      candidateList,
      candidateListCount,
      candidatesToShowForSearchResultsCount,
      kindOfBallotItem: nextProps.kindOfBallotItem,
      measureText: nextProps.measureText,
      organizationWeVoteId,
      organization: nextProps.organization,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.allBallotItemsCount !== nextProps.allBallotItemsCount) {
      // console.log('this.props.allBallotItemsCount:', this.props.allBallotItemsCount, ', nextProps.allBallotItemsCount:', nextProps.allBallotItemsCount);
      return true;
    }
    if (this.props.ballotItemWeVoteId !== nextProps.ballotItemWeVoteId) {
      // console.log('this.props.ballotItemWeVoteId:', this.props.ballotItemWeVoteId, ', nextProps.ballotItemWeVoteId:', nextProps.ballotItemWeVoteId);
      return true;
    }
    if (this.props.externalUniqueId !== nextProps.externalUniqueId) {
      // console.log('this.props.externalUniqueId:', this.props.externalUniqueId, ', nextProps.externalUniqueId:', nextProps.externalUniqueId);
      return true;
    }
    if (this.state.candidateListCount !== nextState.candidateListCount) {
      // console.log('this.state.candidateListCount:', this.state.candidateListCount, ', nextState.candidateListCount:', nextState.candidateListCount);
      return true;
    }
    if (this.state.candidatesToShowForSearchResultsCount !== nextState.candidatesToShowForSearchResultsCount) {
      // console.log('this.state.candidatesToShowForSearchResultsCount:', this.state.candidatesToShowForSearchResultsCount, ', nextState.candidatesToShowForSearchResultsCount:', nextState.candidatesToShowForSearchResultsCount);
      return true;
    }
    if (this.state.kindOfBallotItem !== nextState.kindOfBallotItem) {
      // console.log('this.state.kindOfBallotItem:', this.state.kindOfBallotItem, ', nextState.kindOfBallotItem:', nextState.kindOfBallotItem);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }

    return false;
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
    renderLog('BallotItemForAddPositions');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemDisplayName, ballotItemWeVoteId, candidateList, kindOfBallotItem, measureText, organization, organizationWeVoteId } = this.state;
    const { externalUniqueId } = this.props;
    if (!kindOfBallotItem) {
      // console.log('No value in kindOfBallotItem: ', kindOfBallotItem, ', for ballotItemDisplayName: ', ballotItemDisplayName, ', ballotItemWeVoteId:', ballotItemWeVoteId);
      return null;
    }
    return (
      <BallotItemCard className="BallotItem card" key={`ballotItemForAddPositions-${ballotItemWeVoteId}-${externalUniqueId}`}>
        { this.isMeasure() ? (
          <MeasureItemForAddPositions
            ballotItemDisplayName={ballotItemDisplayName}
            ballotItemWeVoteId={ballotItemWeVoteId}
            measureText={measureText}
            key={`measureItem-${externalUniqueId}`}
            organization={organization}
            externalUniqueId={`measureItem-${externalUniqueId}`}
          />
        ) : (
          <OfficeItemForAddPositions
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
        )}
      </BallotItemCard>
    );
  }
}
BallotItemForAddPositions.propTypes = {
  allBallotItemsCount: PropTypes.number,
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
const BallotItemCard = styled('div')(({ theme }) => (`
  $item-padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: ${standardBoxShadow()};
  margin-bottom: 16px;
  overflow-y: none;
  border: none;
  ${theme.breakpoints.down('sm')} {
    border-radius: 0;
  }
`));

export default withTheme(withStyles(styles)(BallotItemForAddPositions));
