import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import CandidateStore from '../../stores/CandidateStore';
import ImageHandler from '../ImageHandler';
import ItemActionBar from '../Widgets/ItemActionBar';
import ItemPositionStatementActionBar from '../Widgets/ItemPositionStatementActionBar';
import { renderLog } from '../../utils/logging';
import SupportStore from '../../stores/SupportStore';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class CandidateItemForAddPositions extends Component {
  static propTypes = {
    oneCandidate: PropTypes.object,
    classes: PropTypes.object,
    theme: PropTypes.object,
    // togglePositionStatement: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      ballotItemSupportProps: {},
      ballotItemWeVoteId: '',
      changeFound: false,
      componentDidMount: false,
      isVoterOppose: false,
      isVoterSupport: false,
      voterStatementText: '',
      oneCandidate: {},
      shouldFocusCommentArea: false,
      showPositionStatement: false,
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log('CandidateItemForAddPositions componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    const { oneCandidate } = this.props;
    if (oneCandidate) {
      const ballotItemSupportProps = SupportStore.get(oneCandidate.we_vote_id);
      const { is_voter_support: isVoterSupport, is_voter_oppose: isVoterOppose, voter_statement_text: voterStatementText } = ballotItemSupportProps || {};
      this.setState({
        ballotItemDisplayName: oneCandidate.ballot_item_display_name,
        ballotItemSupportProps,
        ballotItemWeVoteId: oneCandidate.we_vote_id,
        isVoterOppose,
        isVoterSupport,
        voterStatementText,
      });
    }
    this.setState({
      componentDidMount: true,
      oneCandidate: this.props.oneCandidate,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
      return true;
    }
    if (this.state.changeFound !== nextState.changeFound) {
      // console.log('this.state.changeFound: ', this.state.changeFound, ', nextState.changeFound: ', nextState.changeFound);
      return true;
    }
    if (this.state.isVoterOppose !== nextState.isVoterOppose) {
      // console.log('this.state.isVoterOppose: ', this.state.isVoterOppose, ', nextState.isVoterOppose: ', nextState.isVoterOppose);
      return true;
    }
    if (this.state.isVoterSupport !== nextState.isVoterSupport) {
      // console.log('this.state.isVoterSupport: ', this.state.isVoterSupport, ', nextState.isVoterSupport: ', nextState.isVoterSupport);
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log('this.state.showPositionStatement: ', this.state.showPositionStatement, ', nextState.showPositionStatement: ', nextState.showPositionStatement);
      return true;
    }
    if (this.state.voterStatementText !== nextState.voterStatementText) {
      // console.log('this.state.voterStatementText: ', this.state.voterStatementText, ', nextState.voterStatementText: ', nextState.voterStatementText);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    const changeFound = false;
    this.setState({
      changeFound,
    });
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const ballotItemSupportProps = SupportStore.get(ballotItemWeVoteId);
    const { is_voter_support: isVoterSupport, is_voter_oppose: isVoterOppose, voter_statement_text: voterStatementText } = ballotItemSupportProps || {};
    this.setState({
      ballotItemSupportProps,
      isVoterOppose,
      isVoterSupport,
      voterStatementText,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CandidateItemForAddPositions caught error: ', `${error} with info: `, info);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
      shouldFocusCommentArea: true,
    });
  }

  render () {
    // console.log('CandidateItemForAddPositions render');
    renderLog(__filename);
    // const { classes, theme } = this.props;
    const { ballotItemSupportProps, oneCandidate, showPositionStatement } = this.state;
    if (!oneCandidate || !oneCandidate.we_vote_id) {
      return null;
    }
    const { is_voter_support: isVoterSupport, is_voter_oppose: isVoterOppose, voter_statement_text: voterStatementText } = ballotItemSupportProps || {};

    const commentDisplayDesktop = isVoterSupport || isVoterOppose || voterStatementText || showPositionStatement ? (
      <div className="d-none d-sm-block u-min-50 u-stack--sm u-push--xs">
        <ItemPositionStatementActionBar
          ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
          ballotItemDisplayName={this.state.ballotItemDisplayName}
          comment_edit_mode_on={this.state.showPositionStatement}
          supportProps={this.state.ballotItemSupportProps}
          shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          type="CANDIDATE"
          shown_in_list
        />
      </div>
    ) :
      null;

    const commentDisplayMobile = isVoterSupport || isVoterOppose || voterStatementText ? (
      <div className="d-block d-sm-none u-min-50 u-push--xs">
        <ItemPositionStatementActionBar
          ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
          ballotItemDisplayName={this.state.ballotItemDisplayName}
          supportProps={this.state.ballotItemSupportProps}
          shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          type="CANDIDATE"
          shown_in_list
          mobile
        />
      </div>
    ) :
      null;

    const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
    return (
      <Wrapper>
        <CandidateTopRow>
          <Candidate>
            {/* Candidate Image */}
            <ImageHandler
              className="card-main__avatar-compressed"
              sizeClassName="icon-candidate-small u-push--sm "
              imageUrl={oneCandidate.candidate_photo_url_medium}
              alt="candidate-photo"
              kind_of_ballot_item="CANDIDATE"
            />
            {/* Candidate Name */}
            <div>
              <h4 className="card-main__candidate-name card-main__candidate-name-link u-f5">
                {oneCandidate.ballot_item_display_name}
                <br />
                <span className="card-main__candidate-party-description">{candidatePartyText}</span>
              </h4>
            </div>
          </Candidate>
          {/* Action Buttons: Support/Oppose/Comment */}
          <ItemActionBar
            ballot_item_display_name={oneCandidate.ballot_item_display_name}
            ballotItemWeVoteId={oneCandidate.we_vote_id}
            buttonsOnly
            shareButtonHide
            // supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
            toggleFunction={this.togglePositionStatement}
            // transitioning={this.state.transitioning}
            type="CANDIDATE"
          />
        </CandidateTopRow>
        {commentDisplayDesktop}
        {commentDisplayMobile}
      </Wrapper>
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

const Wrapper = styled.div`
`;

const CandidateTopRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const Candidate = styled.div`
  display: flex;
  cursor: pointer;
`;

export default withTheme(withStyles(styles)(CandidateItemForAddPositions));
