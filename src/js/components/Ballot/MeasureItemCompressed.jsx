import React, { Component } from "react";
import PropTypes from "prop-types";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import { historyPush } from "../../utils/cordovaUtils";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import { renderLog } from "../../utils/logging";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";
import VoterGuideStore from "../../stores/VoterGuideStore";


export default class MeasureItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    currentBallotIdInUrl: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    measure_url: PropTypes.string,
    organization: PropTypes.object,
    position_list: PropTypes.array,
    showPositionStatementActionBar: PropTypes.bool,
    toggleMeasureModal: PropTypes.func,
    we_vote_id: PropTypes.string.isRequired,
    urlWithoutHash: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      maximum_organization_display: 4,
      organization: {},
      showModal: false,
      transitioning: false,
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({
      supportProps: SupportStore.get(this.props.we_vote_id)
    });
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps){
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onOrganizationStoreChange () {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
      transitioning: false,
    });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return "/measure/" + oneMeasureWeVoteId + "/btvg/" + this.state.organization.organization_we_vote_id;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return "/measure/" + oneMeasureWeVoteId + "/b/btdb/";
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    let measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  render () {
    renderLog(__filename);
    let { ballot_item_display_name, measure_subtitle, measure_text, we_vote_id } = this.props;
    let measure_we_vote_id = we_vote_id;
    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    // let measureGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measure_we_vote_id);

    // let measure_for_modal = {
    //   ballot_item_display_name: ballot_item_display_name,
    //   voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
    //   kind_of_ballot_item: this.props.kind_of_ballot_item,
    //   link_to_ballot_item_page: this.props.link_to_ballot_item_page,
    //   measure_subtitle: measure_subtitle,
    //   measure_text: this.props.measure_text,
    //   measure_url: this.props.measure_url,
    //   we_vote_id: measure_we_vote_id,
    //   position_list: this.props.position_list,
    // };

    let measureSupportStore = SupportStore.get(measure_we_vote_id);
    let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(measure_we_vote_id);
    let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(measure_we_vote_id);

    return <div className="card-main measure-card">
      <a name={measure_we_vote_id} />
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <div className="card-main__ballot-name-group">
              <div className="card-main__ballot-name-item card-main__ballot-name">
                <a onClick={() => this.goToMeasureLink(measure_we_vote_id)}>
                  {ballot_item_display_name}
                </a>
              </div>
              <div className="card-main__ballot-name-item">
                <a onClick={() => this.goToMeasureLink(measure_we_vote_id)}>
                  <span className="card-main__ballot-read-more-link hidden-xs">learn&nbsp;more</span>
                </a>
              </div>
            </div> :
            ballot_item_display_name
          }
        </h2>
        <BookmarkToggle we_vote_id={measure_we_vote_id} type="MEASURE" />
        {/* Measure information */}
        <div className={ this.props.link_to_ballot_item_page ? "u-cursor--pointer" : null }
             onClick={ this.props.link_to_ballot_item_page ? () => this.goToMeasureLink(measure_we_vote_id) : null }>
          {measure_subtitle}
        </div>
        { measure_text ? <div className="measure_text">{measure_text}</div> : null }

        {/* Positions in Your Network and Possible Voter Guides to Follow */}
        <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
          <ItemSupportOpposeRaccoon ballotItemWeVoteId={measure_we_vote_id}
                                    ballot_item_display_name={ballot_item_display_name}
                                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                    maximumOrganizationDisplay={this.state.maximum_organization_display}
                                    organizationsToFollowSupport={organizationsToFollowSupport}
                                    organizationsToFollowOppose={organizationsToFollowOppose}
                                    showPositionStatementActionBar={this.props.showPositionStatementActionBar}
                                    supportProps={measureSupportStore}
                                    urlWithoutHash={this.props.urlWithoutHash}
                                    we_vote_id={this.props.we_vote_id}/>
        </div>
      </div> {/* END .card-main__content */}
    </div>;
  }
}
