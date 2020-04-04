import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';

// https://localhost:3000/add-candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_specific_endorsement_url=https%3A%2F%2Fwww.philting.com%2F&show_data=1
class AddCandidateForExtension extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
  }

  render () {
    renderLog('AddCandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_specific_endorsement_url: candidateSpecificEndorsementUrl,
      show_data: showDevelopmentData,
    } = this.props.location.query;
    // const { organizationWeVoteId, candidateWeVoteId, value } = this.state;
    // const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown, candidateWeVoteId, value } = this.state;
    // console.log('AddCandidateForExtension render');

    return (
      <Wrapper>
        Coming Soon
        {showDevelopmentData && (
          <div style={{ margin: '20px' }}>
            <div>
              <strong>candidateName:</strong>
              {candidateName}
            </div>
            <div>
              <strong>endorsementPageUrl:</strong>
              {endorsementPageUrl}
            </div>
            <div>
              <strong>candidateSpecificEndorsementUrl:</strong>
              {candidateSpecificEndorsementUrl}
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 2.5,
  },
  tab: {
    fontWeight: 600,
  },
  oneButtonShown: {
    width: '100%',
  },
  twoButtonsShown: {
    width: '50%',
    margin: 16,
  },
});

const Wrapper = styled.div`
  height: 100vh;
  background: white;
`;

export default withStyles(styles)(AddCandidateForExtension);
