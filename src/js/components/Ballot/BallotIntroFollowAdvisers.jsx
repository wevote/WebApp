import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import VoterGuideActions from "../../actions/VoterGuideActions";
import { renderLog } from "../../utils/logging";
import OrganizationFollowToggle from "./OrganizationFollowToggle";
import { isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from "../../utils/organization-functions";
import VoterGuideStore from "../../stores/VoterGuideStore";

const NEXT_BUTTON_TEXT = "Next";
const SKIP_BUTTON_TEXT = "Skip";
// const PREVIOUS_ADVISERS_PROMPT_TEXT = "Follow three or more advisers to get recommendations on your ballot.";


export default class BallotIntroFollowAdvisers extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      description_text: "",
      followed_organizations: [],
      voter_guides_to_follow_by_issues_followed: [],
      voter_guides_to_follow_all: [],
      next_button_text: NEXT_BUTTON_TEXT,
    };

    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  componentDidMount () {
    VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();
    // let search_string = "";
    // let add_voter_guides_not_from_election = false;
    // VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.election_id(), search_string, add_voter_guides_not_from_election);
    this.onVoterGuideStoreChange();
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // update followed_organizations only for first time, subsequent updates will be made locally
    if (!this.state.followed_organizations.length) {
      this.setState({
        voter_guides_to_follow_by_issues_followed: VoterGuideStore.getVoterGuidesToFollowByIssuesFollowed(),
        voter_guides_to_follow_all: VoterGuideStore.getVoterGuidesToFollowAll(),
        followed_organizations: VoterGuideStore.getVoterGuidesVoterIsFollowing(),
      });
    }
  }

  onOrganizationFollow (organization_we_vote_id) {
    const index = this.state.followed_organizations.indexOf(organization_we_vote_id);
    if (index === -1) {
      const new_followed_organizations = this.state.followed_organizations;
      new_followed_organizations.push(organization_we_vote_id);
      this.setState({
        description_text: "",
        followed_organizations: new_followed_organizations,
        next_button_text: NEXT_BUTTON_TEXT,
      });
    }
  }

  onOrganizationStopFollowing (organization_we_vote_id) {
    const index = this.state.followed_organizations.indexOf(organization_we_vote_id);
    if (index > -1) {
      const new_followed_organizations = this.state.followed_organizations;
      new_followed_organizations.splice(index, 1);
      if (new_followed_organizations.length === 0) {
        this.setState({
          description_text: "",
          followed_organizations: new_followed_organizations,
          next_button_text: NEXT_BUTTON_TEXT,
        });
      } else {
        this.setState({
          followed_organizations: new_followed_organizations,
        });
      }
    }
  }

  onNext () {
    const organization_followed_length = this.state.followed_organizations.length;
    if (organization_followed_length > 0 || this.state.next_button_text === SKIP_BUTTON_TEXT) {
      this.props.next();
    } else if (organization_followed_length === 0) {
      const SELECT_ORGANIZATION_PROMPT = "Are you sure you don't want to listen to at least one organization that " +
        "shares your values? Listening will show you recommendations on your ballot.";
      this.setState({
        description_text: SELECT_ORGANIZATION_PROMPT,
        next_button_text: SKIP_BUTTON_TEXT,
      });
    }
  }

  render () {
    renderLog(__filename);
    // BallotIntroOrganizations is very similar. Check to see if we want to keep that file and this one in sync.
    // These are the organizations that a voter might want to follow based on the issues the voter is following.
    const voter_guides_to_follow_by_issues_followed = this.state.voter_guides_to_follow_by_issues_followed || [];

    // We want to keep track of organizations we have already offered to the voter, so we don't show one twice
    let index;
    const organization_we_vote_ids_displayed = [];
    for (index = 0; index < voter_guides_to_follow_by_issues_followed.length; ++index) {
      organization_we_vote_ids_displayed.push(voter_guides_to_follow_by_issues_followed[index].organization_we_vote_id);
    }

    let organizations_shown_count = 0;
    const maximum_number_of_organizations_to_show = 12; // Only show the first 6 * 2 = 12 issues so as to not overwhelm voter
    const voter_guides_to_follow_by_issues_for_display = voter_guides_to_follow_by_issues_followed.map((voter_guide) => {
      if (organizations_shown_count < maximum_number_of_organizations_to_show) {
        organizations_shown_count++;
        return (
          <OrganizationFollowToggle
            key={voter_guide.organization_we_vote_id}
            organization_we_vote_id={voter_guide.organization_we_vote_id}
            organization_name={voter_guide.voter_guide_display_name}
            organization_description={voter_guide.twitter_description}
            organization_image_url={voter_guide.voter_guide_image_url_large}
            on_organization_follow={this.onOrganizationFollow}
            on_organization_stop_following={this.onOrganizationStopFollowing}
            grid="col-4 col-sm-3"
          />
        );
      }
      return null;
    });

    // These are organizations based on the upcoming election
    let voter_guides_to_follow_all = [];
    if (this.state.voter_guides_to_follow_all) {
      voter_guides_to_follow_all = this.state.voter_guides_to_follow_all;
    }

    // We want to remove the organizations we've already displayed and limit the total displayed
    const voter_guides_to_follow_all_filtered = [];
    let number_added_to_all_filtered_list = 0;
    let already_seen;
    let exceeded_voter_guides_to_show;
    let is_organization;
    let is_public_figure;
    for (index = 0; index < voter_guides_to_follow_all.length; ++index) {
      // console.log("voter guide to follow, owner type:", voter_guides_to_follow_all[index].voter_guide_owner_type);
      // Filter out some voter guides
      already_seen = organization_we_vote_ids_displayed.includes(voter_guides_to_follow_all[index].organization_we_vote_id);
      exceeded_voter_guides_to_show = number_added_to_all_filtered_list >= maximum_number_of_organizations_to_show;
      is_organization = isSpeakerTypeOrganization(voter_guides_to_follow_all[index].voter_guide_owner_type);
      is_public_figure = isSpeakerTypePublicFigure(voter_guides_to_follow_all[index].voter_guide_owner_type);
      if (!already_seen && !exceeded_voter_guides_to_show && (is_organization || is_public_figure)) {
        voter_guides_to_follow_all_filtered.push(voter_guides_to_follow_all[index]);
        organization_we_vote_ids_displayed.push(voter_guides_to_follow_all[index].organization_we_vote_id);
        number_added_to_all_filtered_list++;
      }
    }

    const voter_guides_to_follow_all_for_display = voter_guides_to_follow_all_filtered.map((voter_guide) => {
      if (organizations_shown_count < maximum_number_of_organizations_to_show) {
        organizations_shown_count++;
        return (
          <OrganizationFollowToggle
            key={voter_guide.organization_we_vote_id}
            organization_we_vote_id={voter_guide.organization_we_vote_id}
            organization_name={voter_guide.voter_guide_display_name}
            organization_description={voter_guide.twitter_description}
            organization_image_url={voter_guide.voter_guide_image_url_large}
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
          { this.state.description_text ?
            this.state.description_text :
            <span>Click to see who they endorse on your ballot. Or skip ahead!</span>
        }
        </div>
        <div className="intro-modal-vertical-scroll-contain">
          <div className="intro-modal-vertical-scroll card">
            <div className="row intro-modal__grid">
              { voter_guides_to_follow_by_issues_for_display.length ? voter_guides_to_follow_by_issues_for_display : null }
              { voter_guides_to_follow_all_for_display.length ? voter_guides_to_follow_all_for_display : null }
              { voter_guides_to_follow_by_issues_for_display.length || voter_guides_to_follow_all_for_display.length ?
                null :
                <h4 className="intro-modal__default-text">There are no more organizations to listen to!</h4>
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
            <span>{this.state.next_button_text}</span>
          </Button>
        </div>
      </div>
    );
  }
}
