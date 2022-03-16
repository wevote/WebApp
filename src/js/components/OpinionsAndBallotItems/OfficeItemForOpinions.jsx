import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from '@mui/material/styles/styled';
import CandidateStore from '../../stores/CandidateStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import { toTitleCase } from '../../utils/textFormat';
import CandidateItemForOpinions from './CandidateItemForOpinions';

class OfficeItemForOpinions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      organizationWeVoteId: '',
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
    const organizationWeVoteId = (this.props.organization && this.props.organization.organization_we_vote_id) ? this.props.organization.organization_we_vote_id : this.props.organizationWeVoteId;
    // console.log('OfficeItemForOpinions componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      candidateList: this.props.candidateList,
      organizationWeVoteId,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const organizationWeVoteId = (nextProps.organization && nextProps.organization.organization_we_vote_id) ? nextProps.organization.organization_we_vote_id : nextProps.organizationWeVoteId;
    // console.log('officeItemCompressed componentWillReceiveProps, organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      candidateList: nextProps.candidateList,
      organizationWeVoteId,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('OfficeItemForOpinions caught error: ', `${error} with info: `, info);
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
    const { ballotItemWeVoteId } = this.props;
    const { candidateList } = this.state;
    if (candidateList && candidateList.length && ballotItemWeVoteId) {
      const newCandidateList = [];
      let newCandidate = {};
      let candidateModified = {};
      candidateList.forEach((candidate) => {
        if (candidate && candidate.we_vote_id) {
          candidateModified = candidate;
          newCandidate = CandidateStore.getCandidate(candidate.we_vote_id);
          if (newCandidate.ballot_item_display_name && candidate.ballot_item_display_name !== newCandidate.ballot_item_display_name) {
            candidateModified.ballot_item_display_name = newCandidate.ballot_item_display_name;
          }
          if (newCandidate.candidate_photo_url_medium && candidate.candidate_photo_url_medium !== newCandidate.candidate_photo_url_medium) {
            candidateModified.candidate_photo_url_medium = newCandidate.candidate_photo_url_medium;
          }
          if (newCandidate.party && candidate.party !== newCandidate.party) {
            candidateModified.party = newCandidate.party;
          }
          newCandidateList.push(candidate);
        }
      });
      this.setState({
        candidateList: newCandidateList,
      });
    }
  }

  getCandidateLink (candidateWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/candidate/${candidateWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/candidate/${candidateWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    const { ballotItemWeVoteId } = this.props;
    return `/office/${ballotItemWeVoteId}/b/btdb`; // back-to-default-ballot
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  render () {
    renderLog('OfficeItemForOpinions');  // Set LOG_RENDER_EVENTS to log all renders
    let { ballotItemDisplayName } = this.props;
    const { ballotItemWeVoteId, candidatesToShowForSearchResults, theme, externalUniqueId } = this.props;
    const { candidateList } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);

    return (
      <div className="card-main office-item" key={`officeItemForAddPositions-${ballotItemWeVoteId}-${externalUniqueId}`}>
        <a // eslint-disable-line
          className="anchor-under-header"
          name={ballotItemWeVoteId}
        />
        <div className="card-main__content">
          <div
            id={`officeItemForAddPositionsTopNameLink-${ballotItemWeVoteId}`}
            onClick={this.goToOfficeLink}
          >
            <Title>
              {ballotItemDisplayName}
            </Title>
          </div>
          {/* Display all candidates running for this office */}
          <Container candidateLength={candidateList.length}>
            { candidateList.map((oneCandidate) => {
              if (!oneCandidate || !oneCandidate.we_vote_id || (candidatesToShowForSearchResults && candidatesToShowForSearchResults.length && !candidatesToShowForSearchResults.includes(oneCandidate.we_vote_id))) {
                return null;
              }
              return (
                <CandidateInfo
                  brandBlue={theme.palette.primary.main}
                  numberOfCandidatesInList={candidateList.length}
                  id={`officeItemCompressedAddPositions-${oneCandidate.we_vote_id}`}
                  key={`${externalUniqueId}-candidatePreview-${oneCandidate.we_vote_id}`}
                >
                  <CandidateItemForOpinions
                    oneCandidate={oneCandidate}
                    numberOfCandidatesInList={candidateList.length}
                  />
                </CandidateInfo>
              );
            })}
          </Container>
        </div>
      </div>
    );
  }
}
OfficeItemForOpinions.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  candidatesToShowForSearchResults: PropTypes.array,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  theme: PropTypes.object,
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
    [theme.breakpoints.down('xl')]: {
      marginBottom: '.2rem',
    },
  },
});

const Container = styled('div')`
  display: flex;
  flex-flow: ${({ candidateLength }) => (candidateLength > 2 ? 'row wrap' : 'row')};
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: row wrap;
  }
`;

const Title = styled('div')`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const CandidateInfo = styled('div')`
  display: flex;
  flex-flow: column;
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
  overflow-x: hidden;
  transition: all 200ms ease-in;
  border: 1px solid ${({ theme }) => theme.colors.grayBorder};
  width: ${({ numberOfCandidatesInList }) => (numberOfCandidatesInList > 1 ? '48%' : '100%')};
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

export default withTheme(withStyles(styles)(OfficeItemForOpinions));
