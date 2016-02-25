import React, { Component, PropTypes } from "react";

import OfficeActions from "../../actions/OfficeActions";
import OfficeStore from "../../stores/OfficeStore";

import MeasureActions from "../../actions/MeasureActions";

import Office from "./Office";
import Measure from "./Measure";

export default class OrderedBallot extends Component {

  static propTypes = {
    // RAW ballot data from server
    ballot: PropTypes.array
  };

  constructor (props) {
    super(props);

    this.state = {
      ballot: this.props.ballot
    };

    this.ballot = this.props.ballot.map(this.mapItems);
  }

  mapItems (item) {

    var {
      we_vote_id: id,
      kind_of_ballot_item: type,
      ballot_item_display_name: displayName,
      candidate_list: candidates
    } = item;

    if (type === "OFFICE") {
      OfficeActions.addItemById(id, item);
      return <Office key={id} displayName={displayName} candidates={candidates} _raw={item}/>;

    } else if (type === "MEASURE") {
      MeasureActions.addItemById(id, item);
      return <Measure key={id} displayName={displayName} _raw={item}/>;

    }
  }

  onChange () {
    console.log(OfficeStore.getItems());
  }

  componentDidMount () {
    OfficeStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount () {
    OfficeStore.removeChangeListener(this.onChange.bind(this));
  }

  render () {
    const ballot =
      <div className="ballot">
        {this.ballot}
      </div>;

    return ballot;
  }
}
