import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import VoterGuideActions from '../../actions/VoterGuideActions';
import { renderLog } from '../../utils/logging';
import OrganizationFollowToggle from './OrganizationFollowToggle';
import { isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from '../../utils/organization-functions';
import VoterGuideStore from '../../stores/VoterGuideStore';

const NEXT_BUTTON_TEXT = 'Next';
const SKIP_BUTTON_TEXT = 'Skip';
// const PREVIOUS_ADVISERS_PROMPT_TEXT = "Follow three or more advisers to get recommendations on your ballot.";


export default class BallotIntroFollowAdvisers extends Component {
  static propTypes = {
    // history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      descriptionText: '',
      followedOrganizations: [],
      voterGuidesToFollowByIssuesFollowed: [],
      voterGuidesToFollowAll: [],
      nextButtonText: NEXT_BUTTON_TEXT,
    };

    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  componentDidMount () {
    VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();
    // let search_string = "";
    // let add_voter_guides_not_from_election = false;
    // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.electionId(), search_string, add_voter_guides_not_from_election);
    this.onVoterGuideStoreChange();
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // update followedOrganizations only for first time, subsequent updates will be made locally
    if (!this.state.followedOrganizations.length) {
      this.setState({
        voterGuidesToFollowByIssuesFollowed: VoterGuideStore.getVoterGuidesToFollowByIssuesFollowed(),
        voterGuidesToFollowAll: VoterGuideStore.getVoterGuidesToFollowAll(),
        followedOrganizations: VoterGuideStore.getVoterGuidesVoterIsFollowing(),
      });
    }
  }

  onOrganizationFollow (organizationWeVoteId) {
    const { followedOrganizations } = this.state;
    const index = followedOrganizations.indexOf(organizationWeVoteId);
    if (index === -1) {
      this.setState({
        descriptionText: '',
        followedOrganizations: { ...followedOrganizations, organizationWeVoteId },
        nextButtonText: NEXT_BUTTON_TEXT,
      });
    }
  }

  onOrganizationStopFollowing (organizationWeVoteId) {
    const { followedOrganizations } = this.state;
    const index = this.state.followedOrganizations.indexOf(organizationWeVoteId);
    if (index > -1) {
      followedOrganizations.splice(index, 1);
      if (followedOrganizations.length === 0) {
        this.setState({
          descriptionText: '',
          followedOrganizations,
          nextButtonText: NEXT_BUTTON_TEXT,
        });
      } else {
        this.setState({
          followedOrganizations,
        });
      }
    }
  }

  onNext () {
    const { followedOrganizations } = this.state;
    const followedLength = followedOrganizations.length;
    if (followedLength > 0 || this.state.nextButtonText === SKIP_BUTTON_TEXT) {
      this.props.next();
    } else if (followedLength === 0) {
      // Follow Organization
      const SELECT_ORGANIZATION_PROMPT = "Are you sure you don't want to follow to at least one organization that " +
        'shares your values? Following will show you recommendations on your ballot.';
      this.setState({
        descriptionText: SELECT_ORGANIZATION_PROMPT,
        nextButtonText: SKIP_BUTTON_TEXT,
      });
    }
  }

  render () {
    const { voterGuidesToFollowByIssuesFollowed, voterGuidesToFollowAll } = this.state;
    renderLog(__filename);
    // We want to keep track of organizations we have already offered to the voter, so we don't show one twice
    const organizationWeVoteIdsDisplayed = voterGuidesToFollowByIssuesFollowed.map(org => org.organization_we_vote_id);

    let organizationsShownCount = 0;
    const maxOrgsToShow = 12; // Only show the first 6 * 2 = 12 issues so as to not overwhelm voter
    const voterGuidesToFollowByIssuesForDisplay = voterGuidesToFollowByIssuesFollowed.map((guide) => {
      if (organizationsShownCount < maxOrgsToShow) {
        organizationsShownCount++;
        return (
          <OrganizationFollowToggle
            key={guide.organization_we_vote_id}
            organization_we_vote_id={guide.organization_we_vote_id}
            organization_name={guide.voter_guide_display_name}
            organization_description={guide.twitter_description}
            organization_image_url={guide.voter_guide_image_url_large}
            on_organization_follow={this.onOrganizationFollow}
            on_organization_stop_following={this.onOrganizationStopFollowing}
            grid="col-4 col-sm-3"
          />
        );
      }
      return null;
    });

    // We want to remove the organizations we've already displayed and limit the total displayed
    const voterGuidesToFollowAllFiltered = [];
    let numberAddedToAllFilteredList = 0;
    let alreadySeen;
    let exceededVoterGuidesToShow;
    let isOrganization;
    let isPublicFigure;
    for (let index = 0; index < voterGuidesToFollowAll.length; index++) {
      // console.log("voter guide to follow, owner type:", voterGuidesToFollowAll[index].voter_guide_owner_type);
      // Filter out some voter guides
      alreadySeen = organizationWeVoteIdsDisplayed.includes(voterGuidesToFollowAll[index].organization_we_vote_id);
      exceededVoterGuidesToShow = numberAddedToAllFilteredList >= maxOrgsToShow;
      isOrganization = isSpeakerTypeOrganization(voterGuidesToFollowAll[index].voter_guide_owner_type);
      isPublicFigure = isSpeakerTypePublicFigure(voterGuidesToFollowAll[index].voter_guide_owner_type);
      if (!alreadySeen && !exceededVoterGuidesToShow && (isOrganization || isPublicFigure)) {
        voterGuidesToFollowAllFiltered.push(voterGuidesToFollowAll[index]);
        organizationWeVoteIdsDisplayed.push(voterGuidesToFollowAll[index].organization_we_vote_id);
        numberAddedToAllFilteredList++;
      }
    }

    const voterGuidesToFollowAllForDisplay = voterGuidesToFollowAllFiltered.map((guide) => {
      if (organizationsShownCount < maxOrgsToShow) {
        organizationsShownCount++;
        return (
          <OrganizationFollowToggle
            key={guide.organization_we_vote_id}
            organization_we_vote_id={guide.organization_we_vote_id}
            organization_name={guide.voter_guide_display_name}
            organization_description={guide.twitter_description}
            organization_image_url={guide.voter_guide_image_url_large}
            on_organization_follow={this.onOrganizationFollow}
            on_organization_stop_following={this.onOrganizationStopFollowing}
            grid="col-4 col-sm-3"
          />
        );
      }
      return null;
    });

    return (
      <div className="intro-modal">
        <div className="intro-modal__h1">
        Opinions You Trust?
        </div>
        <div className="intro-modal__top-description">
          { this.state.descriptionText ?
            this.state.descriptionText :
            <span>Click to see who they endorse on your ballot. Or skip ahead!</span>
        }
        </div>
        <div className="intro-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            <div className="row intro-modal__grid">
              { voterGuidesToFollowByIssuesForDisplay.length ? voterGuidesToFollowByIssuesForDisplay : null }
              { voterGuidesToFollowAllForDisplay.length ? voterGuidesToFollowAllForDisplay : null }
              { voterGuidesToFollowByIssuesForDisplay.length || voterGuidesToFollowAllForDisplay.length ?
                null :
                <h4 className="intro-modal__default-text">There are no more organizations to follow!</h4>
            }
            </div>
          </div>
        </div>
        <div className="intro-modal-shadow-wrap">
          <div className="intro-modal-shadow" />
        </div>
        <div className="u-flex-auto" />
        <div className="intro-modal__button-wrap">
          <Button
          variant="contained"
          color="secondary"
          onClick={this.onNext}
          >
            <span>{this.state.nextButtonText}</span>
          </Button>
        </div>
      </div>
    );
  }
}
