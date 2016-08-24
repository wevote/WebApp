import React, { Component, PropTypes } from "react";
import PositionItem from "./PositionItem";

export default class PositionList extends Component {
  static propTypes = {
    position_list: PropTypes.array.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <div><ul className="list-group">
      { this.props.position_list.map( item =>
          <PositionItem key={item.position_we_vote_id}
                        ballot_item_display_name={this.props.ballot_item_display_name}
                        position={item}
          /> )
      }
    </ul></div>;
  }
}
