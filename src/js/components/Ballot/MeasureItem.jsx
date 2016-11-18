import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../../components/Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ReadMore from "../../components/Widgets/ReadMore";
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
    measure_url: PropTypes.string,
    state_code: PropTypes.string,
    election_display_name: PropTypes.string,
    regional_display_name: PropTypes.string,
    state_display_name: PropTypes.string
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
    let goToMeasureLink = function () { browserHistory.push(measureLink); };
    let num_of_lines = 2;
    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    return <div className="card-main">
      <div className="card-main__content">
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
            <Link to={measureLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <StarAction we_vote_id={we_vote_id} type="MEASURE"/>
        <div className="card-main__measure-election t-b t-darker-gray">
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
            <div className="measure_text gray-mid">
              <ReadMore num_of_lines={num_of_lines}
                        text_to_display={measure_text} />
            </div> :
            null
          }

          <div className="row" style={{ paddingBottom: "0.5rem" }}>
            <div className="col-xs-12">
            </div>
          </div>
          <span className={ this.props.link_to_ballot_item_page ?
                  "u-cursor--pointer" :
                  null }
                onClick={ this.props.link_to_ballot_item_page ?
                  goToMeasureLink :
                  null }
          >
              <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps} transitioning={transitioning} type="MEASURE" />
            </span>
          </div> {/* END .card-main__content */}
          <div className="card-main__actions">
            <ItemActionBar ballot_item_we_vote_id={we_vote_id} supportProps={supportProps} transitioniing={transitioning} type="MEASURE" />
            <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                            ballot_item_display_name={ballot_item_display_name}
                                            supportProps={supportProps}
                                            transitioniing={transitioning}
                                            type="MEASURE" />
          </div>
        </div>;
      }
    }
