import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import BallotStore from '../../stores/BallotStore';
import { historyPush } from '../../utils/cordovaUtils';
import { toTitleCase } from '../../utils/textFormat';
import CandidateItemForAddPositions from './CandidateItemForAddPositions';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import OfficeActions from '../../actions/OfficeActions';
import SupportStore from '../../stores/SupportStore';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class OfficeItemForAddPositions extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    theme: PropTypes.object,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      changeFound: false,
      componentDidMount: false,
      organizationWeVoteId: '',
      showCandidates: true,
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organization_we_vote_id;
    // console.log('OfficeItemForAddPositions componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
      componentDidMount: true,
    });
  }

  componentWillReceiveProps (nextProps) {
    // 2018-05-10 I don't think we need to trigger a new render because the incoming candidate_list should be the same
    // if (nextProps.candidate_list && nextProps.candidate_list.length) {
    //   this.setState({
    //     candidateList: nextProps.candidate_list,
    //   });
    // }

    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organization_we_vote_id;
    // console.log('officeItemCompressed componentWillReceiveProps, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId: ', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.changeFound !== nextState.changeFound) {
      // console.log('this.state.changeFound: ', this.state.changeFound, ', nextState.changeFound: ', nextState.changeFound);
      return true;
    }
    if (this.props.ballot_item_display_name !== nextProps.ballot_item_display_name) {
      // console.log('this.props.ballot_item_display_name: ', this.props.ballot_item_display_name, ', nextProps.ballot_item_display_name: ', nextProps.ballot_item_display_name);
      return true;
    }
    if (this.state.showCandidates !== nextState.showCandidates) {
      // console.log('this.state.showCandidates: ', this.state.showCandidates, ', nextState.showCandidates: ', nextState.showCandidates);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    const { candidate_list: candidateList, we_vote_id: officeWeVoteId } = this.props;
    let changeFound = false;
    if (candidateList && candidateList.length && officeWeVoteId) {
      if (!BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)) {
        OfficeActions.positionListForBallotItemPublic(officeWeVoteId);
      }
      const newCandidateList = [];
      let newCandidate = {};
      if (candidateList) {
        candidateList.forEach((candidate) => {
          if (candidate && candidate.we_vote_id) {
            newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
            newCandidateList.push(newCandidate);
            if (!changeFound) {
              if (candidate.ballot_item_display_name !== newCandidate.ballot_item_display_name) {
                changeFound = true;
              }
              if (candidate.candidate_photo_url_medium !== newCandidate.candidate_photo_url_medium) {
                changeFound = true;
              }
              if (candidate.party !== newCandidate.party) {
                changeFound = true;
              }
            }
          }
        });
      }
      this.setState({
        candidateList: newCandidateList,
        changeFound,
      });
    }
  }

  getCandidateLink (candidateWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/candidate/${candidateWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/candidate/${candidateWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/office/${this.props.we_vote_id}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/office/${this.props.we_vote_id}/b/btdb/`; // back-to-default-ballot
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('OfficeItemForAddPositions caught error: ', `${error} with info: `, info);
  }

  goToCandidateLink (candidateWeVoteId) {
    const candidateLink = this.getCandidateLink(candidateWeVoteId);
    historyPush(candidateLink);
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  toggleShowCandidates () {
    const { showCandidates } = this.state;
    this.setState({
      showCandidates: !showCandidates,
    });
  }

  render () {
    // console.log('OfficeItemForAddPositions render');
    renderLog(__filename);
    let { ballot_item_display_name: ballotItemDisplayName } = this.props;
    const { we_vote_id: weVoteId, classes, theme } = this.props;
    const { candidateList, showCandidates } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    const unsortedCandidateList = this.state.candidateList ? this.state.candidateList.slice(0) : {};
    const arrayOfCandidatesVoterSupports = [];
    let supportProps;
    let candidateHasVoterSupport;
    let voterIssuesScoreForCandidate;

    // Prepare an array of candidate names that are supported by voter
    unsortedCandidateList.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        candidateHasVoterSupport = supportProps.is_support;
        voterIssuesScoreForCandidate = IssueStore.getIssuesScoreByBallotItemWeVoteId(candidate.we_vote_id);
        candidate.voterNetworkScoreForCandidate = Math.abs(supportProps.support_count - supportProps.oppose_count);
        candidate.voterIssuesScoreForCandidate = Math.abs(voterIssuesScoreForCandidate);
        candidate.is_support = supportProps.is_support;
        if (candidateHasVoterSupport) {
          arrayOfCandidatesVoterSupports.push(candidate.ballot_item_display_name);
          // voterSupportsAtLeastOneCandidate = true;
        }
      }
    });

    const sortedCandidateList = unsortedCandidateList;
    sortedCandidateList.sort((optionA, optionB) => optionB.voterNetworkScoreForCandidate - optionA.voterNetworkScoreForCandidate ||
                                                   (optionA.is_support === optionB.is_support ? 0 : optionA.is_support ? -1 : 1) ||  // eslint-disable-line no-nested-ternary
                                                   optionB.voterIssuesScoreForCandidate - optionA.voterIssuesScoreForCandidate);

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (arrayOfCandidatesVoterSupports.length === 0) {
      // This function finds the highest support count for each office but does not handle ties. If two candidates have
      // the same network support count, only the first candidate will be displayed.
      let largestNetworkSupportCount = 0;
      let networkSupportCount;
      let networkOpposeCount;
      let largestIssueScore = 0;
      sortedCandidateList.forEach((candidate) => {
        // Support in voter's network
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          networkSupportCount = supportProps.support_count;
          networkOpposeCount = supportProps.oppose_count;

          if (networkSupportCount > networkOpposeCount) {
            if (networkSupportCount > largestNetworkSupportCount) {
              largestNetworkSupportCount = networkSupportCount;
            }
          }
        }
        // Support based on Issue score
        if (voterIssuesScoreForCandidate > largestIssueScore) {
          largestIssueScore = voterIssuesScoreForCandidate;
        }
      });
    }

    return (
      <div className="card-main office-item">
        <a // eslint-disable-line
          className="anchor-under-header"
          name={weVoteId}
        />
        <div className="card-main__content">
          {/* Desktop */}
          <div
            id={`officeItemForAddPositionsTopNameLink-${weVoteId}`}
            onClick={() => this.toggleShowCandidates()}
          >
            <Title>
              {ballotItemDisplayName}
              {showCandidates ? (
                <ArrowDropUp
                  classes={{ root: classes.cardHeaderIconRoot }}
                />
              ) :
                (
                  <ArrowDropDown
                    classes={{ root: classes.cardHeaderIconRoot }}
                  />
                )
              }
            </Title>
          </div>
          {/* Display all candidates running for this office */}
          {showCandidates && (
            <Container candidateLength={candidateList.length}>
              { candidateList.map((oneCandidate) => {
                if (!oneCandidate || !oneCandidate.we_vote_id) {
                  return null;
                }
                return (
                  <CandidateInfo
                    brandBlue={theme.palette.primary.main}
                    candidateLength={candidateList.length}
                    id={`officeItemCompressedCandidateInfo-${oneCandidate.we_vote_id}`}
                    key={`candidate_preview-${oneCandidate.we_vote_id}`}
                  >
                    <CandidateItemForAddPositions
                      oneCandidate={oneCandidate}
                    />
                  </CandidateInfo>
                );
              })}
            </Container>
          )}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
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

const Container = styled.div`
  display: flex;
  flex-flow: ${({ candidateLength }) => (candidateLength > 2 ? 'row wrap' : 'row')};
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: row wrap;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const CandidateInfo = styled.div`
  display: flex;
  flex-flow: column;
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
  overflow-x: hidden;
  transition: all 200ms ease-in;
  border: 1px solid ${({ theme }) => theme.colors.grayBorder};
  width: ${({ candidateLength }) => (candidateLength > 1 ? '48%' : '100%')};
  margin-right: 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.linkHoverBorder};
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: column;
    width: 100%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-flow: column;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
    padding: 16px 0 0 0;
    margin-bottom: 8px;
    width: 100%;
    &:hover {
      border: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
      box-shadow: none;
    }
  }
`;

export default withTheme(withStyles(styles)(OfficeItemForAddPositions));
