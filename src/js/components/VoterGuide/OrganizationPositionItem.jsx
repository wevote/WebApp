import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ImageHandler from '../ImageHandler';
import ItemActionBar from '../Widgets/ItemActionBar';
import ItemPositionStatementActionBar from '../Widgets/ItemPositionStatementActionBar';
import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import OrganizationStore from '../../stores/OrganizationStore';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import { capitalizeString } from '../../utils/textFormat';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';

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
      hidePositionStatement: false,
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
      transitioning: false,
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
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

  onOrganizationStoreChange () {
    const { organization } = this.state;
    // console.log("OrganizationPositionItem onOrganizationStoreChange, organization.organization_we_vote_id: ", organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    const { organization } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.position.ballot_item_we_vote_id),
      transitioning: false,
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  togglePositionStatement () {
    const { hidePositionStatement } = this.state;
    this.setState({ hidePositionStatement: !hidePositionStatement });
  }

  render () {
    renderLog(__filename);
    const { position } = this.props;
    const { organization } = this.state;

    if (!position.ballot_item_we_vote_id) {
      // console.log("OrganizationPositionItem cannot render yet -- missing position and organization");
      return null;
    }

    const {
      stance_display_off: stanceDisplayOff, comment_text_off: commentTextOff,
    } = this.props;
    const { supportProps } = this.state;

    // Manage the control over this organization voter guide
    let organizationTwitterHandleBeingViewed = '';
    let organizationFacebookIdBeingViewed = 0;
    let organizationWeVoteId = '';
    let signedInWithThisOrganization = false;
    if (organization !== undefined) {
      organizationTwitterHandleBeingViewed = organization.organization_twitter_handle !== undefined ? organization.organization_twitter_handle : '';
      organizationFacebookIdBeingViewed = organization.facebook_id !== undefined ? organization.facebook_id : 0;
      organizationWeVoteId = organization.organization_we_vote_id;
      signedInWithThisOrganization = this.state.voter && this.state.voter.linked_organization_we_vote_id === organizationWeVoteId;
    }
    // console.log("signedInWithThisOrganization: ", signedInWithThisOrganization);
    const signedInTwitter = this.state.voter === undefined ? false : this.state.voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter && this.state.voter.twitter_screen_name !== null) {
      signedInWithThisTwitterAccount = this.state.voter.twitter_screen_name.toLowerCase() === organizationTwitterHandleBeingViewed.toLowerCase();
    }
    const signedInFacebook = this.state.voter === undefined ? false : this.state.voter.signed_in_facebook;
    let signedInWithThisFacebookAccount = false;
    if (signedInFacebook) {
      signedInWithThisFacebookAccount = this.state.voter.facebook_id === organizationFacebookIdBeingViewed;
    }

    let statementText;
    let isPublicPosition;
    let isSupport;
    let isOppose;
    // If looking at your own page, update when supportProps change
    if (signedInWithThisTwitterAccount || signedInWithThisOrganization) {
      // console.log("OrganizationPositionItem signedInWithThisTwitterAccount");
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      isOppose = supportProps && supportProps.is_oppose !== undefined ? supportProps.is_oppose : position.is_oppose;
      isPublicPosition = supportProps && supportProps.is_public_position ? supportProps.is_public_position : position.is_public_position;
      isSupport = supportProps && supportProps.is_support !== undefined ? supportProps.is_support : position.is_support;
      statementText = supportProps && supportProps.voter_statement_text ? supportProps.voter_statement_text : position.statement_text;
    } else {
      // console.log("OrganizationPositionItem NOT signedInWithThisTwitterAccount");
      isOppose = position.is_oppose;
      isPublicPosition = position.is_public_position;
      isSupport = position.is_support;
      statementText = position.statement_text;
    }

    let { ballotItemLink } = this.props;
    if (!ballotItemLink) {
      // TwitterHandle-based link
      const ballotItemUrl = position.kind_of_ballot_item === 'MEASURE' ? '/measure/' : '/candidate/';
      // We are turning off links to twitter pages until we get politician pages working
      // let ballotItemLink = position.ballot_item_twitter_handle ? "/" + position.ballot_item_twitter_handle : ballotItemUrl + position.ballot_item_we_vote_id;
      ballotItemLink = ballotItemUrl + position.ballot_item_we_vote_id;
    }
    let positionDescription = '';
    const isCandidate = position.kind_of_ballot_item === 'CANDIDATE';
    let ballotItemDisplayName = '';
    if (position.ballot_item_display_name) {
      ballotItemDisplayName = capitalizeString(position.ballot_item_display_name);
    }

    const isOnBallotItemPage = false;
    if (position.vote_smart_rating) {
      // console.log("PositionRatingSnippet");
      positionDescription = (
        <PositionRatingSnippet
          {...position}
        />
      );
    } else if (isSupport || isOppose) {
      // console.log("PositionSupportOpposeSnippet");
      // We overwrite the "statementText" passed in with position
      positionDescription = (
        <PositionSupportOpposeSnippet
          {...position}
          statement_text={statementText}
          is_support={isSupport}
          is_oppose={isOppose}
          is_on_ballot_item_page={isOnBallotItemPage}
          stance_display_off={stanceDisplayOff}
          comment_text_off={commentTextOff}
        />
      );
    } else {
      // console.log("PositionInformationOnlySnippet");
      positionDescription = (
        <PositionInformationOnlySnippet
          {...position}
          is_on_ballot_item_page={isOnBallotItemPage}
          stance_display_off={stanceDisplayOff}
          comment_text_off={commentTextOff}
        />
      );
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contestOfficeName;
    let politicalParty;
    if (position.kind_of_ballot_item === 'CANDIDATE') {
      contestOfficeName = position.contest_office_name;
      politicalParty = position.ballot_item_political_party;
    }
    return (
      <li className="position-item card-child">
        { isCandidate && !this.props.turnOffLogo ? (
          <div className="card-child__media-object-anchor">
            <Link
              to={ballotItemLink}
              className="u-no-underline"
              onlyActiveOnIndex={false}
            >
              <ImageHandler
                className="card-child__avatar--round"
                sizeClassName="icon-lg "
                imageUrl={position.ballot_item_image_url_https_large}
                alt="candidate-photo"
                kind_of_ballot_item={position.kind_of_ballot_item}
              />
            </Link>
          </div>
        ) : null
        }
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            {!this.props.turnOffName ? (
              <div className="u-flex items-center">
                <Link
                  to={ballotItemLink}
                  onlyActiveOnIndex={false}
                  className="position-rating__candidate-name u-flex-auto"
                >
                  {ballotItemDisplayName}
                </Link>
                { (signedInWithThisTwitterAccount ||
                signedInWithThisOrganization ||
                signedInWithThisFacebookAccount) &&
                this.props.editMode ?
                  <FriendsOnlyIndicator isFriendsOnly={!isPublicPosition} /> :
                  <FriendsOnlyIndicator isFriendsOnly={!isPublicPosition} />
              }
              </div>
            ) : null
            }
            { position.kind_of_ballot_item === 'CANDIDATE' && contestOfficeName !== undefined ? (
              <OfficeNameText
                politicalParty={politicalParty}
                contestOfficeName={contestOfficeName}
              />
            ) : null
            }
            {/* show explicit position, if available, otherwise show rating */}
            { positionDescription }
            { this.props.editMode ? (
              <div>
                <ItemActionBar
                  ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                  ballotItemDisplayName={ballotItemDisplayName}
                  commentButtonHide
                  shareButtonHide
                  supportProps={supportProps}
                  transitioning={this.state.transitioning}
                  type={position.kind_of_ballot_item}
                  toggleFunction={this.togglePositionStatement}
                />
                { this.state.hidePositionStatement ?
                  null : (
                    <ItemPositionStatementActionBar
                      ballot_item_we_vote_id={position.ballot_item_we_vote_id}
                      ballotItemDisplayName={position.ballot_item_display_name}
                      comment_edit_mode_on
                      stance_display_off={stanceDisplayOff}
                      supportProps={supportProps}
                      transitioning={this.state.transitioning}
                      type={position.kind_of_ballot_item}
                    />
                  )}
              </div>
            ) : null
            }
          </div>
        </div>
      </li>
    );
  }
}
