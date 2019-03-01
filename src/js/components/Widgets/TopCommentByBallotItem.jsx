import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import extractFirstEndorsementFromPositionList from '../../utils/positionFunctions';
import { shortenText, stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
// import VoterGuideStore from '../../stores/VoterGuideStore';

export default class TopCommentByBallotItem extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    children: PropTypes.object,
    learnMoreText: PropTypes.string,
    learnMoreUrl: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      // organizationsToFollow: [],
      ballotItemWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log("GuideList componentDidMount");
    const { ballotItemWeVoteId } = this.props;
    // const organizationsToFollow = this.sortOrganizations(this.props.organizationsToFollow, ballotItemWeVoteId);
    const positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(ballotItemWeVoteId);
    // const voterGuidesToFollowForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    // console.log('componentDidMount positionListFromAdvisersFollowedByVoter: ', positionListFromAdvisersFollowedByVoter);
    const results = extractFirstEndorsementFromPositionList(positionListFromAdvisersFollowedByVoter);
    // console.log('endorsementText: ', endorsementText);
    // console.log('voterGuidesToFollowForThisBallotItem: ', voterGuidesToFollowForThisBallotItem);

    this.setState({
      endorsementOrganization: results.endorsementOrganization,
      endorsementText: results.endorsementText,
    });

    // this.setState({
    //   ballotItemWeVoteId,
    //   positionListFromAdvisersFollowedByVoter,
    //   voterGuidesToFollowForThisBallotItem,
    // }, () => {
    //   const orgsWithPositions = this.getOrganizationsWithPositions();
    //   this.setState({
    //     // organizationsWithPositions: orgsWithPositions,
    //     filteredOrganizationsWithPositions: orgsWithPositions,
    //   });
    //   // console.log(orgsWithPositions);
    // });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("GuideList componentWillReceiveProps");
    // Do not update the state if the organizationsToFollow list looks the same, and the ballotItemWeVoteId hasn't changed
    const { ballotItemWeVoteId } = nextProps;
    // const organizationsToFollow = this.sortOrganizations(nextProps.organizationsToFollow, ballotItemWeVoteId);
    const positionListFromAdvisersFollowedByVoter = CandidateStore.getPositionList(ballotItemWeVoteId);
    // const voterGuidesToFollowForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    // console.log('componentWillReceiveProps positionListFromAdvisersFollowedByVoter: ', positionListFromAdvisersFollowedByVoter);
    const results = extractFirstEndorsementFromPositionList(positionListFromAdvisersFollowedByVoter);
    // console.log('endorsementText: ', endorsementText);
    // console.log('voterGuidesToFollowForThisBallotItem: ', voterGuidesToFollowForThisBallotItem);

    this.setState({
      endorsementOrganization: results.endorsementOrganization,
      endorsementText: results.endorsementText,
    });

    // this.setState({
    //   ballotItemWeVoteId,
    //   positionListFromAdvisersFollowedByVoter,
    //   voterGuidesToFollowForThisBallotItem,
    // }, () => {
    //   const orgsWithPositions = this.getOrganizationsWithPositions();
    //   // this.setState({
    //   //   organizationsWithPositions: orgsWithPositions,
    //   // });
    //   if (!this.state.filteredOrganizationsWithPositions.length) {
    //     this.setState({ filteredOrganizationsWithPositions: orgsWithPositions });
    //   }
    // });
  }

  // onCandidateStoreChange () {
  //   // console.log("Candidate onCandidateStoreChange");
  //   if (this.isCandidate()) {
  //     const { ballotItemWeVoteId } = this.state;
  //     this.setState(state => ({
  //       positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(ballotItemWeVoteId),
  //     }));
  //   }
  // }

  handleFilteredOrgsChange = filteredOrgs => this.setState({ filteredOrganizationsWithPositions: filteredOrgs });

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
      // If we don't have any endorsement text, show the Values
      return this.props.children || null;
    }

    const croppedEndorsementTextDesktop = shortenText(endorsementText, 200);
    const croppedEndorsementTextMobile = shortenText(endorsementText, 100);
    const learnMoreText = this.props.learnMoreText ? this.props.learnMoreText : "more";

    // console.log("GuideList organizationsToFollow: ", this.state.organizationsToFollow);
    //       on_click={this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}
    return (
      <div>
        <span className="BallotItem__top-comment">
          <span className="BallotItem__top-comment__endorser-name">
            {endorsementOrganization}
            .
          </span>
          {' "'}
          <span className="u-show-desktop-tablet">{croppedEndorsementTextDesktop}</span>
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
      </div>
    );
  }
}
