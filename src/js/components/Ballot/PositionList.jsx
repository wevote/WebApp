import React, { Component, PropTypes } from "react";
import PositionItem from "./PositionItem";

export default class PositionList extends Component {
  static propTypes = {
    position_list: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (<div><ul className="list-group">
      { this.props.position_list.map( item =>
          <PositionItem key={item.position_we_vote_id}
                        candidate_display_name={this.props.candidate_display_name}
                        {...item}
          /> )
      }
    </ul></div>);
  }
}
