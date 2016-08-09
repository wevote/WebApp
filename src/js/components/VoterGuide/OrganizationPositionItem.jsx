import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import EditPositionAboutCandidateModal from "../../components/VoterGuide/EditPositionAboutCandidateModal";
import FriendsOnlyIndicator from "../../components/Widgets/FriendsOnlyIndicator";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import StarAction from "../../components/Widgets/StarAction";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    link_to_edit_modal_off: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = { showEditPositionModal: false };
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
    let { stance_display_off, comment_text_off } = this.props;

    // TwitterHandle-based link
    let candidateLink = position.ballot_item_twitter_handle ? "/" + position.ballot_item_twitter_handle : "/candidate/" + position.ballot_item_we_vote_id;

    let position_description = "";
    const is_on_candidate_page = false;
    if (position.vote_smart_rating) {
      position_description = <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      position_description = <PositionSupportOpposeSnippet {...position}
                                                           is_on_candidate_page={is_on_candidate_page}
                                                           stance_display_off={stance_display_off}
                                                           comment_text_off={comment_text_off} />;
    } else {
      position_description = <PositionInformationOnlySnippet {...position}
                                                             is_on_candidate_page={is_on_candidate_page}
                                                             stance_display_off={stance_display_off}
                                                             comment_text_off={comment_text_off} />;
    }

    const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);

    return <li className="position-item">
      <StarAction we_vote_id={position.ballot_item_we_vote_id} type={position.kind_of_ballot_item} />
        <Link to={ candidateLink }
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          { position.ballot_item_image_url_https ?
            <img
              className="position-item__avatar"
              src={position.ballot_item_image_url_https}
              alt="candidate-photo"/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light position-item__avatar"/>
          }
        </Link>
        <div className="position-item__content">
          <Link to={ candidateLink }
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
          { position.is_for_friends_only ?
            <FriendsOnlyIndicator /> :
            null }

        </div>
        {/*Running for {office_display_name}
        <br />
          Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
          Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
        <br />*/}
      </ li>;
  }
}
