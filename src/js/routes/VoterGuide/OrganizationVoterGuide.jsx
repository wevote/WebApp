import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import { Button } from "react-bootstrap";
import AnalyticsActions from "../../actions/AnalyticsActions";
import FollowToggle from "../../components/Widgets/FollowToggle";
import VoterGuideStore from "../../stores/VoterGuideStore";
import HeaderBar from "../../components/Navigation/HeaderBar";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationVoterGuideCard from "../../components/VoterGuide/OrganizationVoterGuideCard";
import OrganizationVoterGuideTabs from "../../components/VoterGuide/OrganizationVoterGuideTabs";
import VoterStore from "../../stores/VoterStore";
const AUTO_FOLLOW = "af";

export default class OrganizationVoterGuide extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization_we_vote_id: "",
      organization: {},
      voter: {},
      auto_follow_redirect_happening: false,
    };
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount (){
    // console.log("OrganizationVoterGuide, componentDidMount, this.props.params.organization_we_vote_id: ", this.props.params.organization_we_vote_id);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this._onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    OrganizationActions.organizationRetrieve(this.props.params.organization_we_vote_id);
    AnalyticsActions.saveActionVoterGuideVisit(this.props.params.organization_we_vote_id);
    // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
    // console.log("action_variable: " + this.props.params.action_variable);
    if (this.props.params.action_variable === AUTO_FOLLOW && this.props.params.organization_we_vote_id) {
      // If we are here,
      // console.log("Auto following");
      OrganizationActions.organizationFollow(this.props.params.organization_we_vote_id);
      // Now redirect to the same page without the "/af" in the route
      let current_path_name = this.props.location.pathname;
      // AUTO_FOLLOW is "af"
      let current_path_name_without_auto_follow = current_path_name.replace("/" + AUTO_FOLLOW, "");
      console.log("OrganizationVoterGuide, current_path_name_without_auto_follow: ", current_path_name_without_auto_follow);
      browserHistory.push(current_path_name_without_auto_follow);
      this.setState({
        auto_follow_redirect_happening: true,
      });
    } else {
      this.setState({
        organization_we_vote_id: this.props.params.organization_we_vote_id,
        voter: VoterStore.getVoter(),
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    if (nextProps.params.action_variable === AUTO_FOLLOW) {
      // Wait until we get the path without the "/af" action variable
      // console.log("OrganizationVoterGuide, componentWillReceiveProps - waiting");
    } else {
      // console.log("OrganizationVoterGuide, componentWillReceiveProps, nextProps.params: ", nextProps.params);
      this.setState({
        organization_we_vote_id: nextProps.params.organization_we_vote_id,
        auto_follow_redirect_happening: false,
      });

      // We refresh the data for all three tabs here on the top level
      OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
      AnalyticsActions.saveActionVoterGuideVisit(nextProps.params.organization_we_vote_id);
      // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
    }
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onEdit () {
    browserHistory.push("/voterguideedit/" + this.state.organization_we_vote_id);
    return <div>{LoadingWheel}</div>;
  }

  _onVoterGuideStoreChange (){
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization_we_vote_id)
    });
  }

  _onOrganizationStoreChange (){
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization_we_vote_id)
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()
    });
  }

  render () {
    if (!this.state.organization || !this.state.voter || this.state.auto_follow_redirect_happening){
      return <div>{LoadingWheel}</div>;
    }
    const { organization_id } = this.state.organization;
    let is_voter_owner = this.state.organization.organization_we_vote_id !== undefined &&
      this.state.organization.organization_we_vote_id === this.state.voter.linked_organization_we_vote_id;

    if (!organization_id) {
      var floatRight = {
        float: "right"
      };
      return <div className="card">
          <div className="card-main">
            <h4 className="h4">Organization not Found</h4>
          </div>
          <div style={{margin: 10}}>
            <span style={floatRight}>
              <Link to="/opinions"><Button bsStyle="primary">Next &#x21AC;</Button></Link>
            </span>
            <p>Find voter guides you can follow.
              These voter guides have been created by nonprofits, public figures, your friends, and more. (OrganizationVoterGuide)</p>
          </div>
        </div>;
    }

    return <div>
      <div className="headroom-wrapper">
        <div ref="pageHeader" className="page-header__container headroom">
          <HeaderBar voter={this.state.voter} />
        </div>
      </div>
      <div className="page-content-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              { this.state.organization.organization_banner_url !== "" ?
                <div className="organization-banner-image-div">
                  <img className="organization-banner-image-img" src={this.state.organization.organization_banner_url} />
                </div> :
                <div className="organization-banner-image-non-twitter-users" />
              }
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 hidden-xs" >
              <div className="card">
                <div className="card-main">
                  <OrganizationVoterGuideCard organization={this.state.organization} is_voter_owner={is_voter_owner} />
                </div>
                <br />
              </div>
            </div>

            <div className="col-md-12 visible-xs">
              <div className="card">
                <div className="card-main">
                  { is_voter_owner ?
                    <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onEdit}>
                      <span>Edit</span>
                    </Button> :
                    <FollowToggle we_vote_id={this.state.organization.organization_we_vote_id} />
                  }
                  <OrganizationCard organization={this.state.organization} />
                </div>
              </div>
            </div>
            <OrganizationVoterGuideTabs organization={this.state.organization} />
          </div>
        </div>
      </div>
    </div>;
  }
}
