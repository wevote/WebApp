import React, { Component, PropTypes } from "react";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";

export default class Measure extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired
  };

  render () {
    var type = this.props.kind_of_ballot_item;
    var we_vote_id = this.props.we_vote_id;
    var measure_subtitle = this.props.measure_subtitle;
    return <div>
              <div>{measure_subtitle}</div>
              <div className="bs-row" style={{ paddingBottom: "2rem" }}>
                  <div className="col-xs-12">
                      <ItemSupportOpposeCounts we_vote_id={we_vote_id} type={type} />
                  </div>
              </div>

              <div className="bs-row" style={{ paddingBottom: "2rem" }}>
                  <ItemActionBar we_vote_id={we_vote_id} type={type}/>
              </div>
          </div>;
  }
}
