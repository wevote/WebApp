import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import ImageHandler from "../ImageHandler";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";
import OfficeNameText from "../Widgets/OfficeNameText";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionRatingSnippet from "../Widgets/PositionRatingSnippet";
import PositionPublicToggle from "../Widgets/PositionPublicToggle";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";
import SupportStore from "../../stores/SupportStore";
import CandidateStore from "../../stores/CandidateStore";
import { capitalizeString } from "../../utils/textFormat";

export default class VoterPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired,
    link_to_edit_modal_off: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
    popover_off: PropTypes.bool,
    placement: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    this.setState({
      // showEditPositionModal: false,
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
      transitioning: false
    });
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onSupportStoreChange () {
    let position = this.props.position;
    // console.log("position:", position);
    this.setState({
      supportProps: SupportStore.get(position.ballot_item_we_vote_id),
      transitioning: false
    });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  // closeEditPositionModal () {
  //   this.setState({ showEditPositionModal: false });
  // }
  //
  // openEditPositionModal () {
  //   this.setState({ showEditPositionModal: true });
  // }

  render () {
    renderLog(__filename);

    let { position, stance_display_off, comment_text_off, popover_off, placement } = this.props;
    const { supportProps } = this.state;

    let statement_text;
    let is_support;
    let is_oppose;
    let is_looking_at_self = true;
    // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
    statement_text = supportProps && supportProps.voter_statement_text ? supportProps.voter_statement_text : position.statement_text;
    is_support = supportProps && supportProps.is_support ? supportProps.is_support : position.is_support;
    is_oppose = supportProps && supportProps.is_oppose ? supportProps.is_oppose : position.is_oppose;

    // TwitterHandle-based link
    let ballot_item_url = position.kind_of_ballot_item === "MEASURE" ? "/measure/" : "/candidate/";
    let ballotItemLink = ballot_item_url + position.ballot_item_we_vote_id;
    let position_description = "";
    let is_candidate = position.kind_of_ballot_item === "CANDIDATE";
    let ballot_item_display_name = "";
    if (position.ballot_item_display_name) {
      ballot_item_display_name = capitalizeString(position.ballot_item_display_name);
    }

    const is_on_ballot_item_page = false;
    if (position.vote_smart_rating) {
      position_description = <PositionRatingSnippet {...position}
                                                     popover_off={popover_off}
                                                     placement={placement} />;
    } else if (is_support || is_oppose) {
      // We overwrite the "statement_text" passed in with position
      position_description = <PositionSupportOpposeSnippet {...position}
                                                           statement_text={statement_text}
                                                           is_support={is_support}
                                                           is_oppose={is_oppose}
                                                           is_on_ballot_item_page={is_on_ballot_item_page}
                                                           is_looking_at_self={is_looking_at_self}
                                                           stance_display_off={stance_display_off}
                                                           comment_text_off={comment_text_off} />;
    } else {
      position_description = <PositionInformationOnlySnippet {...position}
                                                             is_on_ballot_item_page={is_on_ballot_item_page}
                                                             is_looking_at_self={is_looking_at_self}
                                                             stance_display_off={stance_display_off}
                                                             comment_text_off={comment_text_off} />;
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contest_office_name;
    let political_party;
    if (position.kind_of_ballot_item === "CANDIDATE") {
      contest_office_name = position.contest_office_name;
      political_party = position.ballot_item_political_party;
    }
    //CHICHI
    let { office_we_vote_id } = CandidateStore.getCandidate(position.ballot_item_we_vote_id);
    return <li className="position-item card-child">
      <BookmarkToggle we_vote_id={position.ballot_item_we_vote_id} type={position.kind_of_ballot_item} />
      <div className="card-child__media-object-anchor">
        <Link to={ ballotItemLink }
              className="u-no-underline"
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          { is_candidate ?
            <ImageHandler
              className="card-child__avatar--round"
              sizeClassName="icon-lg "
              imageUrl={position.ballot_item_image_url_https_large}
              alt="candidate-photo"
              kind_of_ballot_item={position.kind_of_ballot_item}/> :
            null
          }
        </Link>
      </div>
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          <Link to={ ballotItemLink }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{ballot_item_display_name}</span>
          </Link>
          <br />
            { position.kind_of_ballot_item === "CANDIDATE" && contest_office_name !== undefined ?
            <OfficeNameText
              political_party={political_party}
              contest_office_name={contest_office_name}
              office_link={"/office/" + office_we_vote_id}
            /> :
              null
            }
          {/* show explicit position, if available, otherwise show rating */}
          {/* this.props.link_to_edit_modal_off ?
            position_description :
            <span>
              <span className="edit-position-action"
                    onClick={onEditPositionClick}
                    title="Edit this position">
                { position_description }
              </span>
              { GET WORKING WITH MEASURES <EditPositionAboutCandidateModal show={this.state.showEditPositionModal}
                                               onHide={this.closeEditPositionModal.bind(this)}
                                               position={position}
                                               organization={organization}/>}
            </span> */}
            {position_description}
            <PositionPublicToggle ballot_item_we_vote_id={position.ballot_item_we_vote_id}
              type={position.kind_of_ballot_item}
              supportProps={supportProps}
              className="organization-position-item-toggle"/>
        </div>
      </div>
    </li>;
  }
}
