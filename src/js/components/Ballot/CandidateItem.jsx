import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import StarAction from "../../components/Widgets/StarAction";
import ItemActionBar from "../../components/Widgets/ItemActionbar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import { numberWithCommas } from "../../utils/textFormat";

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url: PropTypes.string.isRequired,
    party: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
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
            <div className="col-xs-4">

              {/* adding inline style to img until Rob can style... */}
              {
                candidate_photo_url ?
                    <img className="img-circle utils-img-contain"
                         style={{display: "block"}}
                         src={candidate_photo_url}
                         alt="candidate-photo"/> :
                    <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light utils-img-contain-glyph"/>
              }
              {twitter_followers_count ?
                <span className="twitter-followers__badge candidate-item__twitter-badge">
                  <span className="fa fa-twitter twitter-followers__icon"></span>
                  {numberWithCommas(twitter_followers_count)}
                </span> :
                null}
            </div>
            <div className="col-xs-8">
              <h4 className="bufferNone">
                <span style={{fontSize: "80%"}}>{ displayName }</span>
                {
                  party ?
                    <span className="link-text-candidate-party">, { party }</span> :
                    null
                }
                <span className="link-text-to-more-info"> (more)</span>
              </h4>
              { twitterDescription ? <span>{twitterDescription}<br /></span> :
                  null}

              <ItemSupportOpposeCounts we_vote_id={we_vote_id} type="CANDIDATE" />
            </div>
          </div>
          </Link>
        <ItemActionBar we_vote_id={we_vote_id} type="CANDIDATE"/>
      </section>;
  }
}
