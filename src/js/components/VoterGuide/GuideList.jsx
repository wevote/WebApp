import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import CandidateStore from "../../stores/CandidateStore";
import FollowToggle from "../Widgets/FollowToggle";
// import FilterBase from "../Filter/FilterBase";
// import VoterGuideOrganizationFilter from "../Filter/VoterGuideOrganizationFilter";
import MeasureStore from "../../stores/MeasureStore";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import { stringContains } from "../../utils/textFormat";
import VoterGuideDisplayForList from "./VoterGuideDisplayForList";
import { showToastSuccess } from "../../utils/showToast";
import { renderLog } from "../../utils/logging";

/*
const groupedFilters = [
  {
    filterName: "support",
    iconName: "thumbs-up",
  },
  {
    filterName: "oppose",
    iconName: "thumbs-down",
  },
  {
    filterName: "information",
    iconName: "information-circle",
  },
];

const islandFilters = [
  {
    filterName: "comment",
    iconName: "paper",
    filterDisplayName: "Has Comment",
  },
];
*/
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
      // organizationsReordered: false,
      organizationsToFollow: [],
      ballotItemWeVoteId: "",
      organizationsWithPositions: [],
    };
  }

  componentDidMount () {
    // console.log("GuideList componentDidMount");
    const organizationsToFollow = this.sortOrganizations(this.props.organizationsToFollow, this.state.ballotItemWeVoteId);
    this.setState({
      organizationsToFollow,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    }, () => {
      const orgsWithPositions = this.getOrganizationsWithPositions();
      this.setState({
        organizationsWithPositions: orgsWithPositions,
        filteredOrganizationsWithPositions: orgsWithPositions,
      });
      console.log(orgsWithPositions);
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("GuideList componentWillReceiveProps");
    // Do not update the state if the organizationsToFollow list looks the same, and the ballotItemWeVoteId hasn't changed
    const organizationsToFollow = this.sortOrganizations(nextProps.organizationsToFollow, this.state.ballotItemWeVoteId);
    this.setState({
      organizationsToFollow,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
    }, () => {
      const orgsWithPositions = this.getOrganizationsWithPositions();
      this.setState({
        organizationsWithPositions: orgsWithPositions,
      });
      if (!this.state.filteredOrganizationsWithPositions.length) {
        this.setState({ filteredOrganizationsWithPositions: orgsWithPositions });
      }
    });
  }

  handleFilteredOrgsChange = filteredOrgs => this.setState({ filteredOrganizationsWithPositions: filteredOrgs });

  getOrganizationsWithPositions = () => this.state.organizationsToFollow.map((organization) => {
    let organizationPositionForThisBallotItem;
    if (stringContains("cand", this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
      // console.log({ ...organizationPositionForThisBallotItem, ...organization });
    } else if (stringContains("meas", this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
    }
    return { ...organizationPositionForThisBallotItem, ...organization };
  });

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
        /*
        this.setState({
          organizationsReordered: true,
        });
        */
      }
      return sortedOrganizations;
    }
    return organizationsList;
  }

  handleIgnore (id) {
    const { organizationsToFollow } = this.state;
    OrganizationActions.organizationFollowIgnore(id);
    this.setState({
      organizationsToFollow: organizationsToFollow.filter(
        org => org.organization_we_vote_id !== id,
      ),
    });
    showToastSuccess("Added to ignore list.");
  }

  render () {
    // console.log("GuideList render");
    renderLog(__filename);
    if (this.state.filteredOrganizationsWithPositions === undefined) {
      // console.log("GuideList this.state.organizations_to_follow === undefined");
      return null;
    }

    // console.log("GuideList organizationsToFollow: ", this.state.organizationsToFollow);

    if (!this.state.filteredOrganizationsWithPositions) {
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
        {
          /*
          <FilterBase
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={this.state.organizationsWithPositions}
            onFilteredItemsChange={this.handleFilteredOrgsChange}
          >
            <VoterGuideOrganizationFilter />
          </FilterBase>
          */
        }
        {this.state.filteredOrganizationsWithPositions.map(organization => (
          <VoterGuideDisplayForList
              key={organization.organization_we_vote_id}
              {...organization}
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
        ))
        }
      </div>
    );
  }
}
