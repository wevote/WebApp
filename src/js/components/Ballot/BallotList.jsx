import React, { Component, PropTypes } from "react";

export default class BallotList extends Component {
//  static propTypes = {
//  ballot_list: propTypes.object
//  };

  constructor (props){
    super(props);
    this.state = {};
  }

  render () {
    return <div>
    <ul>{this.props.ballot_list.map((item, index) =>
       <li key={index}>{item.election_description_text}</li>
     )}
   </ul>
    </div>;
  }
}
