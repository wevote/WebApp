import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import BookmarkAction from "../../components/Widgets/BookmarkAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";


export default class MeasureItemCompressed extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    position_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_url: PropTypes.string,
    _toggleMeasureModal: PropTypes.func
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

  _onGuideStoreChange (){
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
    // console.log("_onGuideStoreChange");
  }

  _onSupportStoreChange () {
    this.setState({
      supportProps: SupportStore.get(this.props.we_vote_id),
      transitioning: false
    });
  }
  render () {
    //console.log("this.props", this.props);
    const { supportProps } = this.state;
    let support_count = 0;
    if (supportProps && supportProps.support_count) {
      // Only show ItemSupportOpposeCounts if your network has something to say
      support_count = supportProps.support_count;
    }
    let oppose_count = 0;
    if (supportProps && supportProps.oppose_count) {
      // Only show ItemSupportOpposeCounts if your network has something to say
      oppose_count = supportProps.oppose_count;
    }
    let { ballot_item_display_name, measure_subtitle,
          measure_text, we_vote_id } = this.props;
    let measureLink = "/measure/" + we_vote_id;
    let goToMeasureLink = function () { browserHistory.push(measureLink); };

    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    let measure_for_modal = {
      ballot_item_display_name: ballot_item_display_name,
      guides_to_follow_list: GuideStore.toFollowListForBallotItemById(this.props.we_vote_id),
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
              <Link to={measureLink}>{ballot_item_display_name}
              <span className="card-main__measure-read-more-link">learn&nbsp;more</span></Link>
            </div> :
              ballot_item_display_name
          }
        </h2>
        <BookmarkAction we_vote_id={we_vote_id} type="MEASURE"/>
        {/* Measure information */}
        <div
          className={ this.props.link_to_ballot_item_page ?
          "u-cursor--pointer" : null }
          onClick={ this.props.link_to_ballot_item_page ?
          goToMeasureLink : null }
        >
          {measure_subtitle}
        </div>
        { this.props.measure_text ?
          <div className="measure_text">{measure_text}</div> :
          null }

        {/* This is the area *under* the measure title/text */}
        <div className={"u-flex" + (this.props.link_to_ballot_item_page ?
                " u-cursor--pointer" : "") } >

          {/* Needed to force following flex area to the right */}
          <div className="MeasureItem__summary u-flex-auto" />

          <div className="u-flex u-items-center">
            {/* *** "Positions in your Network" bar OR items you can follow *** */}
            <div className="u-flex-none u-justify-end u-push--md">
              <span className={ this.props.link_to_ballot_item_page ?
                      "u-cursor--pointer" :
                      null }
              >
              { support_count || oppose_count ?
                <span onClick={ this.props.link_to_ballot_item_page ?
                      ()=>{this.props._toggleMeasureModal(measure_for_modal);} :
                      null } >
                  <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={this.state.supportProps}
                                           type="MEASURE" />
                </span> :
                <span onClick={ this.props.link_to_ballot_item_page ?
                      ()=>{this.props._toggleMeasureModal(measure_for_modal);} :
                      null } >
                {/* Show possible voter guides to follow */}
                { GuideStore.toFollowListForBallotItemById(we_vote_id) && GuideStore.toFollowListForBallotItemById(we_vote_id).length !== 0 ?
                  <ItemTinyOpinionsToFollow ballotItemWeVoteId={we_vote_id}
                                            organizationsToFollow={GuideStore.toFollowListForBallotItemById(we_vote_id)}
                                            maximumOrganizationDisplay={this.state.maximum_organization_display}/> :
                  <span /> }
                </span> }
              </span>
            </div>

            {/* *** Choose Support or Oppose *** */}
            <div className="u-flex-none u-justify-end">
              <ItemActionBar ballot_item_we_vote_id={we_vote_id}
                             supportProps={this.state.supportProps}
                             shareButtonHide
                             commentButtonHide
                             transitioniing={this.state.transitioning}
                             type="MEASURE" />
            </div>
          </div>
        </div>
      </div> {/* END .card-main__content */}
    </div>;
  }
}
