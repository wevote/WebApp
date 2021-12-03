import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import OfficeActions from '../../actions/OfficeActions';
import LoadingWheel from '../../components/LoadingWheel';
import OrganizationVoterGuideCandidateList from '../../components/VoterGuide/OrganizationVoterGuideCandidateList';
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import { capitalizeString } from '../../utils/textFormat';

// This is based on routes/Ballot/Office
export default class OrganizationVoterGuideOffice extends Component {
  constructor (props) {
    super(props);
    this.state = {
      office: {},
      office_we_vote_id: '',
      organization_we_vote_id: '',
    };
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    this.officeStoreListener = OfficeStore.addListener(this.onOfficeStoreChange.bind(this));
    const office = OfficeStore.getOffice(params.office_we_vote_id);
    if (!office || !office.ballot_item_display_name) {
      OfficeActions.officeRetrieve(params.office_we_vote_id);
    } else {
      this.setState({ office });
    }
    this.setState({
      office_we_vote_id: params.office_we_vote_id,
      organization_we_vote_id: params.organization_we_vote_id,
    });

    AnalyticsActions.saveActionOffice(VoterStore.electionId(), params.office_we_vote_id);
    // console.log("OrganizationVoterGuideOffice, organization_we_vote_id: ", this.props.params.organization_we_vote_id);
  }

  // eslint-disable-next-line camelcase, react/sort-comp, react/prop-types
  UNSAFE_componentWillReceiveProps (nextProps) {
    // When a new office is passed in, update this component to show the new data
    const { match: { params: nextParams } } = nextProps;
    const office = OfficeStore.getOffice(nextParams.office_we_vote_id);
    if (!office || !office.ballot_item_display_name) {
      this.setState({ office_we_vote_id: nextParams.office_we_vote_id });
      OfficeActions.officeRetrieve(nextParams.office_we_vote_id);
    } else {
      this.setState({ office, office_we_vote_id: nextParams.office_we_vote_id });
    }
  }
  // eslint-enable camelcase,react/sort-comp,react/prop-types

  componentWillUnmount () {
    this.officeStoreListener.remove();
  }

  onOfficeStoreChange () {
    const { office_we_vote_id: officeWeVoteId } = this.state;
    const office = OfficeStore.getOffice(officeWeVoteId);
    this.setState({ office });
  }

  render () {
    renderLog('OrganizationVoterGuideOffice');  // Set LOG_RENDER_EVENTS to log all renders
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
          meta={[{ name: 'description', content: descriptionText }]}
        />
        { office.candidate_list ? (
          <div>
            <OrganizationVoterGuideCandidateList
              contest_office_name={office.ballot_item_display_name}
              organization_we_vote_id={this.state.organization_we_vote_id}
            >
              {office.candidate_list}
            </OrganizationVoterGuideCandidateList>
          </div>
        ) :
          <span>Loading candidates...</span>}
      </div>
    );
  }
}
OrganizationVoterGuideOffice.propTypes = {
  match: PropTypes.object.isRequired,
};
