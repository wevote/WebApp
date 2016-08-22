import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";

import StarAction from "../../components/Widgets/StarAction";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../../components/Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import SupportStore from "../../stores/SupportStore";
import {abbreviateNumber} from "../../utils/textFormat";
import {numberWithCommas} from "../../utils/textFormat";

export default class CandidateItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url: PropTypes.string.isRequired,
    party: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    office_name: PropTypes.string,
    link_to_ballot_item_page: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    var supportProps = SupportStore.get(this.props.we_vote_id);
    if (supportProps !== undefined) {
      this.setState({ supportProps: supportProps, transitioning: false });
    }
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  _onSupportStoreChange () {
    var supportProps = SupportStore.get(this.props.we_vote_id);
    if (supportProps !== undefined) {
      this.setState({ supportProps: supportProps, transitioning: false });
    }
  }

  render () {
    let {
      ballot_item_display_name,
      candidate_photo_url,
      party,
      we_vote_id,
      twitter_description,
      twitter_followers_count,
      office_name,
      twitter_handle,
    } = this.props;

    const { supportProps, transitioning } = this.state;

    // TwitterHandle-based link
    let candidateLink = twitter_handle ? "/" + twitter_handle : "/candidate/" + we_vote_id;
    let goToCandidateLink = function () { browserHistory.push(candidateLink); };
    let candidate_photo_url_html;
    if (candidate_photo_url) {
      candidate_photo_url_html = <img className="candidate-card__photo"
                                          src={candidate_photo_url}
                                          alt="candidate-photo" />;
    } else {
      candidate_photo_url_html = <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light utils-img-contain-glyph" />;
    }


    return <div className="candidate-card">
      <div className="candidate-card__media-object">
        <div className="candidate-card__media-object-anchor">
          {this.props.link_to_ballot_item_page ?
            <Link to={candidateLink}>{candidate_photo_url_html}</Link> :
            candidate_photo_url_html
          }

          {twitter_followers_count ?
            <span className={this.props.link_to_ballot_item_page ?
                    "twitter-followers__badge cursor-pointer" :
                    "twitter-followers__badge" }
                  onClick={ this.props.link_to_ballot_item_page ?
                    goToCandidateLink : null }
            >
              <span className="fa fa-twitter twitter-followers__icon"></span>
              <span title={numberWithCommas(twitter_followers_count)}>{abbreviateNumber(twitter_followers_count)}</span>
            </span> :
            null
          }
        </div>

        <div className="candidate-card__media-object-content">
          {
            supportProps && supportProps.is_support ?
            <img src="/img/global/icons/thumbs-up-color-icon.svg" className="candidate-card__position-icon" width="20" height="20" /> : null
          }
          {
            supportProps && supportProps.is_oppose ?
            <img src="/img/global/icons/thumbs-down-color-icon.svg" className="candidate-card__position-icon" width="20" height="20" /> : null
          }
          <h2 className="candidate-card__display-name">
            { this.props.link_to_ballot_item_page ?
              <Link to={candidateLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
            }
          </h2>
          <StarAction we_vote_id={we_vote_id} type="CANDIDATE"/>
          <p className={this.props.link_to_ballot_item_page ?
              "candidate-card__candidacy cursor-pointer" :
              "candidate-card__candidacy"
            } onClick={this.props.link_to_ballot_item_page ?
              goToCandidateLink : null }
          >
            { party ?
              <span><span className="candidate-card__political-party">
                {party}
              </span><span> candidate for </span></span> :
              "Candidate for "
            }
            <span className="candidate-card__office">
              { office_name }
            </span>
          </p>
          { twitter_description ?
            <div className={ this.props.link_to_ballot_item_page ? "candidate-card__description-container--truncated" : "candidate-card__description-container"}>
              <div>
                <p className="candidate-card__description">
                    {twitter_description}
                </p>
              </div>

              <Link to={candidateLink}>
                { this.props.link_to_ballot_item_page ? <span className="candidate-card__read-more-pseudo"></span> : null }
              </Link>
              { this.props.link_to_ballot_item_page ?
                <Link to={candidateLink} className="candidate-card__read-more-link">&nbsp;Read more</Link> :
                null
              }
            </div> :
            null
          }
          {
            <span className={ this.props.link_to_ballot_item_page ?
                    "candidate-card__network-positions cursor-pointer" :
                    "candidate-card__network-positions" }
                  onClick={ this.props.link_to_ballot_item_page ?
                    goToCandidateLink : null }
            >
              <ItemSupportOpposeCounts we_vote_id={we_vote_id}
                                       supportProps={supportProps}
                                       transitioning={transitioning}
                                       type="CANDIDATE" /></span>
            }

        </div> {/* END .candidate-card__media-object-content */}
      </div> {/* END .candidate-card__media-object */}
      <div className="candidate-card__actions">
        <ItemActionBar ballot_item_we_vote_id={we_vote_id} supportProps={supportProps} transitioniing={transitioning} type="CANDIDATE" />
        <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                        ballot_item_display_name={ballot_item_display_name}
                                        supportProps={supportProps}
                                        transitioniing={transitioning}
                                        type="CANDIDATE" />
      </div>
    </div>;
  }
}
