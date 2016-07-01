import React, { Component, PropTypes } from "react";
import FollowToggle from "../../components/Widgets/FollowToggle";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import LoadingWheel from "../../components/LoadingWheel";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

export default class GuidePositionList extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount (){
    let we_vote_id = this.props.params.we_vote_id;
    this.listener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    OrganizationActions.retrieve(we_vote_id);
    OrganizationActions.retrievePositions(we_vote_id);
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  _onOrganizationStoreChange (){
    this.setState({ organization: OrganizationStore.get(this.props.params.we_vote_id)});
  }

  render () {
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    const {organization_twitter_handle, position_list} = this.state.organization;

    return <span>
        <div className="card__container">
          <div className="card__main">
            <FollowToggle we_vote_id={this.props.params.we_vote_id} />
            <OrganizationCard organization={this.state.organization} />
          </div>
          <ul className="bs-list-group">
            {position_list ?
              position_list.map( item => { return <OrganizationPositionItem key={item.position_we_vote_id} position={item}/>; }) :
              <div>{LoadingWheel}</div>
            }
          </ul>
        </div>
        <br />
        <ThisIsMeAction twitter_handle_being_viewed={organization_twitter_handle}
                        name_being_viewed={this.state.organization.organization_name}
                        kind_of_owner="ORGANIZATION" />
        <br />
      </span>;
  }
}
