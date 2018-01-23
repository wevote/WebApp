import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { cordovaDot } from "../../utils/cordovaUtils";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import ReadMore from "../Widgets/ReadMore";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class MeasureItem extends Component {
  static propTypes = {
    commentButtonHide: PropTypes.bool,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_url: PropTypes.string,
    state_code: PropTypes.string,
    election_display_name: PropTypes.string,
    position_list: PropTypes.array,
    regional_display_name: PropTypes.string,
    state_display_name: PropTypes.string,
    showPositionsInYourNetworkBreakdown: PropTypes.bool
  };
  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this._onChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
  }
  render () {
    const { supportProps, transitioning } = this.state;
    let { ballot_item_display_name, measure_subtitle,
          measure_text, we_vote_id, state_display_name,
          election_display_name, regional_display_name } = this.props;
    if (state_display_name === undefined) {
      state_display_name = this.props.state_code.toUpperCase();
    }
    let measureLink = "/measure/" + we_vote_id;
    let goToMeasureLink = function () { historyPush(measureLink); };
    let num_of_lines = 2;
    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    let positions_in_your_network = SupportStore.get(we_vote_id) && ( SupportStore.get(we_vote_id).oppose_count || SupportStore.get(we_vote_id).support_count);

    return <div className="card-main">
      <div className="card-main__content">
        {/* {
          supportProps && supportProps.is_support ?
          <img src={cordovaDot("/img/global/svg-icons/thumbs-up-color-icon.svg")} className="card-main__position-icon" width="24" height="24" /> : null
        }
        {
          supportProps && supportProps.is_oppose ?
          <img src={cordovaDot("/img/global/svg-icons/thumbs-down-color-icon.svg")} className="card-main__position-icon" width="24" height="24" /> : null
        } */}
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={measureLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <BookmarkToggle we_vote_id={we_vote_id} type="MEASURE"/>
        <div className="card-main__measure-election u-bold u-gray-darker">
          <p>{ election_display_name ? election_display_name : "Appearing on the ballot in " }
            { election_display_name ? <span> &middot; </span> : null }
            { regional_display_name ? regional_display_name : null }
            { regional_display_name && state_display_name ? ", " : null }
            { state_display_name }
        </p></div>
        <div className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer" : null }
              onClick={ this.props.link_to_ballot_item_page ?
                goToMeasureLink : null }>{measure_subtitle}</div>
          { this.props.measure_text ?
            <div className="measure_text u-gray-mid">
              <ReadMore num_of_lines={num_of_lines}
                        text_to_display={measure_text} />
            </div> :
            null
          }

          <div className="row" style={{ paddingBottom: "0.5rem" }}>
            <div className="col-12" />
          </div>
          <div className={ this.props.link_to_ballot_item_page ?
                  "u-cursor--pointer" :
                  null }
                onClick={ this.props.link_to_ballot_item_page ?
                  goToMeasureLink :
                  null }
          >
              <div className="u-stack--md">
                <ItemSupportOpposeCounts we_vote_id={we_vote_id}
                                         supportProps={supportProps}
                                         transitioning={transitioning}
                                         type="MEASURE"
                                         positionBarIsClickable />
             </div>
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
                                                 supportProps={this.state.supportProps} />
                </div> :
                null }
       </div>
          </div> {/* END .card-main__content */}
          <div className="card-main__actions">
            <ItemActionBar ballot_item_we_vote_id={we_vote_id}
                           ballot_item_display_name={ballot_item_display_name}
                           commentButtonHide={this.props.commentButtonHide}
                           supportProps={supportProps}
                           transitioning={transitioning}
                           type="MEASURE" />
            <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                            ballot_item_display_name={ballot_item_display_name}
                                            supportProps={supportProps}
                                            transitioning={transitioning}
                                            type="MEASURE" />
          </div>
        </div>;
      }
    }
