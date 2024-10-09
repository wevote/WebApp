import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';
import ItemPositionStatementActionBar from '../Widgets/ItemPositionStatementActionBar';
import PositionInformationOnlySnippet from '../PositionItem/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../PositionItem/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../PositionItem/PositionSupportOpposeSnippet';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../common/components/Widgets/OfficeNameText'));


export default class OrganizationPositionItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      hidePositionStatement: false,
      voterOpposesBallotItem: false,
      voterPositionIsPublic: false,
      voterSupportsBallotItem: false,
      organizationWeVoteId: '',
      signedInWithThisFacebookAccount: false,
      signedInWithThisOrganization: false,
      signedInWithThisTwitterAccount: false,
      voterTextStatement: '',
      transitioning: false,
      voter: {},
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { organizationWeVoteId, position } = this.props;
    const voter = VoterStore.getVoter();
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    const organizationFacebookIdBeingViewed = organization.facebook_id !== undefined ? organization.facebook_id : 0;
    const organizationTwitterHandleBeingViewed = organization.organization_twitter_handle !== undefined ? organization.organization_twitter_handle : '';
    const signedInWithThisOrganization = voter && voter.linked_organization_we_vote_id === organizationWeVoteId;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter && voter.twitter_screen_name !== null) {
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === organizationTwitterHandleBeingViewed.toLowerCase();
    }
    const signedInFacebook = voter === undefined ? false : voter.signed_in_facebook;
    let signedInWithThisFacebookAccount = false;
    if (signedInFacebook) {
      signedInWithThisFacebookAccount = voter.facebook_id === organizationFacebookIdBeingViewed;
    }
    let voterTextStatement;
    let voterPositionIsPublic;
    let voterSupportsBallotItem;
    let voterOpposesBallotItem;
    // If looking at your own page, update when supportProps change
    if (signedInWithThisTwitterAccount || signedInWithThisOrganization) {
      // console.log('OrganizationPositionItem signedInWithThisTwitterAccount');
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(position.ballot_item_we_vote_id);
      if (ballotItemStatSheet) {
        ({ voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet);
      } else {
        voterOpposesBallotItem = position.is_oppose;
        voterPositionIsPublic = position.is_public_position;
        voterSupportsBallotItem = position.is_support;
        voterTextStatement = position.statement_text;
      }
    } else {
      // console.log('OrganizationPositionItem NOT signedInWithThisTwitterAccount');
      voterOpposesBallotItem = position.is_oppose;
      voterPositionIsPublic = position.is_public_position;
      voterSupportsBallotItem = position.is_support;
      voterTextStatement = position.statement_text;
    }
    this.setState({
      componentDidMountFinished: true,
      voterOpposesBallotItem,
      voterPositionIsPublic,
      voterSupportsBallotItem,
      organizationWeVoteId,
      signedInWithThisFacebookAccount,
      signedInWithThisOrganization,
      signedInWithThisTwitterAccount,
      voterTextStatement,
      transitioning: false,
      voter,
    });

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('OrganizationPositionItem componentWillReceiveProps');
    const { organizationWeVoteId, position } = nextProps;
    this.setState({
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(position.ballot_item_we_vote_id);
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;
      this.setState({
        voterOpposesBallotItem,
        voterPositionIsPublic,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
      // console.log('this.state.voterOpposesBallotItem:', this.state.voterOpposesBallotItem, ', nextState.voterOpposesBallotItem:', nextState.voterOpposesBallotItem);
      return true;
    }
    if (this.state.voterPositionIsPublic !== nextState.voterPositionIsPublic) {
      // console.log('this.state.voterPositionIsPublic:', this.state.voterPositionIsPublic, ', nextState.voterPositionIsPublic:', nextState.voterPositionIsPublic);
      return true;
    }
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
      // console.log('this.state.voterSupportsBallotItem:', this.state.voterSupportsBallotItem, ', nextState.voterSupportsBallotItem:', nextState.voterSupportsBallotItem);
      return true;
    }
    if (this.state.organizationFacebookIdBeingViewed !== nextState.organizationFacebookIdBeingViewed) {
      // console.log('this.state.organizationFacebookIdBeingViewed:', this.state.organizationFacebookIdBeingViewed, ', nextState.organizationFacebookIdBeingViewed:', nextState.organizationFacebookIdBeingViewed);
      return true;
    }
    if (this.state.organizationTwitterHandleBeingViewed !== nextState.organizationTwitterHandleBeingViewed) {
      // console.log('this.state.organizationTwitterHandleBeingViewed:', this.state.organizationTwitterHandleBeingViewed, ', nextState.organizationTwitterHandleBeingViewed:', nextState.organizationTwitterHandleBeingViewed);
      return true;
    }
    if (this.state.signedInWithThisFacebookAccount !== nextState.signedInWithThisFacebookAccount) {
      // console.log('this.state.signedInWithThisFacebookAccount:', this.state.signedInWithThisFacebookAccount, ', nextState.signedInWithThisFacebookAccount:', nextState.signedInWithThisFacebookAccount);
      return true;
    }
    if (this.state.signedInWithThisOrganization !== nextState.signedInWithThisOrganization) {
      // console.log('this.state.signedInWithThisOrganization:', this.state.signedInWithThisOrganization, ', nextState.signedInWithThisOrganization:', nextState.signedInWithThisOrganization);
      return true;
    }
    if (this.state.signedInWithThisTwitterAccount !== nextState.signedInWithThisTwitterAccount) {
      // console.log('this.state.signedInWithThisTwitterAccount:', this.state.signedInWithThisTwitterAccount, ', nextState.signedInWithThisTwitterAccount:', nextState.signedInWithThisTwitterAccount);
      return true;
    }
    if (this.state.voterTextStatement !== nextState.voterTextStatement) {
      // console.log('this.state.voterTextStatement:', this.state.voterTextStatement, ', nextState.voterTextStatement:', nextState.voterTextStatement);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId, voter } = this.state;
    // console.log('OrganizationPositionItem onOrganizationStoreChange, organization.organization_we_vote_id: ', organization.organization_we_vote_id);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationFacebookIdBeingViewed = organization.facebook_id !== undefined ? organization.facebook_id : 0;
      const organizationTwitterHandleBeingViewed = organization.organization_twitter_handle !== undefined ? organization.organization_twitter_handle : '';
      const signedInWithThisOrganization = voter && voter.linked_organization_we_vote_id === organizationWeVoteId;
      this.setState({
        organizationFacebookIdBeingViewed,
        organizationTwitterHandleBeingViewed,
        organizationWeVoteId,
        signedInWithThisOrganization,
      });
    }
  }

  onSupportStoreChange () {
    const { position } = this.props;
    const { organizationWeVoteId, signedInWithThisTwitterAccount, signedInWithThisOrganization } = this.state;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationFacebookIdBeingViewed = organization.facebook_id !== undefined ? organization.facebook_id : 0;
      const organizationTwitterHandleBeingViewed = organization.organization_twitter_handle !== undefined ? organization.organization_twitter_handle : '';
      this.setState({
        organizationFacebookIdBeingViewed,
        organizationTwitterHandleBeingViewed,
        organizationWeVoteId,
      });
    }
    let voterTextStatement;
    let voterPositionIsPublic;
    let voterSupportsBallotItem;
    let voterOpposesBallotItem;
    // If looking at your own page, update when supportProps change
    if (signedInWithThisTwitterAccount || signedInWithThisOrganization) {
      // console.log('OrganizationPositionItem signedInWithThisTwitterAccount');
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(position.ballot_item_we_vote_id);
      if (ballotItemStatSheet) {
        ({ voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet);
      } else {
        voterOpposesBallotItem = position.is_oppose;
        voterPositionIsPublic = position.is_public_position;
        voterSupportsBallotItem = position.is_support;
        voterTextStatement = position.statement_text;
      }
    } else {
      // console.log('OrganizationPositionItem NOT signedInWithThisTwitterAccount');
      voterOpposesBallotItem = position.is_oppose;
      voterPositionIsPublic = position.is_public_position;
      voterSupportsBallotItem = position.is_support;
      voterTextStatement = position.statement_text;
    }
    this.setState({
      voterOpposesBallotItem,
      voterPositionIsPublic,
      voterSupportsBallotItem,
      voterTextStatement,
      transitioning: false,
    });
  }

  onVoterStoreChange () {
    const { organizationFacebookIdBeingViewed, organizationTwitterHandleBeingViewed, organizationWeVoteId } = this.state;
    const voter = VoterStore.getVoter();
    const signedInWithThisOrganization = voter && voter.linked_organization_we_vote_id === organizationWeVoteId;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter && voter.twitter_screen_name !== null) {
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === organizationTwitterHandleBeingViewed.toLowerCase();
    }
    const signedInFacebook = voter === undefined ? false : voter.signed_in_facebook;
    let signedInWithThisFacebookAccount = false;
    if (signedInFacebook) {
      signedInWithThisFacebookAccount = voter.facebook_id === organizationFacebookIdBeingViewed;
    }
    this.setState({
      signedInWithThisFacebookAccount,
      signedInWithThisOrganization,
      signedInWithThisTwitterAccount,
      voter,
    });
  }

  togglePositionStatement () {
    const { hidePositionStatement } = this.state;
    this.setState({ hidePositionStatement: !hidePositionStatement });
  }

  render () {
    renderLog('OrganizationPositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OrganizationPositionItem');
    const { commentTextOff, position, stanceDisplayOff } = this.props;
    const {
      voterOpposesBallotItem,
      voterPositionIsPublic,
      voterSupportsBallotItem,
      signedInWithThisFacebookAccount,
      signedInWithThisOrganization,
      signedInWithThisTwitterAccount,
      voterTextStatement,
    } = this.state;

    const {
      ballot_item_we_vote_id: ballotItemWeVoteId,
      kind_of_ballot_item: kindOfBallotItem,
      ballot_item_display_name: ballotItemDisplayName,
      vote_smart_rating: voteSmartRating,
      vote_smart_time_span: voteSmartTimeSpan,
      show_rating_description: showRatingDescription,
      is_looking_at_self: isLookingAtSelf,
      more_info_url: moreInfoUrl,
      speaker_display_name: speakerDisplayName,
      statement_text: statementText,
    } = position;

    if (!ballotItemWeVoteId) {
      // console.log('OrganizationPositionItem cannot render yet -- missing ballotItemWeVoteId');
      return null;
    }

    let { ballotItemLink } = this.props;
    if (!ballotItemLink) {
      // TwitterHandle-based link
      const ballotItemUrl = kindOfBallotItem === 'MEASURE' ? '/measure/' : '/candidate/';
      // We are turning off links to twitter pages until we get politician pages working
      // let ballotItemLink = position.ballot_item_twitter_handle ? '/' + position.ballot_item_twitter_handle : ballotItemUrl + ballotItemWeVoteId;
      ballotItemLink = ballotItemUrl + ballotItemWeVoteId;
    }
    let positionDescription;
    const isCandidate = kindOfBallotItem === 'CANDIDATE';
    const ballotItemDisplayNameCaps = ballotItemDisplayName ? toTitleCase(ballotItemDisplayName) : '';

    const isOnBallotItemPage = false;
    if (voteSmartRating) {
      // console.log('OrganizationPositionItem PositionRatingSnippet');
      positionDescription = (
        <PositionRatingSnippet
          ballotItemDisplayName={ballotItemDisplayNameCaps}
          voteSmartRating={voteSmartRating}
          voteSmartTimeSpan={voteSmartTimeSpan}
          showRatingDescription={showRatingDescription}
        />
      );
    } else if (voterSupportsBallotItem || voterOpposesBallotItem) {
      // console.log('OrganizationPositionItem PositionSupportOpposeSnippet');
      // We overwrite the 'voterTextStatement' passed in with position
      positionDescription = (
        <PositionSupportOpposeSnippet
          commentTextOff={commentTextOff}
          isLookingAtSelf={isLookingAtSelf}
          isOnBallotItemPage={isOnBallotItemPage}
          isOppose={voterOpposesBallotItem}
          isSupport={voterSupportsBallotItem}
          moreInfoUrl={moreInfoUrl}
          speakerDisplayName={speakerDisplayName}
          stanceDisplayOff={stanceDisplayOff}
          statementText={voterTextStatement}
        />
      );
    } else {
      // console.log('OrganizationPositionItem PositionInformationOnlySnippet');
      positionDescription = (
        <PositionInformationOnlySnippet
          ballotItemDisplayName={ballotItemDisplayName}
          commentTextOff={commentTextOff}
          isLookingAtSelf={isLookingAtSelf}
          isOnBallotItemPage={isOnBallotItemPage}
          moreInfoUrl={moreInfoUrl}
          speakerDisplayName={speakerDisplayName}
          stanceDisplayOff={stanceDisplayOff}
          statementText={statementText}
        />
      );
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contestOfficeName;
    let politicalParty;
    if (kindOfBallotItem === 'CANDIDATE') {
      contestOfficeName = position.contest_office_name;
      politicalParty = position.ballot_item_political_party;
    }
    return (
      <li className="position-item card-child">
        { isCandidate && !this.props.turnOffLogo && (
          <div className="card-child__media-object-anchor">
            <Link
              to={ballotItemLink}
              className="u-no-underline"
            >
              <Suspense fallback={<></>}>
                <ImageHandler
                  className="card-child__avatar--round"
                  sizeClassName="icon-lg "
                  imageUrl={position.ballot_item_image_url_https_large}
                  alt=""
                  kind_of_ballot_item={kindOfBallotItem}
                />
              </Suspense>
            </Link>
          </div>
        )}
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            {!this.props.turnOffName ? (
              <div className="u-flex items-center">
                <Link
                  to={ballotItemLink}
                  className="position-rating__candidate-name u-flex-auto"
                >
                  {ballotItemDisplayNameCaps}
                </Link>
                { (signedInWithThisTwitterAccount ||
                  signedInWithThisOrganization ||
                  signedInWithThisFacebookAccount) &&
                  <FriendsOnlyIndicator isFriendsOnly={!voterPositionIsPublic} />}
              </div>
            ) : null}
            { kindOfBallotItem === 'CANDIDATE' && contestOfficeName !== undefined ? (
              <Suspense fallback={<></>}>
                <OfficeNameText
                  inCard
                  officeName={contestOfficeName}
                  politicalParty={politicalParty}
                />
              </Suspense>
            ) : null}
            {/* show explicit position, if available, otherwise show rating */}
            { positionDescription }
            { this.props.editMode ? (
              <div>
                <Suspense fallback={<></>}>
                  <ItemActionBar
                    inModal={this.props.inModal}
                    ballotItemWeVoteId={ballotItemWeVoteId}
                    ballotItemDisplayName={ballotItemDisplayNameCaps}
                    commentButtonHide
                    externalUniqueId={`organizationPositionItem-${ballotItemWeVoteId}`}
                    shareButtonHide
                    transitioning={this.state.transitioning}
                    togglePositionStatementFunction={this.togglePositionStatement}
                  />
                </Suspense>
                { this.state.hidePositionStatement ?
                  null : (
                    <ItemPositionStatementActionBar
                      ballotItemWeVoteId={ballotItemWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayNameCaps}
                      commentEditModeOn
                      externalUniqueId="organizationPositionItem"
                      transitioning={this.state.transitioning}
                      ballotItemType={kindOfBallotItem}
                    />
                  )}
              </div>
            ) : null}
          </div>
        </div>
      </li>
    );
  }
}
OrganizationPositionItem.propTypes = {
  ballotItemLink: PropTypes.string,
  commentTextOff: PropTypes.bool,
  editMode: PropTypes.bool,
  organizationWeVoteId: PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  stanceDisplayOff: PropTypes.bool,
  turnOffLogo: PropTypes.bool,
  turnOffName: PropTypes.bool,
  inModal: PropTypes.bool,
};
