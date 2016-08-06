import React, { Component, PropTypes } from "react";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import PositionItem from "./PositionItem";

export default class PositionList extends Component {
  static propTypes = {
    position_list: PropTypes.array.isRequired,
    candidate_display_name: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    // this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    //
    // var {we_vote_id} = this.props.position_list;
    //
    // OrganizationActions.retrieve(we_vote_id);
    // // Positions for this organization, for this voter / election
    // OrganizationActions.retrievePositions(we_vote_id, true);
    // // Positions for this organization, NOT including for this voter / election
    // OrganizationActions.retrievePositions(we_vote_id, false, true);
  }

  render () {
    //                  organization={organization}
    return <div><ul className="bs-list-group">
      { this.props.position_list.map( item =>
          <PositionItem key={item.position_we_vote_id}
                        candidate_display_name={this.props.candidate_display_name}
                        position={item}
          /> )
      }
    </ul></div>;
  }
}
