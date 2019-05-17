import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import { extractFirstEndorsementFromPositionList } from '../../utils/positionFunctions';
import { shortenText, stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

export default class TopCommentByBallotItem extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    children: PropTypes.object,
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
    };
  }

  componentDidMount () {
    // console.log('TopCommentByBallotItem componentDidMount');
    const { ballotItemWeVoteId } = this.props;
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

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
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
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.endorsementOrganization !== nextState.endorsementOrganization) {
      // console.log("shouldComponentUpdate: this.state.endorsementOrganization", this.state.endorsementOrganization, ", nextState.endorsementOrganization", nextState.endorsementOrganization);
      return true;
    }
    if (this.state.endorsementText !== nextState.endorsementText) {
      // console.log("shouldComponentUpdate: this.state.endorsementText", this.state.endorsementText, ", nextState.endorsementText", nextState.endorsementText);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
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

  getOrganizationsWithPositions = () => this.state.organizationsToFollow.map((organization) => {
    let organizationPositionForThisBallotItem;
    if (stringContains('cand', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
      // console.log({ ...organizationPositionForThisBallotItem, ...organization });
    } else if (stringContains('meas', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
    }
    return { ...organizationPositionForThisBallotItem, ...organization };
  });

  sortOrganizations (organizationsList, ballotItemWeVoteId) {
    // console.log("sortOrganizations: ", organizationsList, "ballotItemWeVoteId: ", ballotItemWeVoteId);
    if (organizationsList && ballotItemWeVoteId) {
      // console.log("Checking for resort");
      const arrayLength = organizationsList.length;
      let organization;
      let organizationPositionForThisBallotItem;
      const sortedOrganizations = [];
      for (let i = 0; i < arrayLength; i++) {
        organization = organizationsList[i];
        organizationPositionForThisBallotItem = null;
        if (ballotItemWeVoteId && organization.organization_we_vote_id) {
          if (stringContains('cand', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          } else if (stringContains('meas', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          }
        }
        if (organizationPositionForThisBallotItem && organizationPositionForThisBallotItem.statement_text) {
          // console.log("sortOrganizations unshift");
          sortedOrganizations.unshift(organization);
        } else {
          // console.log("sortOrganizations push");
          sortedOrganizations.push(organization);
        }
      }
      return sortedOrganizations;
    }
    return organizationsList;
  }

  render () {
    // console.log('TopCommentByBallotItem render');
    renderLog(__filename);
    const { endorsementOrganization, endorsementText } = this.state;
    if (!endorsementText) {
      // console.log('TopCommentByBallotItem no endorsementText');
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    const croppedEndorsementTextDesktopTablet = shortenText(endorsementText, 200);
    const croppedEndorsementTextMobile = shortenText(endorsementText, 125);
    const learnMoreText = this.props.learnMoreText ? this.props.learnMoreText : 'more';

    // console.log("GuideList organizationsToFollow: ", this.state.organizationsToFollow);
    //       on_click={this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}
    return (
      <span className="BallotItem__top-comment">
        <span className="BallotItem__top-comment__endorser-name">
          {endorsementOrganization}
          .
        </span>
        {' "'}
        <span className="u-show-desktop-tablet">{croppedEndorsementTextDesktopTablet}</span>
        <span className="u-show-mobile">{croppedEndorsementTextMobile}</span>
        {'"'}
        { this.props.learnMoreUrl && (
          <span>
            {' '}
            <Link to={this.props.learnMoreUrl}>{learnMoreText}</Link>
          </span>
        )
        }
      </span>
    );
  }
}
