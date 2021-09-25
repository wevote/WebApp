import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import IssueActions from '../../actions/IssueActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import BallotStore from '../../stores/BallotStore';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../utils/apiCalming';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

const FriendInvitationOnboardingValuesList = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ './FriendInvitationOnboardingValuesList'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));

/* global $ */


class ValuesToFollowPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesToFollow: [],
      issueWeVoteIdsVoterIsFollowing: [],
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onIssueStoreChange();
    this.onVoterGuideStoreChange();
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    const voterGuidesFromFriendsUpcomingRetrieve = VoterGuideStore.getOrganizationWeVoteIdsByIssueWeVoteIdDict();
    // $.isEmptyObject equivalent before jQuery is guaranteed to be loaded:
    const hasNoFriends = voterGuidesFromFriendsUpcomingRetrieve && Object.keys(voterGuidesFromFriendsUpcomingRetrieve).length === 0 && voterGuidesFromFriendsUpcomingRetrieve.constructor === Object;
    // console.log('voterGuidesFromFriendsUpcomingRetrieveLength: ', hasNoFriends);
    const googleCivicId = VoterStore.electionId();
    if (hasNoFriends) {
      // May 2021
      if (googleCivicId) {
        if (apiCalming('voterGuidesFromFriendsUpcomingRetrieve', 500)) {
          VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicId);
        }
      } else {
        BallotActions.voterBallotItemsRetrieve(0, '', '');  // Will need to
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onBallotStoreChange () {
    const voterGuidesFromFriendsUpcomingRetrieve = VoterGuideStore.getOrganizationWeVoteIdsByIssueWeVoteIdDict();
    const hasNoFriends = $.isEmptyObject(voterGuidesFromFriendsUpcomingRetrieve);
    const googleCivicId = VoterStore.electionId();
    // May 2021
    if (hasNoFriends) {
      VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicId);
    }
  }

  onIssueStoreChange () {
    this.setState({
      issuesToFollow: IssueStore.getIssuesVoterCanFollow(),
      issueWeVoteIdsVoterIsFollowing: IssueStore.getIssueWeVoteIdsVoterIsFollowing(),
    }, this.onVoterGuideStoreChange);
  }

  onVoterGuideStoreChange () {
    const { issueWeVoteIdsVoterIsFollowing } = this.state;
    const organizationWeVoteIdsAlreadyCaptured = [];
    let voterGuidesForValue = [];
    const voterGuidesThatShareYourValues = [];
    for (let count = 0; count < issueWeVoteIdsVoterIsFollowing.length; count++) {
      voterGuidesForValue = VoterGuideStore.getVoterGuidesForValue(issueWeVoteIdsVoterIsFollowing[count]);
      for (let count2 = 0; count2 < voterGuidesForValue.length; count2++) {
        if (voterGuidesForValue[count2] && voterGuidesForValue[count2].organization_we_vote_id) {
          if (!organizationWeVoteIdsAlreadyCaptured.includes(voterGuidesForValue[count2].organization_we_vote_id)) {
            organizationWeVoteIdsAlreadyCaptured.push(voterGuidesForValue[count2].organization_we_vote_id);
            voterGuidesThatShareYourValues.push(voterGuidesForValue[count2]);
          }
        }
      }
    }
    let thoseWhoShareYourValuesHtml  = null;
    if (voterGuidesThatShareYourValues && voterGuidesThatShareYourValues.length > 0) {
      thoseWhoShareYourValuesHtml = (
        <PublicFiguresAndOrganizationsList>
          {voterGuidesThatShareYourValues.map((voterGuide) => {
            const voterGuideLink = voterGuide.twitter_handle ? `/${voterGuide.twitter_handle}` : `/voterguide/${voterGuide.organization_we_vote_id}`;
            if (!voterGuide.voter_guide_image_url_tiny) {
              return null;
            }
            return (
              <OneVoterGuideWrapper key={`findOpinionsFormPreviewImage-${voterGuide.organization_we_vote_id}`}>
                <Link to={voterGuideLink} className="u-no-underline">
                  <ImageHandler className="card-child__avatar" sizeClassName="image-sm " imageUrl={voterGuide.voter_guide_image_url_tiny} />
                </Link>
              </OneVoterGuideWrapper>
            );
          })}
        </PublicFiguresAndOrganizationsList>
      );
    }
    // console.log('voterGuidesThatShareYourValues:', voterGuidesThatShareYourValues);
    this.setState({
      thoseWhoShareYourValuesHtml,
    });
  }

  goToValuesLink () {
    historyPush('/values/list');
  }

  render () {
    renderLog('ValuesToFollowPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { followToggleOnItsOwnLine, includeLinkToIssue } = this.props;
    const { issuesToFollow, thoseWhoShareYourValuesHtml } = this.state;
    let issuesToFollowLength = 0;
    if (issuesToFollow) {
      issuesToFollowLength = issuesToFollow.length;
    }

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            {!!(thoseWhoShareYourValuesHtml) && (
              <ThoseWhoShareYourValuesWrapper>
                <SharedValuesTitle>
                  Opinions Based on Shared Values
                </SharedValuesTitle>
                {thoseWhoShareYourValuesHtml}
              </ThoseWhoShareYourValuesWrapper>
            )}
            <SectionTitle className="u-cursor--pointer" onClick={() => this.goToValuesLink()}>
              Values to Follow
              {!!(issuesToFollowLength) && (
                <>
                  {' '}
                  (
                  {issuesToFollowLength}
                  )
                </>
              )}
            </SectionTitle>
            <SectionInformation>
              <InfoCircleIcon />
              Follow values/issues to see opinions from people who share your values.
            </SectionInformation>
            <Row className="row">
              <FriendInvitationOnboardingValuesList
                displayOnlyIssuesNotFollowedByVoter
                followToggleOnItsOwnLine={followToggleOnItsOwnLine}
                includeLinkToIssue={includeLinkToIssue}
                oneColumn
              />
            </Row>
            <ShowMoreFooter
              showMoreId="valuesToFollowPreviewShowMoreId"
              showMoreLink={() => this.goToValuesLink()}
              showMoreText="Explore all values"
            />
          </div>
        </section>
      </div>
    );
  }
}
ValuesToFollowPreview.propTypes = {
  followToggleOnItsOwnLine: PropTypes.bool,
  includeLinkToIssue: PropTypes.bool,
};

const OneVoterGuideWrapper = styled.div`
  margin: 1px !important;
`;

const PublicFiguresAndOrganizationsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Row = styled.div`
  margin: 0 !important;
`;

const SectionInformation = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  width: fit-content;
`;

const SharedValuesTitle = styled.h2`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  width: fit-content;
`;

const ThoseWhoShareYourValuesWrapper = styled.div`
  margin-bottom: 15px;
`;

export default withTheme((ValuesToFollowPreview));
