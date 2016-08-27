import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import EditPositionAboutCandidateModal from "../../components/VoterGuide/EditPositionAboutCandidateModal";
import FriendsOnlyIndicator from "../../components/Widgets/FriendsOnlyIndicator";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    link_to_edit_modal_off: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
    popover_off: PropTypes.bool,
    placement: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { showEditPositionModal: false };
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this._onSupportStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  _onSupportStoreChange () {
    let position = this.props.position;
    this.setState({
      supportProps: SupportStore.get(position.ballot_item_we_vote_id),
      transitioning: false
    });
  }

  closeEditPositionModal () {
    this.setState({ showEditPositionModal: false });
  }

  openEditPositionModal () {
    this.setState({ showEditPositionModal: true });
  }

  render (){
    let position = this.props.position;
    let organization = this.props.organization;
    let { stance_display_off, comment_text_off, popover_off, placement } = this.props;
    const { supportProps } = this.state;

    // When component first loads, use the value in the incoming position. If there are any updates, use those.
    var statement_text = supportProps && supportProps.voter_statement_text ? supportProps.voter_statement_text : position.statement_text;
    var is_public_position = supportProps && supportProps.is_public_position ? supportProps.is_public_position : position.is_public_position;
    var is_support = supportProps && supportProps.is_support ? supportProps.is_support : position.is_support;
    var is_oppose = supportProps && supportProps.is_oppose ? supportProps.is_oppose : position.is_oppose;
    let signed_in_with_this_twitter_account = true;
    // TwitterHandle-based link
    let ballot_item_url = position.kind_of_ballot_item === "MEASURE" ? "/measure/" : "/candidate/";
    let ballotItemLink = position.ballot_item_twitter_handle ? "/" + position.ballot_item_twitter_handle : ballot_item_url + position.ballot_item_we_vote_id;
    let position_description = "";
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
                                                           stance_display_off={stance_display_off}
                                                           comment_text_off={comment_text_off} />;
    } else {
      position_description = <PositionInformationOnlySnippet {...position}
                                                             is_on_ballot_item_page={is_on_ballot_item_page}
                                                             stance_display_off={stance_display_off}
                                                             comment_text_off={comment_text_off} />;
    }

    const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);

    return <li className="position-item">
      <StarAction we_vote_id={position.ballot_item_we_vote_id} type={position.kind_of_ballot_item} />
        <Link to={ ballotItemLink }
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          { position.ballot_item_image_url_https ?
            <ImageHandler
              className="position-item__avatar"
              imageUrl={position.ballot_item_image_url_https}
              alt="candidate-photo" placeholderForCandidate/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light position-item__avatar"/>
          }
        </Link>
        <div className="position-item__content">
          <Link to={ ballotItemLink }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{position.ballot_item_display_name}</span>
          </Link>
          {/* show explicit position, if available, otherwise show rating */}
          { this.props.link_to_edit_modal_off ?
            position_description :
            <span>
              <span className="edit-position-action"
                    onClick={onEditPositionClick}
                    title="Edit this position">
                { position_description }
              </span>
              <EditPositionAboutCandidateModal show={this.state.showEditPositionModal}
                                               onHide={this.closeEditPositionModal.bind(this)}
                                               position={position}
                                               organization={organization}/>
            </span> }
            { signed_in_with_this_twitter_account ?
              <PositionPublicToggle ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                type={position.kind_of_ballot_item}
                supportProps={supportProps}
                className="organization-position-item-toggle"/> :
                null
              }
          { is_public_position ?
            null :
            <FriendsOnlyIndicator /> }
        </div>
        {/*Running for {office_display_name}
        <br />
          Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
          Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
        <br />*/}
      </ li>;
  }
}
