import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import { Button } from "react-bootstrap";
import VoterGuideEditActivityReports from "../../components/VoterGuide/VoterGuideEditActivityReports";
import VoterGuideEditAddPositions from "../../components/VoterGuide/VoterGuideEditAddPositions";
import VoterGuideEditIndex from "../../components/VoterGuide/VoterGuideEditIndex";
import VoterGuideEditIssues from "../../components/VoterGuide/VoterGuideEditIssues";
import VoterGuideEditName from "../../components/VoterGuide/VoterGuideEditName";
import FollowToggle from "../../components/Widgets/FollowToggle";
import HeaderBar from "../../components/Navigation/HeaderBar";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationVoterGuideCard from "../../components/VoterGuide/OrganizationVoterGuideCard";
import VoterStore from "../../stores/VoterStore";

export default class OrganizationVoterGuideEdit extends Component {
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
    };
  }

  componentDidMount (){
    // console.log("OrganizationVoterGuideEdit, componentDidMount, this.props.params.organization_we_vote_id: ", this.props.params.organization_we_vote_id);
    // console.log("this.props.params.edit_mode: ", this.props.params.edit_mode);
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    let is_voter_owner = this.props.params.organization_we_vote_id !== undefined &&
      this.props.params.organization_we_vote_id === VoterStore.getVoter().linked_organization_we_vote_id;
    // console.log("is_voter_owner: ", is_voter_owner);
    if (is_voter_owner) {
      OrganizationActions.organizationRetrieve(this.props.params.organization_we_vote_id);
      // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
      this.setState({
        organization_we_vote_id: this.props.params.organization_we_vote_id,
        voter: VoterStore.getVoter(),
      });
    } else {
      const voter_guide_redirect_link = "/voterguide/" + this.props.params.organization_we_vote_id;
      browserHistory.push(voter_guide_redirect_link);
    }
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    // console.log("OrganizationVoterGuide, componentWillReceiveProps, nextProps.params: ", nextProps.params);
    // console.log("this.props.params.edit_mode: ", this.props.params.edit_mode);
    let is_voter_owner = nextProps.params.organization_we_vote_id !== undefined &&
      nextProps.params.organization_we_vote_id === VoterStore.getVoter().linked_organization_we_vote_id;
    // console.log("is_voter_owner: ", is_voter_owner);
    if (is_voter_owner) {
      this.setState({organization_we_vote_id: nextProps.params.organization_we_vote_id});

      // We refresh the data for all three tabs here on the top level
      OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
      // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
    } else {
      const voter_guide_redirect_link = "/voterguide/" + nextProps.params.organization_we_vote_id;
      browserHistory.push(voter_guide_redirect_link);
    }
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onDoneButton () {
    browserHistory.push("/voterguideedit/" + this.props.organization_we_vote_id);
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()
    });
  }

  _onOrganizationStoreChange (){
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization_we_vote_id)
    });
  }

  render () {
    if (!this.state.organization.organization_we_vote_id || !this.state.voter){
      return <div>{LoadingWheel}</div>;
    }

    let is_voter_owner = this.state.organization.organization_we_vote_id !== undefined &&
      this.state.organization.organization_we_vote_id === this.state.voter.linked_organization_we_vote_id;

    if (!is_voter_owner) {
      return <div>{LoadingWheel}</div>;
    }

    if (!this.state.organization) {
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

    let edit_component_to_display = null;
    let edit_mode = this.props.params.edit_mode;
    switch (edit_mode) {
      case "activity":
        edit_component_to_display = <VoterGuideEditActivityReports
            params={this.props.params}
            organization_we_vote_id={this.state.organization_we_vote_id} />;
        break;
      case "add":
        edit_component_to_display = <VoterGuideEditAddPositions
            params={this.props.params}
            organization_we_vote_id={this.state.organization_we_vote_id} />;
        break;
      case "issues":
        edit_component_to_display = <VoterGuideEditIssues
            params={this.props.params}
            organization_we_vote_id={this.state.organization_we_vote_id} />;
        break;
      case "name":
        edit_component_to_display = <VoterGuideEditName
            params={this.props.params}
            organization_we_vote_id={this.state.organization_we_vote_id} />;
        break;
      default :
        edit_component_to_display = null;
        break;
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
                  <OrganizationVoterGuideCard
                    organization={this.state.organization}
                    is_voter_owner={false}
                  />
                </div>
                <br />
              </div>
            </div>

            <div className="col-md-12 visible-xs">
              <div className="card">
                <div className="card-main">
                  <FollowToggle we_vote_id={this.state.organization.organization_we_vote_id} />
                  <OrganizationCard organization={this.state.organization} />
                </div>
              </div>
            </div>
              { this.props.params.edit_mode ?
                edit_component_to_display :
                <VoterGuideEditIndex
                  params={this.props.params}
                  location={this.props.location}
                  organization_we_vote_id={this.state.organization_we_vote_id} />
              }
          </div>
        </div>
      </div>
    </div>;
  }
}
