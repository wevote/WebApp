import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ImageHandler from "../ImageHandler";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";
import OfficeNameText from "../Widgets/OfficeNameText";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionPublicToggle from "../Widgets/PositionPublicToggle";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class VoterPositionItem extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired,
    link_to_edit_modal_off: PropTypes.bool,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
    popover_off: PropTypes.bool,
    placement: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      supportProps: {},
    };
  }

  componentWillMount () {
    this.setState({
      // showEditPositionModal: false,
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
    });
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onSupportStoreChange () {
    const { position } = this.props;
    // console.log("position:", position);
    this.setState({
      supportProps: SupportStore.get(position.ballot_item_we_vote_id),
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);

    const {
      position, stance_display_off: stanceDisplayOff, comment_text_off: commentTextOff,
    } = this.props;
    const { supportProps } = this.state;

    const isLookingAtSelf = true;
    // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
    const statementText = supportProps && supportProps.voter_statement_text ? supportProps.voter_statement_text : position.statement_text;
    const isSupport = supportProps && supportProps.is_support ? supportProps.is_support : position.is_support;
    const isOppose = supportProps && supportProps.is_oppose ? supportProps.is_oppose : position.is_oppose;

    // TwitterHandle-based link
    const ballotItemUrl = position.kind_of_ballot_item === "MEASURE" ? "/measure/" : "/candidate/";
    const ballotItemLink = ballotItemUrl + position.ballot_item_we_vote_id;
    let positionDescription = "";
    const isCandidate = position.kind_of_ballot_item === "CANDIDATE";
    let ballotItemDisplayName = "";
    if (position.ballot_item_display_name) {
      ballotItemDisplayName = capitalizeString(position.ballot_item_display_name);
    }

    const isOnBallotItemPage = false;
    if (isSupport || isOppose) {
      // We overwrite the "statementText" passed in with position
      positionDescription = (
        <PositionSupportOpposeSnippet
          {...position}
          comment_text_off={commentTextOff}
          is_support={isSupport}
          is_oppose={isOppose}
          is_on_ballot_item_page={isOnBallotItemPage}
          is_looking_at_self={isLookingAtSelf}
          stance_display_off={stanceDisplayOff}
          statement_text={statementText}
        />
      );
    } else {
      positionDescription = (
        <PositionInformationOnlySnippet
          {...position}
          comment_text_off={commentTextOff}
          is_on_ballot_item_page={isOnBallotItemPage}
          is_looking_at_self={isLookingAtSelf}
          stance_display_off={stanceDisplayOff}
        />
      );
    }

    let contestOfficeName;
    let politicalParty;
    if (position.kind_of_ballot_item === "CANDIDATE") {
      contestOfficeName = position.contest_office_name;
      politicalParty = position.ballot_item_political_party;
    }
    return (
      <li className="position-item card-child">
        <div className="card-child__media-object-anchor">
          <Link
            to={ballotItemLink}
            className="u-no-underline"
            onlyActiveOnIndex={false}
          >
            {/* <i className="icon-icon-add-friends-2-1 icon-light icon-medium" /> */}
            { isCandidate ? (
              <ImageHandler
                className="card-child__avatar--round"
                sizeClassName="icon-lg "
                imageUrl={position.ballot_item_image_url_https_large}
                alt="candidate-photo"
                kind_of_ballot_item={position.kind_of_ballot_item}
              />
            ) : null
            }
          </Link>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <Link
              to={ballotItemLink}
              onlyActiveOnIndex={false}
            >
              <span className="position-rating__candidate-name">{ballotItemDisplayName}</span>
            </Link>
            <br />
            { position.kind_of_ballot_item === "CANDIDATE" && contestOfficeName !== undefined ? (
              <OfficeNameText
                politicalParty={politicalParty}
                contestOfficeName={contestOfficeName}
              />
            ) : null
            }
            {positionDescription}
            <PositionPublicToggle
              ballot_item_we_vote_id={position.ballot_item_we_vote_id}
              type={position.kind_of_ballot_item}
              supportProps={supportProps}
              className="organization-position-item-toggle"
            />
          </div>
        </div>
      </li>
    );
  }
}
