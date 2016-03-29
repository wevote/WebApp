import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import StarAction from "../../components/StarAction";
import ItemActionBar from "../../components/ItemActionbar";
import ItemSupportOpposeCounts from "../../components/ItemSupportOpposeCounts";

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url: PropTypes.string.isRequired,
    party: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
  };

  render () {
    let {
      ballot_item_display_name,
      candidate_photo_url,
      party,
      we_vote_id,
    } = this.props;

    return <section className="candidate list-group-item">
        <StarAction
          we_vote_id={we_vote_id} type="CANDIDATE"/>

        <Link className="linkLight"
              to={"/candidate/" + we_vote_id }
              onlyActiveOnIndex={false}>
          {/* Note: We want a click anywhere in this div to take you to the candidate page */}
          <div className="row" style={{ paddingBottom: "2rem" }}>
            <div
              className="col-xs-4"
              style={candidate_photo_url ? {} : {height: "95px"}}>

              {/* adding inline style to img until Rob can style... */}
              {
                candidate_photo_url ?

                  <img
                    className="img-circle"
                    style={{display: "block", paddingTop: "10px", width: "100px"}}
                    src={candidate_photo_url}
                    alt="candidate-photo"/> :

                <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
              }

            </div>
            <div className="col-xs-8">
              <h4 className="bufferNone">
                { ballot_item_display_name } <span className="link-text-to-more-info">(more)</span>
                {
                  party ?
                    <span className="link-text-candidate-party"><br />{ party }</span> :
                    <span></span>
                }
              </h4>
              <span className="link-text-to-opinions">Opinions you follow: </span>
              <ItemSupportOpposeCounts we_vote_id={we_vote_id} type="CANDIDATE" />
            </div>
          </div>
          </Link>
        <ItemActionBar we_vote_id={we_vote_id} type="CANDIDATE"/>
      </section>;
  }
}
