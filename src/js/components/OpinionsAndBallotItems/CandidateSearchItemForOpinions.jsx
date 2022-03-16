import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import CandidateItemForOpinions from './CandidateItemForOpinions';

class CandidateSearchItemForOpinions extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CandidateSearchItemForOpinions caught error: ', `${error} with info: `, info);
  }

  getCandidateLink () {
    const { candidateWeVoteId } = this.props;
    return `/candidate/${candidateWeVoteId}/b/btdb`; // back-to-default-ballot
  }

  getOfficeLink () {
    const { contestOfficeWeVoteId } = this.props;
    if (contestOfficeWeVoteId) {
      return `/office/${contestOfficeWeVoteId}/b/btdb`; // back-to-default-ballot
    } else {
      return '';
    }
  }

  goToOfficeLink () {
    const officeLink = this.getOfficeLink();
    historyPush(officeLink);
  }

  render () {
    renderLog('CandidateSearchItemForOpinions');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidateWeVoteId, contestOfficeName, oneCandidate, theme, externalUniqueId } = this.props;

    return (
      <BallotItemCard className="BallotItem card" key={`ballotItemForAddPositions-${candidateWeVoteId}-${externalUniqueId}`}>
        <div className="card-main office-item">
          <a // eslint-disable-line
            className="anchor-under-header"
            name={candidateWeVoteId}
          />
          <div className="card-main__content">
            <div
              id={`officeItemForAddPositionsTopNameLink-${candidateWeVoteId}`}
              onClick={this.goToOfficeLink}
            >
              <Title>
                {contestOfficeName}
              </Title>
            </div>
            {/* Display all candidates running for this office */}
            <Container candidateLength={1}>
              { (oneCandidate && oneCandidate.we_vote_id) && (
                <CandidateInfo
                  brandBlue={theme.palette.primary.main}
                  numberOfCandidatesInList={1}
                  id={`officeItemCompressedAddPositions-${oneCandidate.we_vote_id}`}
                  key={`${externalUniqueId}-candidatePreview-${oneCandidate.we_vote_id}`}
                >
                  <CandidateItemForOpinions
                    oneCandidate={oneCandidate}
                    numberOfCandidatesInList={1}
                  />
                </CandidateInfo>
              )}
            </Container>
          </div>
        </div>
      </BallotItemCard>
    );
  }
}
CandidateSearchItemForOpinions.propTypes = {
  candidateWeVoteId: PropTypes.string.isRequired,
  contestOfficeName: PropTypes.string,
  contestOfficeWeVoteId: PropTypes.string,
  oneCandidate: PropTypes.object,
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

const BallotItemCard = styled('div')`
  $item-padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 2px 1px -1px rgba(0, 0, 0, .12);
  margin-bottom: 16px;
  overflow-y: hidden;
  border: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 0;
  }
`;

const Container = styled('div', {
  shouldForwardProp: (prop) => !['candidateLength'].includes(prop),
})(({ candidateLength }) => (`
  display: flex;
  flex-flow: ${candidateLength > 2 ? 'row wrap' : 'row'};
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-flow: row wrap;
  }
`));

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

const CandidateInfo = styled('div', {
  shouldForwardProp: (prop) => !['numberOfCandidatesInList'].includes(prop),
})(({ numberOfCandidatesInList }) => (`
  display: flex;
  flex-flow: column;
  padding: 16px 16px 0 16px;
  margin-bottom: 8px;
  overflow-x: hidden;
  transition: all 200ms ease-in;
  border: 1px solid ${({ theme }) => theme.colors.grayBorder};
  width: ${numberOfCandidatesInList > 1 ? '48%' : '100%'};
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
`));

export default withTheme(withStyles(styles)(CandidateSearchItemForOpinions));
