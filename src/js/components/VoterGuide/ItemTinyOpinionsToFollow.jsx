import React, { Component, PropTypes } from "react";
import GuideActions from "../../actions/GuideActions";
import OrganizationTinyDisplay from "./OrganizationTinyDisplay";

export default class ItemTinyOpinionsToFollow extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool
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
    if (this.state.organizations_to_follow === undefined) {
      return null;
    }

    const orgs = this.state.organizations_to_follow.map( (org) => {

      return <OrganizationTinyDisplay key={org.organization_we_vote_id} {...org} />;
    });

    return <div className="guidelist card-child__list-group">
          {orgs}
      </div>;
  }

}
