import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";

import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../../components/Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class MeasureItem extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_url: PropTypes.string
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
    const { supportProps, transitioning } = this.state;
    let { ballot_item_display_name, measure_subtitle,
          measure_text, we_vote_id } = this.props;
    let measureLink = "/measure/" + we_vote_id;
    let goToMeasureLink = function () { browserHistory.push(measureLink); };

    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    return <div className="measure-card__container">
      <div className="measure-card">
        <div className="measure-card__media-object">
          <div className="measure-card__media-object-anchor">

          </div>
          <div className="measure-card__media-object-content">
            {
              supportProps && supportProps.is_support ?
              <img src="/img/global/icons/thumbs-up-color-icon.svg" className="measure-card__position-icon" width="20" height="20" /> : null
            }
            {
              supportProps && supportProps.is_oppose ?
              <img src="/img/global/icons/thumbs-down-color-icon.svg" className="measure-card__position-icon" width="20" height="20" /> : null
            }
            <h2 className="measure-card__display-name">
              { this.props.link_to_ballot_item_page ?
                <Link to={measureLink}>{ballot_item_display_name}</Link> :
                  ballot_item_display_name
              }
            </h2>
            <StarAction we_vote_id={we_vote_id} type="MEASURE"/>

            <div className={ this.props.link_to_ballot_item_page ?
                    "cursor-pointer" : null }
                  onClick={ this.props.link_to_ballot_item_page ?
                    goToMeasureLink : null }>{measure_subtitle}</div>
              { this.props.measure_text ?
                <div className="measure_text">{measure_text}</div> :
                null }

            <div className="row" style={{ paddingBottom: "2rem" }}>
              <div className="col-xs-12">
              </div>
            </div>
              <span className={ this.props.link_to_ballot_item_page ?
                      "cursor-pointer" :
                      null }
                    onClick={ this.props.link_to_ballot_item_page ?
                      goToMeasureLink :
                      null }
              >
                  <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps} transitioning={transitioning} type="MEASURE" />
                </span>
              </div> {/* END .measure-card__media-object-content */}
            </div> {/* END .measure-card__media-object */}
            <div className="measure-card__actions">
              <ItemActionBar ballot_item_we_vote_id={we_vote_id} supportProps={supportProps} transitioniing={transitioning} type="MEASURE" />
              <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                              ballot_item_display_name={ballot_item_display_name}
                                              supportProps={supportProps}
                                              transitioniing={transitioning}
                                              type="MEASURE" />
            </div>
          </div>
        </div>;
      }
    }
