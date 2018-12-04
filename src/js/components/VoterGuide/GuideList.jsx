import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import CandidateStore from "../../stores/CandidateStore";
import FollowToggle from "../Widgets/FollowToggle";
import MeasureStore from "../../stores/MeasureStore";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import { stringContains } from "../../utils/textFormat";
import VoterGuideDisplayForList from "./VoterGuideDisplayForList";
import { showToastSuccess } from "../../utils/showToast";
import { renderLog } from "../../utils/logging";

export default class GuideList extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    hide_stop_following_button: PropTypes.bool,
    hide_ignore_button: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizationsReordered: false,
      organizationsToFollow: [],
      ballotItemWeVoteId: "",
    };
  }

  componentDidMount () {
    // console.log("GuideList componentDidMount");
    const organizationsToFollow = this.sortOrganizations(this.props.organizationsToFollow, this.state.ballotItemWeVoteId);
    this.setState({
      organizationsToFollow,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("GuideList componentWillReceiveProps");
    // Do not update the state if the organizationsToFollow list looks the same, and the ballotItemWeVoteId hasn't changed
    const organizationsToFollow = this.sortOrganizations(nextProps.organizationsToFollow, this.state.ballotItemWeVoteId);
    this.setState({
      organizationsToFollow,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
    });
  }

  handleIgnore (id) {
    OrganizationActions.organizationFollowIgnore(id);
    this.setState({
      organizationsToFollow: this.state.organizationsToFollow.filter(
        org => org.organization_we_vote_id !== id,
      ),
    });
    showToastSuccess("Added to ignore list.");
  }

  sortOrganizations (organizationsList, ballotItemWeVoteId) {
    // console.log("sortOrganizations: ", organizationsList, "ballotItemWeVoteId: ", ballotItemWeVoteId);
    if (organizationsList && ballotItemWeVoteId) {
      // console.log("Checking for resort");
      const arrayLength = organizationsList.length;
      let organization;
      let organizationPositionForThisBallotItem;
      const sortedOrganizations = [];
      let atLeastOneOrganizationReordered = false;
      for (let i = 0; i < arrayLength; i++) {
        organization = organizationsList[i];
        organizationPositionForThisBallotItem = null;
        if (ballotItemWeVoteId && organization.organization_we_vote_id) {
          if (stringContains("cand", ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          } else if (stringContains("meas", ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          }
        }
        if (organizationPositionForThisBallotItem && organizationPositionForThisBallotItem.statement_text) {
          // console.log("sortOrganizations unshift");
          sortedOrganizations.unshift(organization);
          atLeastOneOrganizationReordered = true;
        } else {
          // console.log("sortOrganizations push");
          sortedOrganizations.push(organization);
        }
      }
      if (atLeastOneOrganizationReordered) {
        this.setState({
          organizationsReordered: true,
        });
      }
      return sortedOrganizations;
    }
    return organizationsList;
  }

  render () {
    // console.log("GuideList render");
    renderLog(__filename);
    if (this.state.organizationsToFollow === undefined) {
      // console.log("GuideList this.state.organizations_to_follow === undefined");
      return null;
    }

    // console.log("GuideList organizationsToFollow: ", this.state.organizationsToFollow);
    let organizationPositionForThisBallotItem = {};

    if (this.state.organizationsToFollow === undefined) {
      return (
        <div className="guidelist card-child__list-group">
          <div className="u-flex u-flex-column u-items-center">
            <div className="u-margin-top--sm u-stack--sm u-no-break">
              No results found.
            </div>
            <OpenExternalWebSite
              url="https://api.wevoteusa.org/vg/create/"
              className="opinions-followed__missing-org-link"
              target="_blank"
              title="Organization Missing?"
              body={<Button className="u-stack--xs">Organization Missing?</Button>}
            />
            <div className="opinions-followed__missing-org-text u-stack--sm u-no-break">
              Don’t see an organization you want to Listen to?
            </div>
          </div>
        </div>
      );
    }
    // Updated version for Bootstrap 4?
    //           <Button variant="outline-secondary" size="sm" onClick={this.handleIgnore.bind(this, organization.organization_we_vote_id)}>
    //             Ignore
    //           </Button>
    return (
      <div className="guidelist card-child__list-group">
        {this.state.organizationsToFollow.map((organization) => {
          organizationPositionForThisBallotItem = {};
          if (!organization.is_support_or_positive_rating && !organization.is_oppose_or_negative_rating && !organization.is_information_only && this.state.ballotItemWeVoteId && organization.organization_we_vote_id) {
            if (stringContains("cand", this.state.ballotItemWeVoteId)) {
              organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
              // Didn't work
              // organizationPositionForThisBallotItem = OrganizationStore.getOrganizationPositionByWeVoteId(organization.organization_we_vote_id, this.state.ballotItemWeVoteId);
            } else if (stringContains("meas", this.state.ballotItemWeVoteId)) {
              organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
            }
          }

          return (
            <VoterGuideDisplayForList
              key={organization.organization_we_vote_id}
              {...organization}
              {...organizationPositionForThisBallotItem}
            >
              <FollowToggle
                organizationWeVoteId={organization.organization_we_vote_id}
                hide_stop_following_button={this.props.hide_stop_following_button}
              />
              { this.props.hide_ignore_button ?
                null : (
                  <button
                    className="btn btn-default btn-sm"
                    onClick={this.handleIgnore.bind(this, organization.organization_we_vote_id)}
                  >
                    Ignore
                  </button>
                )
              }
            </VoterGuideDisplayForList>
          );
        })
        }
      </div>
    );
  }
}
