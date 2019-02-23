import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import ReadMore from '../Widgets/ReadMore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';
import VoterGuideStore from '../../stores/VoterGuideStore';


export default class MeasureItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    currentBallotIdInUrl: PropTypes.string,
    // kind_of_ballot_item: PropTypes.string.isRequired,
    measure: PropTypes.object,
    measure_subtitle: PropTypes.string,
    // measure_text: PropTypes.string,
    // measure_url: PropTypes.string,
    organization: PropTypes.object,
    // position_list: PropTypes.array,
    showPositionStatementActionBar: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      // ballotItemWeVoteId: '',
      componentDidMountFinished: false,
      organization: {},
      showPositionStatement: false,
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({
      // ballotItemWeVoteId: this.props.we_vote_id,
      componentDidMountFinished: true,
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
    this.setState({
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log("shouldComponentUpdate: this.state.ballotItemDisplayName", this.state.ballotItemDisplayName, ", nextState.ballotItemDisplayName", nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.measure !== nextState.measure) {
      // console.log("shouldComponentUpdate: this.state.measure", this.state.measure, ", nextState.measure", nextState.measure);
      return true;
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log("shouldComponentUpdate: this.props.showPositionStatementActionBar change");
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log("shouldComponentUpdate: this.state.showPositionStatement change");
      return true;
    }
    if (this.state.supportProps !== undefined && nextState.supportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.supportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.supportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organization } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    const { organization } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
    });
  }

  render () {
    // console.log("MeasureItemCompressed render");
    renderLog(__filename);
    let { ballot_item_display_name: ballotItemDisplayName, measure_subtitle: measureSubtitle } = this.props;
    const { we_vote_id: measureWeVoteId } = this.props;
    measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    // let measureGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measureWeVoteId);

    // let measure_for_modal = {
    //   ballotItemDisplayName: ballotItemDisplayName,
    //   voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
    //   kind_of_ballot_item: this.props.kind_of_ballot_item,
    //   measureSubtitle: measureSubtitle,
    //   measure_text: this.props.measure_text,
    //   measure_url: this.props.measure_url,
    //   we_vote_id: measureWeVoteId,
    //   position_list: this.props.position_list,
    // };

    // let measureSupportStore = SupportStore.get(measureWeVoteId);
    // let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(measureWeVoteId);
    // let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(measureWeVoteId);

    // // Voter Support or opposition
    // let isVoterSupport = false;
    // let isVoterOppose = false;
    // let voterStatementText = false;
    // const ballotItemSupportStore = SupportStore.get(this.state.ballotItemWeVoteId);
    // if (ballotItemSupportStore !== undefined) {
    //   // console.log("ballotItemSupportStore: ", ballotItemSupportStore);
    //   isVoterSupport = ballotItemSupportStore.is_support;
    //   isVoterOppose = ballotItemSupportStore.is_oppose;
    //   voterStatementText = ballotItemSupportStore.voter_statement_text;
    // }

    return (
      <div className="card-main measure-card">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            <div className="card-main__ballot-name-group">
              <div className="card-main__ballot-name-item card-main__ballot-name card-main__ballot-name-link">
                <a onClick={() => this.goToMeasureLink(measureWeVoteId)}>
                  {ballotItemDisplayName}
                </a>
              </div>
            </div>
          </h2>
          {/* Measure information */}
          <div
            className="u-cursor--pointer"
            onClick={() => this.goToMeasureLink(measureWeVoteId)}
          >
            {measureSubtitle}
          </div>
          { this.state.measure_text ? (
            <div className="measure_text u-gray-mid">
              <ReadMore
                num_of_lines={3}
                text_to_display={this.state.measure_text}
              />
            </div>
          ) :
            null
        }
        </div>
      </div>
    );
  }
}
