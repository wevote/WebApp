import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class Measure extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
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
    const { supportProps, transitioning } = this.state;

    var we_vote_id = this.props.we_vote_id;
    var measure_subtitle = capitalizeString(this.props.measure_subtitle);
    var ballot_item_display_name = capitalizeString(this.props.ballot_item_display_name);
    var measureLink = "/measure/" + we_vote_id;
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
              { this.props.isListItem ?
                <Link to={measureLink}>{ballot_item_display_name}</Link> :
                  ballot_item_display_name
              }
            </h2>
            <StarAction we_vote_id={we_vote_id} type="MEASURE"/>

            <div>{measure_subtitle}</div>
            <div className="bs-row" style={{ paddingBottom: "2rem" }}>
              <div className="col-xs-12">
              </div>
            </div>
                <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps} transitioning={transitioning} type="MEASURE" />
              </div> {/* END .measure-card__media-object-content */}
            </div> {/* END .measure-card__media-object */}
            <div className="measure-card__actions">
              <ItemActionBar we_vote_id={we_vote_id} supportProps={supportProps} transitioniing={transitioning} type="MEASURE" />
            </div>
          </div>
        </div>;
      }
    }
