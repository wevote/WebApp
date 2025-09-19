import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OfficeActions from '../../actions/OfficeActions';
import BallotScrollingContainer from './BallotScrollingContainer';
import { BallotScrollingOuterWrapper } from '../../common/components/Style/ScrollingStyles';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { sortCandidateList } from '../../utils/positionFunctions';
import { OfficeItemCompressedWrapper, OfficeNameH2 } from '../Style/BallotStyles';

const ShowMoreButtons = React.lazy(() => import(/* webpackChunkName: 'ShowMoreButtons' */ '../Widgets/ShowMoreButtons'));
const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
class OfficeItemCompressed extends Component {
  targetRef = React.createRef();

  constructor (props) {
    super(props);
    this.state = {
      candidateListLength: 0,
      candidateListForDisplay: [],
      showAllCandidates: false,
      totalNumberOfCandidates: 0,
    };
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this)); // Add listener for SupportStore changes
    this.onCandidateStoreChange();
    const { candidateList, officeWeVoteId } = this.props;
    this.setState({
      candidateListLength: candidateList?.length || 0,
      totalNumberOfCandidates: officeWeVoteId ? CandidateStore.getNumberOfCandidatesRetrievedByOffice(officeWeVoteId) : 0,
    });
    if (officeWeVoteId && !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)) {
      OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove(); // Remove listener for SupportStore changes
  }

  onSupportStoreChange () {
  // Trigger a re-render when the support state changes
    this.onCandidateStoreChange();
  }

  onCandidateStoreChange () {
    const { candidateList, officeWeVoteId } = this.props;
    const totalNumberOfCandidates = officeWeVoteId ? CandidateStore.getNumberOfCandidatesRetrievedByOffice(officeWeVoteId) : 0;
    // const sortedCandidateList = sortCandidateList(candidateList || []);
    this.setState({
      // candidateListForDisplay: sortedCandidateList,
      totalNumberOfCandidates,
    });
  }

  getCandidatesToRender () {
    const { showAllCandidates } = this.state;
    const { disableAutoRollUp, candidateList } = this.props;
    // uses candidateList from props of FilterBaseSearch instead of onCandidateStoreChange variable to render list
    const sortedCandidateList = sortCandidateList(candidateList || []);
    if (showAllCandidates || disableAutoRollUp) {
      return sortedCandidateList;
    }
    return sortedCandidateList.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
  }

  showAllCandidates = () => {
    this.setState({ showAllCandidates: true });
  };

  showLessCandidates = () => {
    this.setState({ showAllCandidates: false }, () => {
      this.targetRef.scrollIntoView({ behavior: 'smooth' });
    });
  };

  goToCandidateLink (candidateWeVoteId) {
    const { organizationWeVoteId } = this.props;
    const candidateLink = organizationWeVoteId ?
      `/candidate/${candidateWeVoteId}/btvg/${organizationWeVoteId}` :
      `/candidate/${candidateWeVoteId}/b/btdb`;
    historyPush(candidateLink);
  }

  render () {
    renderLog('OfficeItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OfficeItemCompressed render');

    let { ballotItemDisplayName } = this.props;
    const { isFirstBallotItem, officeWeVoteId, primaryParty, useHelpDefeatOrHelpWin } = this.props; // classes
    const { candidateListLength, showAllCandidates, totalNumberOfCandidates } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName).replace('(Unexpired)', '(Remainder)');
    const moreCandidatesToDisplay = candidateListLength > NUMBER_OF_CANDIDATES_TO_DISPLAY;

    return (
      <OfficeItemCompressedWrapper>
        <div
          id={`anchor-${officeWeVoteId}`}
          ref={(ref) => {
            this.targetRef = ref;
          }}
          style={isFirstBallotItem ? { position: 'absolute', top: '-325px', left: 0 } : { position: 'absolute', top: '-260px', left: 0 }}
        />
        <OfficeNameH2>
          {ballotItemDisplayName}
          {!!primaryParty && (
            <PrimaryPartyWrapper>
              {' '}
              (
              {primaryParty}
              {' '}
              Primary)
            </PrimaryPartyWrapper>
          )}
        </OfficeNameH2>
        {/* *************************
          Display either a) the candidates the voter supports, or b) the first few candidates running for this office
          ************************* */}
        <OneOfficeCandidateList
          candidates={this.getCandidatesToRender()}
          goToCandidateLink={(candidateWeVoteId) => this.goToCandidateLink(candidateWeVoteId)}
          useHelpDefeatOrHelpWin={useHelpDefeatOrHelpWin}
        />
        {moreCandidatesToDisplay && (
          <Suspense fallback={<></>}>
            <ShowMoreButtons
              showMoreId={`officeItemCompressedShowMoreFooter-${officeWeVoteId}`}
              showMoreButtonsLink={showAllCandidates ? this.showLessCandidates : this.showAllCandidates}
              showMoreCustomText={showAllCandidates ? 'show fewer candidates' : `show all ${totalNumberOfCandidates} candidates`}
              officeWeVoteId={officeWeVoteId}
            />
          </Suspense>
        )}
      </OfficeItemCompressedWrapper>
    );
  }
}
OfficeItemCompressed.propTypes = {
  officeWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  disableAutoRollUp: PropTypes.bool,
  isFirstBallotItem: PropTypes.bool,
  organizationWeVoteId: PropTypes.string,
  primaryParty: PropTypes.string,
  useHelpDefeatOrHelpWin: PropTypes.bool,
};

// OneOfficeCandidateList takes the list of candidates from props, renders them.
// It takes two props: candidates (the list of candidates to render) and goToCandidateLink (a function to navigate to the candidate's page).
const OneOfficeCandidateList = ({ candidates, goToCandidateLink, useHelpDefeatOrHelpWin }) => (
  <BallotScrollingOuterWrapper>
    {candidates.map((candidate) => {
      const isSupported = SupportStore.getVoterSupportsByBallotItemWeVoteId(candidate.we_vote_id); // Get support status from SupportStore
      return (
        <BallotScrollingContainer
          key={`candidatePreview-${candidate.we_vote_id}`}
          oneCandidate={candidate}
          goToCandidateLink={goToCandidateLink}
          isSupported={isSupported} // Pass the support status as a prop
          useHelpDefeatOrHelpWin={useHelpDefeatOrHelpWin}
        />
      );
    })}
  </BallotScrollingOuterWrapper>
);
OneOfficeCandidateList.propTypes = {
  candidates: PropTypes.array.isRequired,
  goToCandidateLink: PropTypes.func.isRequired,
  useHelpDefeatOrHelpWin: PropTypes.bool,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: 4,
    minWidth: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      minWidth: 60,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 50,
      height: 30,
      padding: '0 8px',
      fontSize: 10,
    },
  },
});

const PrimaryPartyWrapper = styled('span')`
  font-size: 18px;
`;

export default withTheme(withStyles(styles)(OfficeItemCompressed));
