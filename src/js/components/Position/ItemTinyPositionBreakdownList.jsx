import React, { Component, PropTypes } from "react";
import GuideActions from "../../actions/GuideActions";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";

export default class ItemTinyPositionBreakdownList extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    organizationsToFollow: PropTypes.object,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
    supportProps: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: ""
    };
  }

  componentDidMount () {
    this.setState({
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId
    });
  }

  componentWillReceiveProps (nextProps){
    console.log("ItemTinyOpinionsToFollow, componentWillReceiveProps, nextProps.organizationsToFollow:", nextProps.organizationsToFollow);
    //if (nextProps.instantRefreshOn ) {
      // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
      this.setState({
        organizations_to_follow: nextProps.organizationsToFollow,
        ballot_item_we_vote_id: nextProps.ballotItemWeVoteId
      });
    //}
  }

  handleIgnore (id) {
    GuideActions.organizationFollowIgnore(id);
    this.setState({ organizations_to_follow: this.state.organizations_to_follow.filter( (org) => { return org.organization_we_vote_id !== id;})});
  }

  render () {
    console.log("ItemTinyOpinionsToFollow, render");
    if (this.state.organizations_to_follow === undefined) {
      return null;
    }

    const MAXIMUM_ORGANIZATION_DISPLAY = 4;
    let local_counter = 0;
    let orgs_not_shown_count = 0;
    if (this.state.organizations_to_follow && this.state.organizations_to_follow.length > MAXIMUM_ORGANIZATION_DISPLAY) {
      orgs_not_shown_count = this.state.organizations_to_follow.length - MAXIMUM_ORGANIZATION_DISPLAY;
    }
    const orgs = this.state.organizations_to_follow.map( (org) => {
      local_counter++;
      if (local_counter > MAXIMUM_ORGANIZATION_DISPLAY) {
        if (local_counter === MAXIMUM_ORGANIZATION_DISPLAY + 1) {
          // If here we want to show how many organizations there are to follow
          return <span key={org.organization_we_vote_id}> +{orgs_not_shown_count}</span>;
        } else {
          return "";
        }
      } else {
        return <OrganizationTinyDisplay key={org.organization_we_vote_id} {...org} />;
      }
    });

    return <span className="guidelist card-child__list-group">
          {orgs}
      </span>;
  }

}
