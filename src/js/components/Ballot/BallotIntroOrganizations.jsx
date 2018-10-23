import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import VoterGuideActions from "../../actions/VoterGuideActions";
import { renderLog } from "../../utils/logging";
import OrganizationFollowToggle from "./OrganizationFollowToggle";
import VoterGuideStore from "../../stores/VoterGuideStore";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
// const PREVIOUS_ADVISERS_PROMPT_TEXT = "Listen to three or more advisers to get recommendations on your ballot.";
const SELECT_ORGANIZATION_PROMPT = "Are you sure you don't want to listen to at least one organization that shares your values? Listening will show you recommendations on your ballot.";


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
      next_button_text: NEXT_BUTTON_TEXT,
    };
  }

  componentDidMount () {
    VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();
    this.onVoterGuideStoreChange();
    this.onOrganizationFollow = this.onOrganizationFollow.bind(this);
    this.onOrganizationStopFollowing = this.onOrganizationStopFollowing.bind(this);
    this.onNext = this.onNext.bind(this);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({ voter_guides_to_follow_by_issues_followed: VoterGuideStore.getVoterGuidesToFollowByIssuesFollowed() });
  }

  onOrganizationFollow (organization_we_vote_id) {
    let index = this.state.followed_organizations.indexOf(organization_we_vote_id);
    if (index === -1) {
      var new_followed_organizations = this.state.followed_organizations;
      new_followed_organizations.push(organization_we_vote_id);
      this.setState({
        description_text: "",
        followed_organizations: new_followed_organizations,
        next_button_text: NEXT_BUTTON_TEXT,
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
      this.setState({
        description_text: SELECT_ORGANIZATION_PROMPT,
        next_button_text: SKIP_BUTTON_TEXT,
      });
    }
  }

  render () {
    renderLog(__filename);
    // BallotIntroFollowAdvisers is very similar. Check to see if we want to keep that file and this one in sync.
    let voter_guides_to_follow_by_issues_followed = this.state.voter_guides_to_follow_by_issues_followed || [];

    const voter_guides_to_follow_by_issues_followed_for_display = voter_guides_to_follow_by_issues_followed.map((voter_guide) =>
      <OrganizationFollowToggle
        key={voter_guide.organization_we_vote_id}
        organization_we_vote_id={voter_guide.organization_we_vote_id}
        organization_name={voter_guide.voter_guide_display_name}
        organization_description={voter_guide.twitter_description}
        organization_image_url={voter_guide.voter_guide_image_url_large}
        on_organization_follow={this.onOrganizationFollow}
        on_organization_stop_following={this.onOrganizationStopFollowing}
        grid="col-4 col-sm-3" />
    );

    return <div className="intro-modal">
      <div className="intro-modal__h1">Listen to Organizations or People</div>
      <div className="intro-modal__h2">These are organizations or people that might share your values. Listen to them to see their recommendations.</div>
      <br/>
      <div className="intro-modal-vertical-scroll-contain">
        <div className="intro-modal-vertical-scroll card">
          <div className="row intro-modal__grid">
            { voter_guides_to_follow_by_issues_followed_for_display.length ?
              voter_guides_to_follow_by_issues_followed_for_display :
              <h4>No organizations to display</h4>
            }
          </div>
        </div>
      </div>
      <div className="intro-modal__p">
        {this.state.description_text}
      </div>
      <div className="u-flex-auto" />
      <div className="intro-modal__button-wrap">
        <Button type="submit" bsPrefix="btn btn-success intro-modal__button" onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
      </div>
    </div>;
  }
}
