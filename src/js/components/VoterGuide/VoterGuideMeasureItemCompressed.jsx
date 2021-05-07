import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import VoterGuidePositionItem from './VoterGuidePositionItem';


class VoterGuideMeasureItemCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      measureWeVoteId: '',
      numberOfOpposePositionsForScore: 0,
      numberOfSupportPositionsForScore: 0,
      organizationWeVoteId: '',
      organizationPositionForMeasure: {},
      organizationPositionForMeasureFound: false,
    };
  }

  componentDidMount () {
    const { measureWeVoteId, organizationWeVoteId } = this.props;
    // console.log('VoterGuideMeasureItemCompressed onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId, ', measureWeVoteId:', measureWeVoteId);
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('componentDidMount, measure:', measure, ', measureWeVoteId: ', measureWeVoteId);
    if (!measure.we_vote_id) {
      MeasureActions.measureRetrieve(measureWeVoteId);
    }
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (!organization.organization_we_vote_id) {
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
      const organizationPositionForMeasure = OrganizationStore.getOrganizationPositionByWeVoteId(organizationWeVoteId, measureWeVoteId);
      const organizationPositionForMeasureFound = !!(organizationPositionForMeasure && organizationPositionForMeasure.position_we_vote_id);
      // console.log('componentDidMount organizationPositionForMeasure:', organizationPositionForMeasure, ', organizationPositionForMeasureFound:', organizationPositionForMeasureFound);
      this.setState({
        organizationPositionForMeasure,
        organizationPositionForMeasureFound,
      });
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measureWeVoteId,
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const { numberOfOpposePositionsForScore, numberOfSupportPositionsForScore } = ballotItemStatSheet;
      this.setState({
        numberOfOpposePositionsForScore,
        numberOfSupportPositionsForScore,
      });
    }
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { measureWeVoteId, organizationWeVoteId } = nextProps;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    if (!organization.organization_we_vote_id) {
      OrganizationActions.organizationRetrieve(organizationWeVoteId);
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measureWeVoteId,
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const { numberOfOpposePositionsForScore, numberOfSupportPositionsForScore } = ballotItemStatSheet;
      this.setState({
        numberOfOpposePositionsForScore,
        numberOfSupportPositionsForScore,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.organizationPositionForMeasureFound !== nextState.organizationPositionForMeasureFound) {
      // console.log('this.state.organizationPositionForMeasureFound:', this.state.organizationPositionForMeasureFound, ', nextState.organizationPositionForMeasureFound:', nextState.organizationPositionForMeasureFound);
      return true;
    }
    if (this.state.numberOfOpposePositionsForScore !== nextState.numberOfOpposePositionsForScore) {
      // console.log('this.state.numberOfOpposePositionsForScore change');
      return true;
    }
    if (this.state.numberOfSupportPositionsForScore !== nextState.numberOfSupportPositionsForScore) {
      // console.log('this.state.numberOfSupportPositionsForScore change');
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('VoterGuideMeasureItemCompressed, onMeasureStoreChange, measure:', measure);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
    });
  }

  onSupportStoreChange () {
    const { measureWeVoteId } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
    if (ballotItemStatSheet) {
      const { numberOfOpposePositionsForScore, numberOfSupportPositionsForScore } = ballotItemStatSheet;
      this.setState({
        numberOfOpposePositionsForScore,
        numberOfSupportPositionsForScore,
      });
    }
  }

  onOrganizationStoreChange () {
    const { measureWeVoteId, organizationWeVoteId } = this.state;
    // console.log('VoterGuideMeasureItemCompressed onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId, ', measureWeVoteId:', measureWeVoteId);
    if (organizationWeVoteId) {
      const organizationPositionForMeasure = OrganizationStore.getOrganizationPositionByWeVoteId(organizationWeVoteId, measureWeVoteId);
      const organizationPositionForMeasureFound = !!(organizationPositionForMeasure && organizationPositionForMeasure.position_we_vote_id);
      // console.log('organizationPositionForMeasure:', organizationPositionForMeasure, ', organizationPositionForMeasureFound:', organizationPositionForMeasureFound);
      this.setState({
        organizationPositionForMeasure,
        organizationPositionForMeasureFound,
      });
    }
  }

  render () {
    renderLog('VoterGuideMeasureItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const { measureWeVoteId, organizationPositionForMeasure, organizationWeVoteId } = this.state;
    if (!measureWeVoteId) {
      return null;
    }

    return (
      <VoterGuidePositionItem
        ballotItemWeVoteId={measureWeVoteId}
        organizationWeVoteId={organizationWeVoteId}
        positionWeVoteId={organizationPositionForMeasure.position_we_vote_id}
      />
    );
  }
}
VoterGuideMeasureItemCompressed.propTypes = {
  organizationWeVoteId: PropTypes.string,
  measureWeVoteId: PropTypes.string.isRequired,
};

const styles = (theme) => ({
  cardRoot: {
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
});

export default withTheme(withStyles(styles)(VoterGuideMeasureItemCompressed));
