import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import EditPositionAboutCandidateModal from "../../components/VoterGuide/EditPositionAboutCandidateModal";
import FriendsOnlyIndicator from "../../components/Widgets/FriendsOnlyIndicator";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import StarAction from "../../components/Widgets/StarAction";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { showModal: false };
  }

  closeDropdown () {
    this.setState({ showModal: false });
  }

  openDropdown () {
    this.setState({ showModal: true });
  }

  render (){
    var position = this.props.position;
    let { ballot_item_display_name,
      kind_of_ballot_item,
      ballot_item_we_vote_id,
      ballot_item_image_url_https,
      ballot_item_twitter_handle,
      is_for_friends_only
    } = this.props.position;

    // TwitterHandle-based link
    let candidateLink = ballot_item_twitter_handle ? "/" + ballot_item_twitter_handle : "/candidate/" + ballot_item_we_vote_id;

    let position_description = "";
    const is_on_candidate_page = false;
    if (position.vote_smart_rating) {
        position_description =
          <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      position_description = <PositionSupportOpposeSnippet {...position} is_on_candidate_page={is_on_candidate_page} />;
    } else if (position.is_information_only) {
      position_description = <PositionInformationOnlySnippet {...position} is_on_candidate_page={is_on_candidate_page} />;
    }

    const onClick = this.state.showModal ? this.closeDropdown.bind(this) : this.openDropdown.bind(this);
    console.log("this.state.showModal: ", this.state.showModal);

    var edit_mode = true;
    return <li className="position-item">
      <StarAction we_vote_id={ballot_item_we_vote_id} type={kind_of_ballot_item} />
        <Link to={ candidateLink }
              onlyActiveOnIndex={false}>
          {/*<i className="icon-icon-add-friends-2-1 icon-light icon-medium" />*/}
          { ballot_item_image_url_https ?
            <img
              className="position-item__avatar"
              src={ballot_item_image_url_https}
              alt="candidate-photo"/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light position-item__avatar"/>
          }
        </Link>
        <div className="position-item__content">
          <Link to={ candidateLink }
                onlyActiveOnIndex={false}>
            <span className="position-rating__candidate-name">{ballot_item_display_name}</span>
          </Link>
          {/* show explicit position, if available, otherwise show rating */}
          { edit_mode ?
            <span>
              <span onClick={onClick}>
                { position_description }
              </span>
              <EditPositionAboutCandidateModal show={this.state.showModal}
                                               onHide={this.closeDropdown.bind(this)}
                                               {...this.props.position} />
            </span>:
            position_description }
          { is_for_friends_only ?
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
