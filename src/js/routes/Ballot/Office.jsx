import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import CandidateList from "../../components/Ballot/CandidateList";
import { capitalizeString } from "../../utils/textFormat";
import AnalyticsActions from "../../actions/AnalyticsActions";
import IssueActions from "../../actions/IssueActions";
import IssueStore from "../../stores/IssueStore";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import OfficeActions from "../../actions/OfficeActions";
import OfficeItem from "../../components/Ballot/OfficeItem";
import OfficeStore from "../../stores/OfficeStore";
import SearchAllActions from "../../actions/SearchAllActions";
import VoterStore from "../../stores/VoterStore";

// This is related to routes/VoterGuide/OrganizationVoterGuideOffice
export default class Office extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      office: {},
      office_we_vote_id: "",
    };
  }

  componentDidMount () {
    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieveForElection(VoterStore.electionId());
    }

    this.officeStoreListener = OfficeStore.addListener(this._onOfficeStoreChange.bind(this));
    const office = OfficeStore.getOffice(this.props.params.office_we_vote_id);

    if (!office || !office.ballot_item_display_name) {
      OfficeActions.officeRetrieve(this.props.params.office_we_vote_id);
    } else {
      this.setState({ office });
    }

    this.setState({
      office_we_vote_id: this.props.params.office_we_vote_id,
    });

    AnalyticsActions.saveActionOffice(VoterStore.electionId(), this.props.params.office_we_vote_id);
    SearchAllActions.exitSearch();
  }

  componentWillReceiveProps (nextProps) {
    // When a new office is passed in, update this component to show the new data
    const office = OfficeStore.getOffice(nextProps.params.office_we_vote_id);

    if (!office || !office.ballot_item_display_name) {
      this.setState({ office_we_vote_id: nextProps.params.office_we_vote_id });
      OfficeActions.officeRetrieve(nextProps.params.office_we_vote_id);
    } else {
      this.setState({ office, office_we_vote_id: nextProps.params.office_we_vote_id });
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
    const office = OfficeStore.getOffice(this.state.office_we_vote_id);
    this.setState({ office });
  }

  render () {
    renderLog(__filename);
    const { office } = this.state;

    if (!office || !office.ballot_item_display_name) {
      // TODO DALE If the office_we_vote_id is not valid, we need to update this with a notice
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }

    const officeName = capitalizeString(office.ballot_item_display_name);
    const titleText = `${officeName} - We Vote`;
    const descriptionText = `Choose who you support for ${officeName}in the November Election`;

    return (
      <div>
        <Helmet
          title={titleText}
          meta={[{ name: "description", content: descriptionText }]}
        />
        <OfficeItem
          weVoteId={office.we_vote_id}
          ballotItemDisplayName={office.ballot_item_display_name}
        />
        { office.candidate_list ? (
          <div>
            <CandidateList
              children={office.candidate_list}
              contest_office_name={office.ballot_item_display_name}
            />
          </div>
        ) :
          <span>No candidates found.</span>
        }
      </div>
    );
  }
}
