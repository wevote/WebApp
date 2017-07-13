import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import OrganizationFollowToggle from "./OrganizationFollowToggle";
import GuideStore from "../../stores/GuideStore";
import VoterStore from "../../stores/VoterStore";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
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
      organization_list_from_issues: GuideStore.retrieveGuidesToFollowByIssueFilter(),
      organization_list_to_follow:  GuideStore.toFollowList(),
      next_button_text: NEXT_BUTTON_TEXT
    };
  }

  componentDidMount () {
    GuideActions.retrieveGuidesToFollowByIssueFilter();
    GuideActions.retrieveGuidesToFollow(VoterStore.election_id());
    this._onGuideStoreChange();
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange () {
    this.setState({
      organization_list_from_issues: GuideStore.retrieveGuidesToFollowByIssueFilter(),
      organization_list_to_follow: GuideStore.toFollowList()
    });
  }

  onOrganizationFollow (organization_we_vote_id) {
    let index = this.state.followed_organizations.indexOf(organization_we_vote_id);
    if (index === -1) {
      var new_followed_organizations = this.state.followed_organizations;
      new_followed_organizations.push(organization_we_vote_id);
      this.setState({
        description_text: "",
        followed_organizations: new_followed_organizations,
        next_button_text: NEXT_BUTTON_TEXT
      });
    }
  }

  onOrganizationStopFollowing (organization_we_vote_id) {
    let index = this.state.followed_organizations.indexOf(organization_we_vote_id);
    if (index > -1) {
      var new_followed_organizations = this.state.followed_organizations;
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
    var organization_followed_length = this.state.followed_organizations.length;
    if (organization_followed_length > 0 || this.state.next_button_text === SKIP_BUTTON_TEXT) {
      this.props.next();
    } else if (organization_followed_length === 0) {
      const SELECT_ORGANIZATION_PROMPT = "Are you sure you don't want to follow at least one organization that " +
        "shares your values? Following will show you recommendations on your ballot.";
      this.setState({
        description_text: SELECT_ORGANIZATION_PROMPT,
        next_button_text: SKIP_BUTTON_TEXT,
      });
    }
  }

  render () {
    // These are the organizations that a voter might want to follow based on the issues the voter is following.
    let organization_list_from_issues = [];
    if (this.state.organization_list_from_issues) {
      organization_list_from_issues = this.state.organization_list_from_issues;
    }

    const organization_list_from_issues_for_display = organization_list_from_issues.map((organization) => {
      return <OrganizationFollowToggle
        key={organization.organization_we_vote_id}
        organization_we_vote_id={organization.organization_we_vote_id}
        organization_name={organization.voter_guide_display_name}
        organization_description={organization.twitter_description}
        organization_image_url={organization.voter_guide_image_url_medium}
        on_organization_follow={this.onOrganizationFollow}
        on_organization_stop_following={this.onOrganizationStopFollowing}
        />;
    });

    // These are organizations based on the upcoming election
    let organization_list_to_follow = [];
    if (this.state.organization_list_to_follow) {
      organization_list_to_follow = this.state.organization_list_to_follow;
    }
    const organization_list_to_follow_for_display = organization_list_to_follow.map((organization) => {
      return <OrganizationFollowToggle
        key={organization.organization_we_vote_id}
        organization_we_vote_id={organization.organization_we_vote_id}
        organization_name={organization.voter_guide_display_name}
        organization_description={organization.twitter_description}
        organization_image_url={organization.voter_guide_image_url_medium}
        on_organization_follow={this.onOrganizationFollow}
        on_organization_stop_following={this.onOrganizationStopFollowing}
        />;
    });

    return <div className="intro-modal">
      <div className="intro-modal__h1">Follow Organizations</div>
      { organization_list_from_issues_for_display.length > 0 ?
        <div>
          <div className="intro-modal-vertical-scroll-contain">
            <div className="intro-modal-vertical-scroll card">
              { organization_list_from_issues_for_display.length > 0 ?
                organization_list_from_issues_for_display :
                <h4>No organizations to display</h4>
              }
            </div>
          </div>
          <div className="intro-modal-description-text">
            { this.state.description_text ?
              this.state.description_text :
              <span>Great work! Based on your issues, these organizations or people
                might share your values. Follow them for recommendations.</span>
            }
          </div>
        </div> :
        <div>
          <div className="intro-modal-vertical-scroll-contain">
            <div className="intro-modal-vertical-scroll card">
              { organization_list_to_follow_for_display.length > 0 ?
                organization_list_to_follow_for_display :
                <h4>No organizations to display</h4>
              }
            </div>
          </div>
          <div className="intro-modal__description-text">
            { this.state.description_text ?
              this.state.description_text :
              <span>These organizations or people provide voter guides. Follow them for recommendations.</span>
            }
          </div>
        </div>
      }
      <br/>
      <div className="intro-modal__button-wrap">
        <Button type="submit" className="btn btn-success intro-modal__button" onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
      </div>
    </div>;
  }
}
