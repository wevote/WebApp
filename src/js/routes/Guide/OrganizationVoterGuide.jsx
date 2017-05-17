import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import { capitalizeString } from "../../utils/textFormat";
import FollowToggle from "../../components/Widgets/FollowToggle";
import HeaderBar from "../../components/Navigation/HeaderBar";
import Helmet from "react-helmet";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationVoterGuideCard from "../../components/VoterGuide/OrganizationVoterGuideCard";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";
import OrganizationVoterGuideTabs from "./OrganizationVoterGuideTabs";

export default class OrganizationVoterGuide extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { organization_we_vote_id: this.props.params.organization_we_vote_id };
  }

  componentDidMount (){
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    var { organization_we_vote_id } = this.state;

    OrganizationActions.organizationRetrieve(organization_we_vote_id);
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({organization_we_vote_id: nextProps.params.organization_we_vote_id});

    OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()});
   }

  _onOrganizationStoreChange (){
    var { organization_we_vote_id } = this.state;
    this.setState({ organization: OrganizationStore.get(organization_we_vote_id)});
  }

  render () {

    if (!this.state.organization || !this.state.voter){
      return <div>{LoadingWheel}</div>;
    }
    const { organization_id } = this.state.organization;

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
            <p>Find voter guides you can follow. These voter guides have been created by nonprofits, public figures, your friends, and more.</p>
          </div>
        </div>;
    }

    var { organization_we_vote_id } = this.state;
    let organization_name = capitalizeString(this.state.organization.organization_name);
    let title_text = organization_name + " - We Vote";
    let description_text = "See endorsements and opinions from " + organization_name + " for the November election";

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
              <img src={this.state.organization.organization_banner_url} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4" >
              <div className="card">
                  <div className="card-main">
                    <OrganizationVoterGuideCard organization={this.state.organization} />
                  </div>
                </div>
             </div>
            <div className="col-md-8">
              <span>
              <Helmet title={title_text}
                      meta={[{"name": "description", "content": description_text}]}
                      />
                <div className="card">
                  <div className="card-main">
                    <FollowToggle we_vote_id={organization_we_vote_id} />
                    <OrganizationCard organization={this.state.organization} />
                  </div>
                </div>
                <br />
              </span>
              <OrganizationVoterGuideTabs />

            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 hidden-xs sidebar-menu">
          {/* Depending on which page we are on, show a different left area. */}
        </div>
      </div>

    </div>;
  }
}
