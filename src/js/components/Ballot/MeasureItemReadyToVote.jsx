import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import GuideStore from "../../stores/GuideStore";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../../components/VoterGuide/ItemTinyOpinionsToFollow";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

//HIDE: support/oppose buttons, position bar, bookmark, description of the measure
//SHOW IF TRUE: "Supported by you" or "Opposed by you",
 //OTHERWISE, IF THERE IS A CLEAR WINNER SHOW: "Your network supports" or "Your network opposes"
 //OTHERWISE, SHOW: "Your network is undecided" or "Your network has no opinion"

export default class MeasureItemReadyToVote extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure_url: PropTypes.string,
    _togglePopup: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {transitioning: false, showModal: false};
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

    return <div className="card-main measure-card">

      <div className="card-main__content">
        {
          supportProps && supportProps.is_support ?
          <span className="star-action ml1"> Supported by you</span> :
          null
          //<img src="/img/global/svg-icons/thumbs-up-color-icon.svg"
          //     className="card-main__position-icon" width="24" height="24" />
        }
        {
          supportProps && supportProps.is_oppose ?
          <span className="star-action ml1"> Opposed by you </span> :
           null
          //<img src="/img/global/svg-icons/thumbs-down-color-icon.svg"
          //     className="card-main__position-icon" width="24" height="24" />
        }
        {
          supportProps && !supportProps.is_support && supportProps.support_count > supportProps.oppose_count ?
          <span className="star-action ml1"> Your network supports </span> :
          null
        }
        {
          supportProps && !supportProps.is_oppose && supportProps.support_count < supportProps.oppose_count ?
          <span className="star-action ml1"> Your network opposes </span> :
          null
        }
        {
          supportProps && (supportProps.support_count === 0 && supportProps.oppose_count === 0)?
          <span className="star-action ml1"> Your network is undecided </span> :
          null
        }

        <h2 className="card-main__display-name">
          { this.props.link_to_ballot_item_page ?
            <Link to={measureLink}>{ballot_item_display_name}</Link> :
              ballot_item_display_name
          }
        </h2>

        {/* This is the area *under* the measure title */}

      </div> {/* END .card-main__content */}
    </div>;
  }
}
