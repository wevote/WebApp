import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsWidgetFirstLastName from "../../components/Settings/SettingsWidgetFirstLastName";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";


export default class VoterGuideSettingsGeneral extends Component {
  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    voterGuideName: PropTypes.string,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterGuideName: "",
      voterGuideWeVoteId: ""
    };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("VoterGuideSettingsGeneral componentDidMount this.props.voterGuideWeVoteId:", this.props.voterGuideWeVoteId);
    // Get Voter Guide information
    this.setState({
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
    });
    let voterGuide;
    let voterGuideFound = false;
    if (this.props.voterGuideWeVoteId) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
        voterGuideFound = true;
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
        }
        if (!voterGuideFound) {
          // console.log("VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
          VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        }
      }
    }

    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideSettingsGeneral componentWillReceiveProps nextProps.voterGuideWeVoteId:", nextProps.voterGuideWeVoteId);
    this.setState({
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    let voterGuideFound = false;
    if (nextProps.voterGuideWeVoteId) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
        voterGuideFound = true;
      }
    }
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter: voter });
      let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      // console.log("VoterGuideSettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
        });
        let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.setState({
            organization: organization,
          });
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
        }
        if (!voterGuideFound) {
          // console.log("VoterGuideSettingsDashboard voterGuide NOT FOUND calling VoterGuideActions.voterGuidesRetrieve");
          VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
        }
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange (){
    // console.log("VoterGuideSettingsGeneral onOrganizationStoreChange, org_we_vote_id: ", this.state.linkedOrganizationWeVoteId);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    this.setState({voter: VoterStore.getVoter()});
  }

  onVoterGuideStoreChange (){
    // console.log("VoterGuideSettingsGeneral onVoterGuideStoreChange");
    if (this.state.voterGuideWeVoteId) {
      let voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide: voterGuide,
          voterGuideName: voterGuide.voter_guide_display_name
        });
      }
    }
  }

  render () {
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return <div className="">
      <Helmet title={"Voter Guide Settings - We Vote"} />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main">
          <h3 className="h3">Voter Guide Settings</h3>
            <SettingsWidgetFirstLastName hideFirstLastName />
        </div>
      </div>
    </div>;
  }
}
