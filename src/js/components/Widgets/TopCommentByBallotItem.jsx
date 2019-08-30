import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { extractFirstEndorsementFromPositionList } from '../../utils/positionFunctions';
import { shortenText, stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

class TopCommentByBallotItem extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    children: PropTypes.object,
    childChangeIndicator: PropTypes.string,
    classes: PropTypes.object,
    externalUniqueId: PropTypes.string,
    hideMoreButton: PropTypes.bool,
    learnMoreText: PropTypes.string,
    learnMoreUrl: PropTypes.string,
    limitToNo: PropTypes.bool,
    limitToYes: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      // organizationsToFollow: [],
      ballotItemWeVoteId: '',
      endorsementOrganization: {},
      endorsementText: '',
      externalUniqueId: '',
      learnMoreText: '',
      learnMoreUrl: '',
      localUniqueId: '',
    };
  }

  componentDidMount () {
    // console.log('TopCommentByBallotItem componentDidMount');
    const { ballotItemWeVoteId, externalUniqueId } = this.props;
    const isForCandidate = stringContains('cand', ballotItemWeVoteId);
    const isForMeasure = stringContains('meas', ballotItemWeVoteId);

    if (isForCandidate) {
      const allCachedPositionsForCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      // console.log('componentDidMount allCachedPositionsForCandidate: ', allCachedPositionsForCandidate);
      const limitToYes = true;
      const candidateResults = extractFirstEndorsementFromPositionList(allCachedPositionsForCandidate, limitToYes);
      // console.log('candidateResults.endorsementText: ', candidateResults.endorsementText);

      this.setState({
        ballotItemWeVoteId,
        endorsementOrganization: candidateResults.endorsementOrganization,
        endorsementText: candidateResults.endorsementText,
      });
    }

    if (isForMeasure) {
      const allCachedPositionsForMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      // console.log('TopCommentByBallotItem componentDidMount allCachedPositionsForMeasure: ', allCachedPositionsForMeasure);
      const measureResults = extractFirstEndorsementFromPositionList(allCachedPositionsForMeasure, this.props.limitToYes, this.props.limitToNo);
      // console.log('measureResults.endorsementText: ', measureResults.endorsementText);

      this.setState({
        ballotItemWeVoteId,
        endorsementOrganization: measureResults.endorsementOrganization,
        endorsementText: measureResults.endorsementText,
      });
    }
    this.setState({
      externalUniqueId,
      learnMoreText: this.props.learnMoreText,
      learnMoreUrl: this.props.learnMoreUrl,
      localUniqueId: ballotItemWeVoteId,
    });

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('TopCommentByBallotItem componentWillReceiveProps');
    // Do not update the state if the organizationsToFollow list looks the same, and the ballotItemWeVoteId hasn't changed
    const { ballotItemWeVoteId } = nextProps;
    const isForCandidate = stringContains('cand', ballotItemWeVoteId);
    const isForMeasure = stringContains('meas', ballotItemWeVoteId);

    if (isForCandidate) {
      const allCachedPositionsForCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      // console.log('componentWillReceiveProps allCachedPositionsForCandidate: ', allCachedPositionsForCandidate);
      const limitToYes = true;
      const candidateResults = extractFirstEndorsementFromPositionList(allCachedPositionsForCandidate, limitToYes);
      // console.log('candidateResults.endorsementText: ', candidateResults.endorsementText);

      this.setState({
        ballotItemWeVoteId,
        endorsementOrganization: candidateResults.endorsementOrganization,
        endorsementText: candidateResults.endorsementText,
      });
    }

    if (isForMeasure) {
      const allCachedPositionsForMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      // console.log('componentWillReceiveProps allCachedPositionsForMeasure: ', allCachedPositionsForMeasure);
      const measureResults = extractFirstEndorsementFromPositionList(allCachedPositionsForMeasure, this.props.limitToYes, this.props.limitToNo);
      // console.log('measureResults.endorsementText: ', measureResults.endorsementText);

      this.setState({
        ballotItemWeVoteId,
        endorsementOrganization: measureResults.endorsementOrganization,
        endorsementText: measureResults.endorsementText,
      });
    }
    this.setState({
      learnMoreText: nextProps.learnMoreText,
      learnMoreUrl: nextProps.learnMoreUrl,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.childChangeIndicator !== nextProps.childChangeIndicator) {
      // console.log('shouldComponentUpdate: this.props.childChangeIndicator', this.props.childChangeIndicator, ', nextProps.childChangeIndicator', nextProps.childChangeIndicator);
      return true;
    }
    if (this.state.endorsementOrganization !== nextState.endorsementOrganization) {
      // console.log('shouldComponentUpdate: this.state.endorsementOrganization', this.state.endorsementOrganization, ', nextState.endorsementOrganization', nextState.endorsementOrganization);
      return true;
    }
    if (this.state.endorsementText !== nextState.endorsementText) {
      // console.log('shouldComponentUpdate: this.state.endorsementText', this.state.endorsementText, ', nextState.endorsementText', nextState.endorsementText);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isForCandidate = stringContains('cand', ballotItemWeVoteId);

    if (isForCandidate) {
      const allCachedPositionsForCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      // console.log('onCandidateStoreChange allCachedPositionsForCandidate: ', allCachedPositionsForCandidate);
      const limitToYes = true;
      const results = extractFirstEndorsementFromPositionList(allCachedPositionsForCandidate, limitToYes);
      // console.log('results.endorsementText: ', results.endorsementText);

      this.setState({
        endorsementOrganization: results.endorsementOrganization,
        endorsementText: results.endorsementText,
      });
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isForMeasure = stringContains('meas', ballotItemWeVoteId);
    if (isForMeasure) {
      const allCachedPositionsForMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      // console.log('onMeasureStoreChange allCachedPositionsForMeasure: ', allCachedPositionsForMeasure);
      const results = extractFirstEndorsementFromPositionList(allCachedPositionsForMeasure, this.props.limitToYes, this.props.limitToNo);
      // console.log('results.endorsementText: ', results.endorsementText);

      this.setState({
        endorsementOrganization: results.endorsementOrganization,
        endorsementText: results.endorsementText,
      });
    }
  }

  onVoterGuideStoreChange () {
    this.onCandidateStoreChange();
    this.onMeasureStoreChange();
  }

  // getOrganizationsWithPositions = () => this.state.organizationsToFollow.map((organization) => {
  //   let organizationPositionForThisBallotItem;
  //   if (stringContains('cand', this.state.ballotItemWeVoteId)) {
  //     organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
  //     // console.log({ ...organizationPositionForThisBallotItem, ...organization });
  //   } else if (stringContains('meas', this.state.ballotItemWeVoteId)) {
  //     organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
  //   }
  //   return { ...organizationPositionForThisBallotItem, ...organization };
  // });
  //
  // sortOrganizations (organizationsList, ballotItemWeVoteId) {
  //   // console.log('sortOrganizations: ', organizationsList, 'ballotItemWeVoteId: ', ballotItemWeVoteId);
  //   if (organizationsList && ballotItemWeVoteId) {
  //     // console.log('Checking for resort');
  //     const arrayLength = organizationsList.length;
  //     let organization;
  //     let organizationPositionForThisBallotItem;
  //     const sortedOrganizations = [];
  //     for (let i = 0; i < arrayLength; i++) {
  //       organization = organizationsList[i];
  //       organizationPositionForThisBallotItem = null;
  //       if (ballotItemWeVoteId && organization.organization_we_vote_id) {
  //         if (stringContains('cand', ballotItemWeVoteId)) {
  //           organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
  //         } else if (stringContains('meas', ballotItemWeVoteId)) {
  //           organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
  //         }
  //       }
  //       if (organizationPositionForThisBallotItem && organizationPositionForThisBallotItem.statement_text) {
  //         // console.log('sortOrganizations unshift');
  //         sortedOrganizations.unshift(organization);
  //       } else {
  //         // console.log('sortOrganizations push');
  //         sortedOrganizations.push(organization);
  //       }
  //     }
  //     return sortedOrganizations;
  //   }
  //   return organizationsList;
  // }

  render () {
    // console.log('TopCommentByBallotItem render');
    renderLog(__filename);
    const { classes, hideMoreButton } = this.props;
    const { endorsementOrganization, endorsementText, externalUniqueId, localUniqueId } = this.state;
    if (!endorsementText) {
      // console.log('TopCommentByBallotItem no endorsementText');
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    const croppedEndorsementTextDesktopTablet = shortenText(endorsementText, 100);
    const croppedEndorsementTextMobile = shortenText(endorsementText, 75);
    const learnMoreText = this.state.learnMoreText ? this.state.learnMoreText : 'more';

    // console.log('GuideList organizationsToFollow: ', this.state.organizationsToFollow);
    //       on_click={this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}
    return (
      <Wrapper>
        <BallotItemEndorserName>
          {endorsementOrganization}
          .
        </BallotItemEndorserName>
        <BallotItemEndorsementTextDesktop className="u-show-desktop-tablet">
          {' '}
          &quot;
          {croppedEndorsementTextDesktopTablet}
          &quot;
        </BallotItemEndorsementTextDesktop>
        <BallotItemEndorsementTextMobile className="u-show-mobile">
          {' '}
          &quot;
          {croppedEndorsementTextMobile}
          &quot;
        </BallotItemEndorsementTextMobile>
        { hideMoreButton ? null : (
          <span>
            { this.state.learnMoreUrl ? (
              <span>
                {' '}
                <Link to={this.state.learnMoreUrl}>{learnMoreText}</Link>
              </span>
            ) : (
              <Button
                id={`topCommentButton-${externalUniqueId}-${localUniqueId}`}
                variant="outlined"
                color="primary"
                className="u-float-right"
                classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
              >
                {learnMoreText}
              </Button>
            )
            }
          </span>
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    padding: 4,
    fontSize: 12,
    width: 60,
    height: 30,
    [theme.breakpoints.down('md')]: {
      width: 60,
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
  buttonOutlinedPrimary: {
    background: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

const Wrapper = styled.span`
  font-size: 14px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

const BallotItemEndorserName = styled.span`
  color: #999;
  font-size: 14px;
  font-weight: 500;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 15px;
  }
`;

const BallotItemEndorsementTextDesktop = styled.span`
  color: #555;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 600;
`;

const BallotItemEndorsementTextMobile = styled.span`
  color: #555;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 600;
`;

export default withStyles(styles)(TopCommentByBallotItem);
