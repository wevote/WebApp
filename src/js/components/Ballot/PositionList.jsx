import React, { Component, PropTypes } from "react";
import PositionItem from "./PositionItem";

export default class PositionList extends Component {
  static propTypes = {
    position_list: PropTypes.array.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      position_list: this.props.position_list,
    };
  }

  componentWillReceiveProps (nextProps){
    //if (nextProps.instantRefreshOn ) {
    // NOTE: We might want to turn this off because we don't want the organization to disappear from the
    // "More opinions" list when clicked
    this.setState({
      position_list: nextProps.position_list,
    });
    //}
  }

  render () {
    return <div><ul className="card-child__list-group">
      { this.state.position_list.map( item =>
          <PositionItem key={item.position_we_vote_id}
                        ballot_item_display_name={this.props.ballot_item_display_name}
                        position={item}
          /> )
      }
    </ul></div>;
  }
}
