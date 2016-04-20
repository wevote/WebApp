import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import StarAction from "../../components/StarAction";
import ItemActionBar from "../../components/ItemActionbar";
import ItemSupportOpposeCounts from "../../components/ItemSupportOpposeCounts";
import { numberWithCommas } from "../../utils/textFormat";

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url: PropTypes.string.isRequired,
    party: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.integer,
  };

  render () {
    let {
      ballot_item_display_name,
      candidate_photo_url,
      party,
      we_vote_id,
      twitter_description,
      twitter_followers_count,
    } = this.props;

    let displayName = ballot_item_display_name ? ballot_item_display_name : "";
    let twitterDescription = twitter_description ? twitter_description : "";

    return <section className="candidate list-group-item">
        <StarAction
          we_vote_id={we_vote_id} type="CANDIDATE"/>

        <Link className="linkLight"
              to={"/candidate/" + we_vote_id }
              onlyActiveOnIndex={false}>
          {/* Note: We want a click anywhere in this div to take you to the candidate page */}
          <div className="row" style={{ paddingBottom: "2em" }}>
            <div
              className="col-xs-4"
              style={candidate_photo_url ? {} : {paddingTop: "2em"}}>

              {/* adding inline style to img until Rob can style... */}
              {
                candidate_photo_url ?
                    <img className="img-circle utils-img-contain"
                         style={{display: "block", paddingTop: "2em"}}
                         src={candidate_photo_url}
                         alt="candidate-photo"/> :
                    <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light utils-img-contain-glyph"/>
              }

            </div>
            <div className="col-xs-8">
              <h4 className="bufferNone">
                <span style={{fontSize: "80%"}}>{ displayName }</span>
                {
                  party ?
                    <span className="link-text-candidate-party">, { party }</span> :
                    <span></span>
                }
                <span className="link-text-to-more-info"> (more)</span>
              </h4>
              { twitterDescription ? <span>{twitterDescription}<br /></span> :
                  <span></span>}
              {twitter_followers_count ?
                <div className="hidden-xs social-box fa fa-twitter">
                  {numberWithCommas(twitter_followers_count)}
                </div> :
                <span></span>}

              <ItemSupportOpposeCounts we_vote_id={we_vote_id} type="CANDIDATE" />
            </div>
          </div>
          </Link>
        <ItemActionBar we_vote_id={we_vote_id} type="CANDIDATE"/>
      </section>;
  }
}
