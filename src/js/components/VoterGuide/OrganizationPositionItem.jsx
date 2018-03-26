import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import ImageHandler from "../ImageHandler";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import FriendsOnlyIndicator from "../Widgets/FriendsOnlyIndicator";
import { renderLog } from "../../utils/logging";
import OfficeNameText from "../Widgets/OfficeNameText";
import OrganizationStore from "../../stores/OrganizationStore";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionRatingSnippet from "../Widgets/PositionRatingSnippet";
import PositionPublicToggle from "../Widgets/PositionPublicToggle";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";
import { capitalizeString } from "../../utils/textFormat";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";

export default class OrganizationPositionItem extends Component {
  static propTypes = {
    ballotItemLink: PropTypes.string,
    comment_text_off: PropTypes.bool,
    editMode: PropTypes.bool,
    link_to_edit_modal_off: PropTypes.bool,
    organization: PropTypes.object.isRequired,
    placement: PropTypes.string,
    position: PropTypes.object.isRequired,
    popover_off: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    turnOffLogo: PropTypes.bool,
    turnOffName: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      hide_position_statement: false,
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
      transitioning: false,
    };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organization.organization_we_vote_id),
    });
  }
  componentWillReceiveProps (nextProps) {
    // console.log("OrganizationPositionItem componentWillReceiveProps");
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    // console.log("OrganizationPositionItem _onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
      transitioning: false
    });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  togglePositionStatement (){
    this.setState({hide_position_statement: !this.state.hide_position_statement});
  }

  render () {
    renderLog(__filename);
    let position = this.props.position;
    let organization = this.state.organization;

    if (!position.ballot_item_we_vote_id) {
      // console.log("OrganizationPositionItem cannot render yet -- missing position and organization");
      return null;
    }

    let { stance_display_off, comment_text_off, popover_off, placement } = this.props;
    const { supportProps } = this.state;

    // Manage the control over this organization voter guide
    let organization_twitter_handle_being_viewed = "";
    let organization_facebook_id_being_viewed = 0;
    let organization_we_vote_id = "";
    let signed_in_with_this_organization = false;
    if (organization !== undefined) {
      organization_twitter_handle_being_viewed = organization.organization_twitter_handle !== undefined ? organization.organization_twitter_handle : "";
      organization_facebook_id_being_viewed = organization.facebook_id !== undefined ? organization.facebook_id : 0;
      organization_we_vote_id = organization.organization_we_vote_id;
      signed_in_with_this_organization = this.state.voter && this.state.voter.linked_organization_we_vote_id === organization_we_vote_id;
    }
    // console.log("signed_in_with_this_organization: ", signed_in_with_this_organization);
    var signed_in_twitter = this.state.voter === undefined ? false : this.state.voter.signed_in_twitter;
    var signed_in_with_this_twitter_account = false;
    if (signed_in_twitter && this.state.voter.twitter_screen_name !== null) {
      signed_in_with_this_twitter_account = this.state.voter.twitter_screen_name.toLowerCase() === organization_twitter_handle_being_viewed.toLowerCase();
    }
    var signed_in_facebook = this.state.voter === undefined ? false : this.state.voter.signed_in_facebook;
    var signed_in_with_this_facebook_account = false;
    if (signed_in_facebook) {
      signed_in_with_this_facebook_account = this.state.voter.facebook_id === organization_facebook_id_being_viewed;
    }

    var statement_text;
    var is_public_position;
    var is_support;
    var is_oppose;
    // If looking at your own page, update when supportProps change
    if (signed_in_with_this_twitter_account || signed_in_with_this_organization) {
      // console.log("OrganizationPositionItem signed_in_with_this_twitter_account");
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      statement_text = supportProps && supportProps.voter_statement_text ? supportProps.voter_statement_text : position.statement_text;
      is_public_position = supportProps && supportProps.is_public_position ? supportProps.is_public_position : position.is_public_position;
      is_support = supportProps && supportProps.is_support !== undefined ? supportProps.is_support : position.is_support;
      is_oppose = supportProps && supportProps.is_oppose !== undefined ? supportProps.is_oppose : position.is_oppose;
    } else {
      // console.log("OrganizationPositionItem NOT signed_in_with_this_twitter_account");
      statement_text = position.statement_text;
      is_public_position = position.is_public_position;
      is_support = position.is_support;
      is_oppose = position.is_oppose;
    }

    let ballotItemLink;
    if (this.props.ballotItemLink) {
      ballotItemLink = this.props.ballotItemLink;
    } else {
      // TwitterHandle-based link
      let ballot_item_url = position.kind_of_ballot_item === "MEASURE" ? "/measure/" : "/candidate/";
      // We are turning off links to twitter pages until we get politician pages working
      //let ballotItemLink = position.ballot_item_twitter_handle ? "/" + position.ballot_item_twitter_handle : ballot_item_url + position.ballot_item_we_vote_id;
      ballotItemLink = ballot_item_url + position.ballot_item_we_vote_id;
    }
    let position_description = "";
    let is_candidate = position.kind_of_ballot_item === "CANDIDATE";
    let ballot_item_display_name = "";
    if (position.ballot_item_display_name) {
      ballot_item_display_name = capitalizeString(position.ballot_item_display_name);
    }

    const is_on_ballot_item_page = false;
    if (position.vote_smart_rating) {
      // console.log("PositionRatingSnippet");
      position_description = <PositionRatingSnippet {...position}
                                                     popover_off={popover_off}
                                                     placement={placement} />;
    } else if (is_support || is_oppose) {
      // console.log("PositionSupportOpposeSnippet");
      // We overwrite the "statement_text" passed in with position
      position_description = <PositionSupportOpposeSnippet {...position}
                                                           statement_text={statement_text}
                                                           is_support={is_support}
                                                           is_oppose={is_oppose}
                                                           is_on_ballot_item_page={is_on_ballot_item_page}
                                                           stance_display_off={stance_display_off}
                                                           comment_text_off={comment_text_off} />;
    } else {
      // console.log("PositionInformationOnlySnippet");
      position_description = <PositionInformationOnlySnippet {...position}
                                                             is_on_ballot_item_page={is_on_ballot_item_page}
                                                             stance_display_off={stance_display_off}
                                                             comment_text_off={comment_text_off} />;
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    var contest_office_name;
    var political_party;
    if (position.kind_of_ballot_item === "CANDIDATE") {
      contest_office_name = position.contest_office_name;
      political_party = position.ballot_item_political_party;
    }
    return <li className="position-item card-child">

      { is_candidate && !this.props.turnOffLogo ?
        <div className="card-child__media-object-anchor">
          <Link to={ ballotItemLink }
                className="u-no-underline"
                onlyActiveOnIndex={false}>
            <ImageHandler
              className="card-child__avatar--round"
              sizeClassName="icon-lg "
              imageUrl={position.ballot_item_image_url_https_large}
              alt="candidate-photo"
              kind_of_ballot_item={position.kind_of_ballot_item}/>
          </Link>
        </div> :
        null
      }
      <div className="card-child__media-object-content">
        <div className="card-child__content">
          {!this.props.turnOffName ?
            <div className="u-flex items-center">
              <Link to={ ballotItemLink }
                    onlyActiveOnIndex={false}
                    className="position-rating__candidate-name u-flex-auto">
                    {ballot_item_display_name}
              </Link>

              { (signed_in_with_this_twitter_account ||
                signed_in_with_this_organization ||
                signed_in_with_this_facebook_account) &&
                this.props.editMode ?
                <PositionPublicToggle ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                  type={position.kind_of_ballot_item}
                  supportProps={supportProps}
                  className="organization-position-item-toggle"/> :
                  <FriendsOnlyIndicator isFriendsOnly={!is_public_position}/>
              }
              <BookmarkToggle we_vote_id={position.ballot_item_we_vote_id} type={position.kind_of_ballot_item} />
            </div> :
            null }
          { position.kind_of_ballot_item === "CANDIDATE" && contest_office_name !== undefined ?
            <OfficeNameText political_party={political_party} contest_office_name={contest_office_name} /> :
            null
          }
          {/* show explicit position, if available, otherwise show rating */}
          { position_description }
          { this.props.editMode ?
            <div>
              <ItemActionBar ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                             ballot_item_display_name={ballot_item_display_name}
                             commentButtonHide
                             shareButtonHide
                             supportProps={supportProps}
                             transitioning={this.state.transitioning}
                             type={position.kind_of_ballot_item}
                             toggleFunction={this.togglePositionStatement.bind(this)}
              />
              { this.state.hide_position_statement ?
                null :
                <ItemPositionStatementActionBar ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                                                ballot_item_display_name={position.ballot_item_display_name}
                                                comment_edit_mode_on
                                                stance_display_off
                                                supportProps={supportProps}
                                                transitioning={this.state.transitioning}
                                                type={position.kind_of_ballot_item} /> }
            </div> :
            null }

        </div>
      </div>
    </li>;
  }
}
