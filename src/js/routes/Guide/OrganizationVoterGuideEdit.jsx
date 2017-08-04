  import React, { Component, PropTypes } from "react";
  import { Link, browserHistory } from "react-router";
  import { Button } from "react-bootstrap";
  import FollowToggle from "../../components/Widgets/FollowToggle";
  import HeaderBar from "../../components/Navigation/HeaderBar";
  import OrganizationActions from "../../actions/OrganizationActions";
  import OrganizationVoterGuideCard from "../../components/VoterGuide/OrganizationVoterGuideCard";
  import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
  import OrganizationStore from "../../stores/OrganizationStore";
  import LoadingWheel from "../../components/LoadingWheel";
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
      this.state = {
        organization: OrganizationStore.get(this.state.organization_we_vote_id),
        organization_we_vote_id: this.props.params.organization_we_vote_id,
        voter: VoterStore.getVoter(),
      };
      // console.log("OrganizationVoterGuide, componentDidMount, this.props.params.organization_we_vote_id: ", this.props.params.organization_we_vote_id);
      this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
      this._onOrganizationStoreChange();
      this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
      OrganizationActions.organizationRetrieve(this.props.params.organization_we_vote_id);
      // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
    }

    componentWillReceiveProps (nextProps) {
      // When a new organization is passed in, update this component to show the new data
      // console.log("OrganizationVoterGuide, componentWillReceiveProps, nextProps.params: ", nextProps.params);
      this.setState({organization_we_vote_id: nextProps.params.organization_we_vote_id});

      // We refresh the data for all three tabs here on the top level
      OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
      // retrievePositions is called in js/components/VoterGuide/VoterGuidePositions
    }

    componentWillUnmount (){
      this.organizationStoreListener.remove();
      this.voterStoreListener.remove();
    }

    _onVoterStoreChange () {
      this.setState({
        voter: VoterStore.getVoter()
      });
    }

    _onOrganizationStoreChange (){
      this.setState({
        organization: OrganizationStore.get(this.state.organization_we_vote_id)
      });
    }

    render () {
      if (!this.state.organization || !this.state.voter){
        return <div>{LoadingWheel}</div>;
      }

      let is_voter_owner = this.state.organization.public_figure_we_vote_id !== undefined &&
        this.state.organization.public_figure_we_vote_id === this.state.voter.voter_we_vote_id;
      let edit_mode = this.props.params.edit_mode;
      const { organization_id } = this.state.organization;

      if (!is_voter_owner) {
        const voter_guide_redirect_link = "/voterguide/" + this.state.organization_we_vote_id;
        browserHistory.push(voter_guide_redirect_link);
        return <div>{LoadingWheel}</div>;
      }

      const edit_links_to_display = <div>
            <h1>Edit Your Voter Guide</h1>
            <br />
            <Link to={this.props.location.pathname + "/name"}>
              <h3 className="card-main__display-name">Edit Name and Description</h3>
            </Link>
            <br />
            <Link to={this.props.location.pathname + "/add"}>
              <h3 className="card-main__display-name">Add Items to Voter Guide</h3>
            </Link>
            <br />
            <Link to={this.props.location.pathname + "/issues"}>
              <h3 className="card-main__display-name">Edit Issues</h3>
            </Link>
          </div>;

      let edit_component_to_display = null;
      switch (edit_mode) {
        case "name":
          edit_component_to_display = <h1 className="card-main__display-name">Edit Names</h1>;
          break;
        case "add":
          edit_component_to_display = <h1 className="card-main__display-name">Add Items to voter guide</h1>;
          break;
        case "issues":
          edit_component_to_display = <h1 className="card-main__display-name">Edit Issues</h1>;
          break;
        default :
          edit_component_to_display = null;
          break;
      }

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
                  <img src={this.state.organization.organization_banner_url} /> :
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
              <div className="col-md-8">
                { this.props.params.edit_mode ?
                  edit_component_to_display :
                  edit_links_to_display
                }
              </div>
            </div>
          </div>
        </div>
      </div>;
    }
  }
