import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionPublicToggle from '../Widgets/PositionPublicToggle';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';

export default class VoterPositionItem extends Component {
  static propTypes = {
    comment_text_off: PropTypes.bool,
    externalUniqueId: PropTypes.string,
    stance_display_off: PropTypes.bool,
    placement: PropTypes.string,
    popover_off: PropTypes.bool,
    position: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      voterTextStatement: '',
    };
  }

  componentWillMount () {
    this.onSupportStoreChange();
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
    let voterSupportsBallotItem = false;
    let voterOpposesBallotItem = false;
    let voterTextStatement = '';

    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(position.ballot_item_we_vote_id);
    if (ballotItemStatSheet) {
      ({
        voterOpposesBallotItem,
        voterSupportsBallotItem,
        voterTextStatement,
      } = ballotItemStatSheet);
    }

    // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
    const voterTextStatement2 = voterTextStatement || position.statement_text;
    const voterSupportsBallotItem2 = voterSupportsBallotItem || position.is_support;
    const voterOpposesBallotItem2 = voterOpposesBallotItem || position.is_oppose;

    this.setState({
      voterOpposesBallotItem: voterOpposesBallotItem2,
      voterSupportsBallotItem: voterSupportsBallotItem2,
      voterTextStatement: voterTextStatement2,
    });
  }

  onVoterStoreChange () {
    this.setState();
  }

  render () {
    renderLog('VoterPositionItem');  // Set LOG_RENDER_EVENTS to log all renders

    const {
      position, stance_display_off: stanceDisplayOff, comment_text_off: commentTextOff,
    } = this.props;
    const { voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = this.state;
    const isLookingAtSelf = true;

    // TwitterHandle-based link
    const ballotItemUrl = position.kind_of_ballot_item === 'MEASURE' ? '/measure/' : '/candidate/';
    const ballotItemLink = ballotItemUrl + position.ballot_item_we_vote_id;
    let positionDescription = '';
    const isCandidate = position.kind_of_ballot_item === 'CANDIDATE';
    let ballotItemDisplayName = '';
    if (position.ballot_item_display_name) {
      ballotItemDisplayName = capitalizeString(position.ballot_item_display_name);
    }

    const isOnBallotItemPage = false;
    if (voterSupportsBallotItem || voterOpposesBallotItem) {
      // We overwrite the "voterTextStatement" passed in with position
      positionDescription = (
        <PositionSupportOpposeSnippet
          {...position}
          comment_text_off={commentTextOff}
          is_support={voterSupportsBallotItem}
          is_oppose={voterOpposesBallotItem}
          is_on_ballot_item_page={isOnBallotItemPage}
          is_looking_at_self={isLookingAtSelf}
          stance_display_off={stanceDisplayOff}
          statement_text={voterTextStatement}
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
    if (position.kind_of_ballot_item === 'CANDIDATE') {
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
            { position.kind_of_ballot_item === 'CANDIDATE' && contestOfficeName !== undefined ? (
              <OfficeNameText
                politicalParty={politicalParty}
                contestOfficeName={contestOfficeName}
              />
            ) : null
            }
            {positionDescription}
            <PositionPublicToggle
              ballotItemWeVoteId={position.ballot_item_we_vote_id}
              className="organization-position-item-toggle"
              externalUniqueId={`voterPositionItem-${this.props.externalUniqueId}`}
              type={position.kind_of_ballot_item}
            />
          </div>
        </div>
      </li>
    );
  }
}
