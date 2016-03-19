import React, { Component, PropTypes } from "react";
import ItemActionBar from "../../components/ItemActionbar";
import ItemSupportOpposeCounts from "../../components/ItemSupportOpposeCounts";

export default class Measure extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired
  };

  render () {
    var type = this.props.kind_of_ballot_item;
    var we_vote_id = this.props.we_vote_id;
    return <div>
              <div className="row" style={{ paddingBottom: "10px" }}>
                  <div className="col-xs-6"></div>
                  <div className="col-xs-6">
                    <span className="link-text-to-opinions">Opinions you follow: </span>
                      <ItemSupportOpposeCounts we_vote_id={we_vote_id} type={type} />
                  </div>
              </div>

              <div className="row" style={{ paddingBottom: "10px" }}>
                  <ItemActionBar we_vote_id={we_vote_id} type={type}/>
              </div>
          </div>;
  }
}
