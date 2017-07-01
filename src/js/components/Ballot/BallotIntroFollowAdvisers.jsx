import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import OrganizationFollowToggle from "./OrganizationFollowToggle";
import GuideStore from "../../stores/GuideStore";

const NEXT_BUTTON_TEXT = "Next >";
const SKIP_BUTTON_TEXT = "Skip >";
// const PREVIOUS_ADVISERS_PROMPT_TEXT = "Follow three or more advisers to get recommendations on your ballot.";
const SELECT_ORGANIZATION_PROMPT = "Are you sure you don't want to follow at least one organization that shares your values? Following will show you recommendations on your ballot.";


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
      organizations: [],
      next_button_text: NEXT_BUTTON_TEXT
    };
  }

  componentDidMount () {
    GuideActions.retrieveGuidesToFollowByIssueFilter();
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
    this.setState({ organizations: GuideStore.retrieveGuidesToFollowByIssueFilter() });
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
      this.setState({
        description_text: SELECT_ORGANIZATION_PROMPT,
        next_button_text: SKIP_BUTTON_TEXT,
      });
    }
  }

  render () {
    var organization_list = [];
    if (this.state.organizations) {
      organization_list = this.state.organizations;
    }

    const organization_list_for_display = organization_list.map((organization) => {
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
      <div className="intro-modal__h1">Follow Organizations or People</div>
      <div className="intro-story__h2">Great work! Based on your issues, these are organizations or people that might share your values. Follow them to see their recommendations.</div>
      <br/>
      <div className="intro-modal-vertical-scroll-contain">
        <div className="intro-modal-vertical-scroll card">
          { organization_list.length > 0 ?
            organization_list_for_display :
            <h4>No organizations to display</h4>
          }
        </div>
      </div>
      <div className="intro-story__h2">
        { this.state.description_text }
      </div>
      <br/>
      <div className="intro-modal__padding-btn">
        <Button type="submit" className="btn btn-success" onClick={this.onNext}>
          <span>{this.state.next_button_text}</span>
        </Button>
        <br/>
      </div>
    </div>;
  }
}
