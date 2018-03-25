import React, { Component } from "react";
import PropTypes from "prop-types";
import OrganizationVoterGuideCandidateList from "../../components/VoterGuide/OrganizationVoterGuideCandidateList";
import { capitalizeString } from "../../utils/textFormat";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import OfficeActions from "../../actions/OfficeActions";
import OfficeItem from "../../components/Ballot/OfficeItem";
import OfficeStore from "../../stores/OfficeStore";
import SearchAllActions from "../../actions/SearchAllActions";
import VoterStore from "../../stores/VoterStore";

// This is based on routes/Ballot/Office
export default class OrganizationVoterGuideOffice extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      office: {},
      office_we_vote_id: "",
      organization_we_vote_id: "",
    };
  }

  componentDidMount (){
    this.officeStoreListener = OfficeStore.addListener(this._onOfficeStoreChange.bind(this));
    let office = OfficeStore.getOffice(this.props.params.office_we_vote_id);
		if ( !office || !office.ballot_item_display_name ) {
      OfficeActions.officeRetrieve(this.props.params.office_we_vote_id);
    } else {
      this.setState({office: office});
    }
    this.setState({
      office_we_vote_id: this.props.params.office_we_vote_id,
      organization_we_vote_id: this.props.params.organization_we_vote_id,
    });

    AnalyticsActions.saveActionOffice(VoterStore.election_id(), this.props.params.office_we_vote_id);
    SearchAllActions.exitSearch();
    // console.log("OrganizationVoterGuideOffice, organization_we_vote_id: ", this.props.params.organization_we_vote_id);
  }

  componentWillReceiveProps (nextProps) {
    // When a new office is passed in, update this component to show the new data
    let office = OfficeStore.getOffice(nextProps.params.office_we_vote_id);
		if ( !office || !office.ballot_item_display_name ) {
      this.setState({office_we_vote_id: nextProps.params.office_we_vote_id});
      OfficeActions.officeRetrieve(nextProps.params.office_we_vote_id);
    } else {
      this.setState({office: office, office_we_vote_id: nextProps.params.office_we_vote_id});
    }

    // Display the office name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch();
  }

  componentWillUnmount () {
    this.officeStoreListener.remove();
  }

  _onOfficeStoreChange () {
    var office = OfficeStore.getOffice(this.state.office_we_vote_id);
    this.setState({ office: office });
  }

  render () {
    renderLog(__filename);
    var { office } = this.state;

    if (!office || !office.ballot_item_display_name){
      // TODO DALE If the office_we_vote_id is not valid, we need to update this with a notice
      return <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>;
    }
    let office_name = capitalizeString(office.ballot_item_display_name);
    let title_text = office_name + " - We Vote";
    let description_text = "Choose who you support for " + office_name + "in the November Election";

    return <div>
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
      <OfficeItem we_vote_id={office.we_vote_id}
                  kind_of_ballot_item="OFFICE"
                  ballot_item_display_name={office.ballot_item_display_name} />
      { office.candidate_list ?
        <div>
          <OrganizationVoterGuideCandidateList children={office.candidate_list}
                                               contest_office_name={office.ballot_item_display_name}
                                               organization_we_vote_id={this.state.organization_we_vote_id} />
        </div> :
        <span>No candidates found.</span>
      }
    </div>;
  }
}
