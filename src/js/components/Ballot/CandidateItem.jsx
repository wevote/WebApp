import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ImageHandler from "../ImageHandler";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../VoterGuide/ItemTinyOpinionsToFollow";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import OfficeNameText from "../Widgets/OfficeNameText";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import SupportStore from "../../stores/SupportStore";
import {abbreviateNumber} from "../../utils/textFormat";
import {numberWithCommas} from "../../utils/textFormat";

export default class CandidateItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url_large: PropTypes.string.isRequired,
    candidate_photo_url_medium: PropTypes.string,
    showLargeImage: PropTypes.bool,
    commentButtonHide: PropTypes.bool,
    hideOpinionsToFollow: PropTypes.bool,
    hidePositionStatement: PropTypes.bool,
    showPositionsInYourNetworkBreakdown: PropTypes.bool,
    party: PropTypes.string,
    position_list: PropTypes.array,
    we_vote_id: PropTypes.string.isRequired,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_handle: PropTypes.string,
    contest_office_name: PropTypes.string,
    link_to_ballot_item_page: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
     hide_position_statement: this.props.hidePositionStatement,
     transitioning: false,
     maximum_organization_display: 5
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    var supportProps = SupportStore.get(this.props.we_vote_id);
    if (supportProps !== undefined) {
      this.setState({ supportProps: supportProps, transitioning: false });
    }
  }

  componentWillUnmount () {
    this.guideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  _onGuideStoreChange (){
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
  }

  _onSupportStoreChange () {
    var supportProps = SupportStore.get(this.props.we_vote_id);
    if (supportProps !== undefined) {
      this.setState({ supportProps: supportProps, transitioning: false });
    }
  }

  togglePositionStatement (){
    this.setState({hide_position_statement: !this.state.hide_position_statement});
  }


  render () {
    let {
      ballot_item_display_name,
      party,
      we_vote_id,
      twitter_description,
      twitter_followers_count,
      contest_office_name,
      twitter_handle,
    } = this.props;

    const { supportProps, transitioning } = this.state;

    // TwitterHandle-based link
    let candidateLink = twitter_handle ? "/" + twitter_handle : "/candidate/" + we_vote_id;
    let goToCandidateLink = function () { browserHistory.push(candidateLink); };
    let candidate_photo_url;
    if (this.props.showLargeImage) {
      if (this.props.candidate_photo_url_large) {
        candidate_photo_url = this.props.candidate_photo_url_large;
      }
    } else if (this.props.candidate_photo_url_medium) {
      candidate_photo_url = this.props.candidate_photo_url_medium;
    }
    let candidate_photo_url_html;
    if (candidate_photo_url) {
      candidate_photo_url_html = <ImageHandler className="card-main__avatar"
                                          sizeClassName="icon-office-child "
                                          imageUrl={candidate_photo_url}
                                          alt="candidate-photo"
                                          kind_of_ballot_item="CANDIDATE" />;
    } else {
      candidate_photo_url_html = <i className="card-main__avatar icon-office-child icon-main icon-icon-person-placeholder-6-1" />;
    }
    let positions_in_your_network = SupportStore.get(we_vote_id) && ( SupportStore.get(we_vote_id).oppose_count || SupportStore.get(we_vote_id).support_count);

    return <div className="card-main candidate-card">
      <div className="card-main__media-object">
        <div className="card-main__media-object-anchor">
          {this.props.link_to_ballot_item_page ?
            <Link to={candidateLink} className="u-no-underline">{candidate_photo_url_html}</Link> :
            candidate_photo_url_html
          }

          {twitter_followers_count ?
            <span className={this.props.link_to_ballot_item_page ?
                    "twitter-followers__badge u-cursor--pointer" :
                    "twitter-followers__badge" }
                  onClick={ this.props.link_to_ballot_item_page ?
                    goToCandidateLink : null }
            >
              <span className="fa fa-twitter twitter-followers__icon" />
              <span title={numberWithCommas(twitter_followers_count)}>{abbreviateNumber(twitter_followers_count)}</span>
            </span> :
            null
          }
        </div>

        <div className="card-main__media-object-content">
          {/* {
            supportProps && supportProps.is_support ?
            <img src="/img/global/svg-icons/thumbs-up-color-icon.svg" className="card-main__position-icon" width="24" height="24" /> : null
          }
          {
            supportProps && supportProps.is_oppose ?
            <img src="/img/global/svg-icons/thumbs-down-color-icon.svg" className="card-main__position-icon" width="24" height="24" /> : null
          } */}
          <h2 className="card-main__display-name">
            { this.props.link_to_ballot_item_page ?
              <Link to={candidateLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
            }
          </h2>
          <BookmarkToggle we_vote_id={we_vote_id} type="CANDIDATE"/>
          <p className={this.props.link_to_ballot_item_page ?
              "u-gray-darker u-cursor--pointer" :
              "u-gray-darker"
            } onClick={this.props.link_to_ballot_item_page ?
              goToCandidateLink : null }
          >
          { contest_office_name ?
          <OfficeNameText political_party={party} contest_office_name={contest_office_name} /> :
            null
          }
          </p>
          { twitter_description ?
            <div className={ "u-stack--sm" + (this.props.link_to_ballot_item_page ? " card-main__description-container--truncated" : " card-main__description-container")}>
              <div>
                <p className="card-main__description">
                    {twitter_description}
                </p>
              </div>

              <Link to={candidateLink}>
                { this.props.link_to_ballot_item_page ? <span className="card-main__read-more-pseudo" /> : null }
              </Link>
              { this.props.link_to_ballot_item_page ?
                <Link to={candidateLink} className="card-main__read-more-link">&nbsp;Read more</Link> :
                null
              }
            </div> :
            null
          }
          <div className={"card-main__network-positions u-stack--sm" + this.props.link_to_ballot_item_page && " u-cursor--pointer"}
               onClick={ this.props.link_to_ballot_item_page ?
                         goToCandidateLink :
                         null }
          >
            { positions_in_your_network ?
              <ItemSupportOpposeCounts we_vote_id={we_vote_id}
                                       supportProps={supportProps}
                                       transitioning={transitioning}
                                       type="CANDIDATE" /> :
              <span /> }
            {/* Show a break-down of the positions in your network */}
            { positions_in_your_network && this.props.showPositionsInYourNetworkBreakdown ?
              <div className="u-flex u-justify-between u-inset__v--xs">
                {/* In desktop mode, align left with position bar */}
                {/* In mobile mode, turn on green up-arrow before icons */}
                <ItemTinyPositionBreakdownList ballot_item_display_name={ballot_item_display_name}
                                               ballotItemWeVoteId={we_vote_id}
                                               position_list={this.props.position_list}
                                               showSupport
                                               supportProps={this.state.supportProps} />
                {/* In desktop mode, align right with position bar */}
                {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                <ItemTinyPositionBreakdownList ballot_item_display_name={ballot_item_display_name}
                                               ballotItemWeVoteId={we_vote_id}
                                               position_list={this.props.position_list}
                                               showOppose
                                               supportProps={this.state.supportProps}/>
              </div> :
              null }
            {/* Show possible voter guides to follow */}
            { !this.props.hideOpinionsToFollow &&
              GuideStore.getVoterGuidesToFollowListByBallotItemId(we_vote_id) && GuideStore.getVoterGuidesToFollowListByBallotItemId(we_vote_id).length !== 0 ?
              <span>
                { positions_in_your_network ?
                  "More Opinions to Follow." :
                  "Opinions to Follow." }
                <ItemTinyOpinionsToFollow ballotItemWeVoteId={we_vote_id}
                                          organizationsToFollow={GuideStore.getVoterGuidesToFollowListByBallotItemId(we_vote_id)}
                                          maximumOrganizationDisplay={this.state.maximum_organization_display} />
              </span> :
              <span /> }
          </div>

        </div> {/* END .card-main__media-object-content */}
      </div> {/* END .card-main__media-object */}
      <div className="card-main__actions">
        <ItemActionBar ballot_item_we_vote_id={we_vote_id}
                       commentButtonHide={this.props.commentButtonHide}
                       supportProps={supportProps}
                       transitioning={transitioning}
                       type="CANDIDATE"
                       toggleFunction={this.togglePositionStatement.bind(this)}
        />
        { this.state.hide_position_statement ?
          null :
          <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                        ballot_item_display_name={ballot_item_display_name}
                                        supportProps={supportProps}
                                        transitioning={transitioning}
                                        type="CANDIDATE" /> }
      </div>
    </div>;
  }
}
