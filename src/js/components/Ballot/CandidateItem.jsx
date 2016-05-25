import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import StarAction from "../../components/Widgets/StarAction";
import ItemActionBar from "../../components/Widgets/ItemActionbar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import SupportStore from "../../stores/SupportStore";
import { numberWithCommas } from "../../utils/textFormat";

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url: PropTypes.string.isRequired,
    party: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    office_name: PropTypes.string,
    isListItem: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.listener = SupportStore.addListener(this._onChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.listener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
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
    } = this.props;
    const { supportProps, transitioning } = this.state;
    const url = "/candidate/" + we_vote_id;

    return <div className="candidate-card__container">
      <div className="candidate-card">
        <div className="candidate-card__content">
          <div className="candidate-card__media-object">
            <div className="candidate-card__media-object-anchor">
              {candidate_photo_url ?
                    <img className="candidate-card__photo"
                         src={candidate_photo_url}
                         alt="candidate-photo"/> :
                    <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light utils-img-contain-glyph"/>}
              {
                supportProps && supportProps.is_support ?
                <img src="/img/global/icons/thumbs-up-color-icon.svg" width="20" height="20" /> : null
              }
              {
                supportProps && supportProps.is_oppose ?
                <img src="/img/global/icons/thumbs-down-color-icon.svg" width="20" height="20" /> : null
              }
              {twitter_followers_count ?
                <span className="twitter-followers__badge">
                  <span className="fa fa-twitter twitter-followers__icon"></span>
                  {numberWithCommas(twitter_followers_count)}
                </span> :
                null}
            </div>

            <div className="candidate-card__media-object-content">
              <h2 className="candidate-card__display-name">
                <Link to={url}>{ballot_item_display_name}</Link>
              </h2>
              <StarAction we_vote_id={we_vote_id} type="CANDIDATE"/>
              <p className="candidate-card__candidacy">
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
              <p className="candidate-card__description">
                  <span>
                    { twitter_description }
                    { this.props.isListItem ?
                      <Link to={url}>read more</Link> :
                      null
                    }
                  </span>
              </p>
              <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps} transitioning={transitioning} type="CANDIDATE" />
            </div> {/* END .candidate-card__media-object-content */}
          </div> {/* END .candidate-card__media-object */}
          <div className="candidate-card__actions">
            <ItemActionBar we_vote_id={we_vote_id} supportProps={supportProps} transitioniing={transitioning} type="CANDIDATE" />
          </div>
        </div> {/* END .candidate-card__content */}
      </div>
    </div>;
  }
}
