import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";
import { Modal, Button } from "react-bootstrap";

export default class MeasureItemCompressed extends Component {
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
    this.state = {transitioning: false, showModal:false};
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
    this._togglePopup = this._togglePopup.bind(this);
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

  _togglePopup () {
     this.setState({
        showModal: !this.state.showModal,
      });
  }

  _onSupportStoreChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
  }
  render () {
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


   const PopupModal = (
      <Modal show={this.state.showModal} onHide={this._togglePopup}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{ballot_item_display_name}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._togglePopup}>Close</Button>
          </Modal.Footer>
        </Modal>
      );

    return <div className="card-main measure-card">
         {this.state.showModal ? PopupModal : null}
      <div className="card-main__content">
        {/* Reuse this?
        {
          supportProps && supportProps.is_support ?
          <img src="/img/global/svg-icons/thumbs-up-color-icon.svg"
               className="card-main__position-icon" width="24" height="24" /> : null
        }
        {
          supportProps && supportProps.is_oppose ?
          <img src="/img/global/svg-icons/thumbs-down-color-icon.svg"
               className="card-main__position-icon" width="24" height="24" /> : null
        }
        */}
        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={measureLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>
        <StarAction we_vote_id={we_vote_id} type="MEASURE"/>

        {/* This is the area *under* the measure title */}
        <table className={ this.props.link_to_ballot_item_page ?
                "u-cursor--pointer table table-condensed" : "table table-condensed" } >
          <tbody>
            <tr>
              <td className="col-md-6">
                <div className={ this.props.link_to_ballot_item_page ?
                        "u-cursor--pointer" : null }
                      onClick={ this.props.link_to_ballot_item_page ?
                        goToMeasureLink : null }>{measure_subtitle}</div>
                { this.props.measure_text ?
                  <div className="measure_text">{measure_text}</div> :
                  null }
              </td>

              {/* *** "Positions in your Network" bar OR items you can follow *** */}
              <td className="col-md-3 u-tr u-inset__minimum-width--100px">
                <span className={ this.props.link_to_ballot_item_page ?
                        "u-cursor--pointer" :
                        null }
                      onClick={ this.props.link_to_ballot_item_page ?
                        this._togglePopup :
                        null }
                >
                { support_count || oppose_count ?
                  <span>
                    <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps}
                                             type="MEASURE" />
                  </span> :
                  <span>
                  {/* Show possible voter guides to follow */}
                  { GuideStore.toFollowListForBallotItemById(we_vote_id) && GuideStore.toFollowListForBallotItemById(we_vote_id).length !== 0 ?
                    <ItemTinyOpinionsToFollow ballotItemWeVoteId={we_vote_id}
                                              organizationsToFollow={GuideStore.toFollowListForBallotItemById(we_vote_id)}/> :
                    <span /> }
                  </span> }
                </span>
              </td>

              {/* *** Choose Support or Oppose *** */}
              <td className="col-md-3 u-inset__minimum-width--120px">
                <ItemActionBar ballot_item_we_vote_id={we_vote_id}
                               supportProps={supportProps}
                               shareButtonHide
                               commentButtonHide
                               transitioniing={this.state.transitioning}
                               type="MEASURE" />
              </td>
            </tr>
          </tbody>
        </table>
      </div> {/* END .card-main__content */}
    </div>;
  }
}
