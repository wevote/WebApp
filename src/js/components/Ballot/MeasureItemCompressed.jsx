import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../VoterGuide/ItemTinyOpinionsToFollow";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";


export default class MeasureItemCompressed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    position_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_url: PropTypes.string,
    _toggleMeasureModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      showModal: false,
      maximum_organization_display: 4,
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.guideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  _onGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("_onGuideStoreChange");
  }

  _onSupportStoreChange () {
    this.setState({
      supportProps: SupportStore.get(this.props.we_vote_id),
      transitioning: false,
    });
  }
  render () {
    let { ballot_item_display_name, measure_subtitle, measure_text, we_vote_id } = this.props;

    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    let measureGuidesList = GuideStore.getVoterGuidesToFollowForBallotItemId(we_vote_id);

    let measure_for_modal = {
      ballot_item_display_name: ballot_item_display_name,
      voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
      kind_of_ballot_item: this.props.kind_of_ballot_item,
      link_to_ballot_item_page: this.props.link_to_ballot_item_page,
      measure_subtitle: measure_subtitle,
      measure_text: this.props.measure_text,
      measure_url: this.props.measure_url,
      measure_we_vote_id: this.props.we_vote_id,
      position_list: this.props.position_list
    };

    // To get position_list
    // TODO DALE var measure = MeasureStore.get(this.state.measure_we_vote_id) || {};

    return <div className="card-main measure-card">
      <a name={we_vote_id} />
      <div className="card-main__content">
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <div>
              <Link to={"/measure/" + we_vote_id}>
                {ballot_item_display_name}
                <span className="card-main__measure-read-more-link">learn&nbsp;more</span>
              </Link>
            </div> :
              ballot_item_display_name
          }
        </h2>
        <BookmarkToggle we_vote_id={we_vote_id} type="MEASURE"/>
        {/* Measure information */}
        <div className={ this.props.link_to_ballot_item_page ? "u-cursor--pointer" : null }
             onClick={ this.props.link_to_ballot_item_page ? () => browserHistory.push("/measure/" + we_vote_id) : null }>
          {measure_subtitle}
        </div>
        { measure_text ? <div className="measure_text">{measure_text}</div> : null }

        {/* Opinion Items */}
        <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
          {/* Positions in Your Network */}
          <div className={ this.props.link_to_ballot_item_page ? "u-cursor--pointer" : null }
               onClick={ this.props.link_to_ballot_item_page ? () => this.props._toggleMeasureModal(measure_for_modal) : null }>
            <ItemSupportOpposeCounts we_vote_id={we_vote_id}
                                     supportProps={this.state.supportProps}
                                     guideProps={measureGuidesList}
                                     type="MEASURE" />
          </div>

          {/* Possible Voter Guides to Follow (Desktop) */}
          <div onClick={ this.props.link_to_ballot_item_page ? () => this.props._toggleMeasureModal(measure_for_modal) : null }>
            { measureGuidesList && measureGuidesList.length ?
              <ItemTinyOpinionsToFollow ballotItemWeVoteId={we_vote_id}
                                        organizationsToFollow={measureGuidesList}
                                        maximumOrganizationDisplay={this.state.maximum_organization_display}
                                        supportProps={this.state.supportProps} /> : null }
          </div>

          {/* Support or Oppose */}
          <div className="u-cursor--pointer">
            <ItemActionBar ballot_item_we_vote_id={we_vote_id}
                           supportProps={this.state.supportProps}
                           shareButtonHide
                           commentButtonHide
                           transitioniing={this.state.transitioning}
                           type="MEASURE" />
          </div>
        </div>
      </div> {/* END .card-main__content */}
    </div>;
  }
}
