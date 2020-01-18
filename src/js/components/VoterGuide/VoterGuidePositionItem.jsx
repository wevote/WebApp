import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import BallotItemVoterGuideSupportOpposeDisplay from '../Widgets/BallotItemVoterGuideSupportOpposeDisplay';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OfficeNameText from '../Widgets/OfficeNameText';
import OrganizationStore from '../../stores/OrganizationStore';
import { capitalizeString, stringContains } from '../../utils/textFormat';
import ReadMore from '../Widgets/ReadMore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
// import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';

class VoterGuidePositionItem extends Component {
  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      hidePositionStatement: false,
      voterOpposesBallotItem: false,
      voterPositionIsPublic: false,
      voterSupportsBallotItem: false,
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      signedInWithThisFacebookAccount: false,
      signedInWithThisOrganization: false,
      signedInWithThisTwitterAccount: false,
      voterTextStatement: '',
      voter: {},
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { organizationWeVoteId, position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId } = position;
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
    let voterTextStatement = '';
    let voterPositionIsPublic;
    let voterSupportsBallotItem;
    let voterOpposesBallotItem;
    // If looking at your own page, update when supportProps change
    if (signedInWithThisTwitterAccount || signedInWithThisOrganization) {
      // console.log('VoterGuidePositionItem signedInWithThisTwitterAccount');
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        ({ voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet);
      } else {
        voterOpposesBallotItem = position.is_oppose;
        voterPositionIsPublic = position.is_public_position;
        voterSupportsBallotItem = position.is_support;
        voterTextStatement = position.statement_text;
      }
    } else {
      // console.log('VoterGuidePositionItem NOT signedInWithThisTwitterAccount');
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
      voter,
    });
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    if (ballotItemWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      if (isCandidate) {
        CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      } else if (isMeasure) {
        MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
      }
      if (isCandidate || isMeasure) {
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
    }
    if (ballotItemWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
    ) {
      if (isCandidate) {
        CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
      } else if (isMeasure) {
        MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
      }
      if (isCandidate || isMeasure) {
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuidePositionItem componentWillReceiveProps');
    const { organizationWeVoteId, position } = nextProps;
    const { ballot_item_we_vote_id: ballotItemWeVoteId } = position;
    this.setState({
      organizationWeVoteId,
    });
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
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
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    // console.log('VoterGuidePositionItem, onCandidateStoreChange');
    if (isCandidate) {
      if (ballotItemWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onCandidateStoreChange, calling positionListForBallotItemPublic');
        CandidateActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (ballotItemWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onCandidateStoreChange, calling positionListForBallotItemPublic');
        CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // console.log('VoterGuidePositionItem, onMeasureStoreChange');
    if (isMeasure) {
      if (ballotItemWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onMeasureStoreChange, calling positionListForBallotItemPublic');
        MeasureActions.positionListForBallotItemPublic(ballotItemWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (ballotItemWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(ballotItemWeVoteId)
      ) {
        // console.log('VoterGuidePositionItem, onMeasureStoreChange, calling positionListForBallotItemPublic');
        MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId, voter } = this.state;
    // console.log('VoterGuidePositionItem onOrganizationStoreChange, organization.organization_we_vote_id: ', organization.organization_we_vote_id);
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
    const { ballot_item_we_vote_id: ballotItemWeVoteId } = position;
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
      // console.log('VoterGuidePositionItem signedInWithThisTwitterAccount');
      // When component first loads, use the value in the incoming position. If there are any supportProps updates, use those.
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        ({ voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet);
      } else {
        voterOpposesBallotItem = position.is_oppose;
        voterPositionIsPublic = position.is_public_position;
        voterSupportsBallotItem = position.is_support;
        voterTextStatement = position.statement_text;
      }
    } else {
      // console.log('VoterGuidePositionItem NOT signedInWithThisTwitterAccount');
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

  localPositionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (ballotItemWeVoteId) {
    if (ballotItemWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[ballotItemWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('VoterGuidePositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { position } = this.props;
    // console.log('VoterGuidePositionItem position:', position);
    let {
      ballot_item_display_name: ballotItemDisplayName,
    } = position;
    const {
      ballot_item_image_url_https_large: ballotItemImageUrlHttpsLarge,
      ballot_item_we_vote_id: ballotItemWeVoteId,
      is_information_only: organizationInformationOnlyBallotItem,
      is_oppose: organizationOpposesBallotItem,
      is_support: organizationSupportsBallotItem,
      kind_of_ballot_item: kindOfBallotItem,
      speaker_image_url_https_tiny: organizationImageUrlHttpsTiny,
      statement_text: statementText,
    } = position;
    const isCandidate = String(kindOfBallotItem) === 'CANDIDATE';
    // console.log('kindOfBallotItem:', kindOfBallotItem, 'isCandidate:', isCandidate);
    if (!ballotItemWeVoteId) {
      // console.log('VoterGuidePositionItem cannot render yet -- missing ballotItemWeVoteId');
      return null;
    }

    if (ballotItemDisplayName) {
      ballotItemDisplayName = capitalizeString(ballotItemDisplayName);
    } else {
      ballotItemDisplayName = '';
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contestOfficeName;
    // let politicalParty;
    let ballotDisplay = [];
    if (isCandidate) {
      contestOfficeName = position.contest_office_name;
      // politicalParty = position.ballot_item_political_party;
    } else {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    return (
      <Card>
        <BallotItemPadding>
          <BallotItemWrapper className="card-main__media-object">
            { isCandidate ? (
              <CandidateItemWrapper>
                <BallotItemImageWrapper>
                  <ImageHandler
                    className="card-main__avatar"
                    sizeClassName="icon-lg "
                    imageUrl={ballotItemImageUrlHttpsLarge}
                    alt="candidate-photo"
                    kind_of_ballot_item={kindOfBallotItem}
                  />
                </BallotItemImageWrapper>
                <Candidate>
                  <h2 className="card-main__display-name">
                    {ballotItemDisplayName}
                  </h2>
                  <span className="u-show-desktop-tablet">
                    { contestOfficeName && (
                      <div>
                        <OfficeNameText
                          contestOfficeName={contestOfficeName}
                          // politicalParty={politicalParty}
                          showOfficeName
                        />
                      </div>
                    )}
                  </span>
                </Candidate>
              </CandidateItemWrapper>
            ) : (
              <MeasureItemWrapper>
                <Title>
                  {ballotDisplay[0]}
                </Title>
                <SubTitle>{ballotDisplay[1]}</SubTitle>
              </MeasureItemWrapper>
            )}
            {/* (signedInWithThisTwitterAccount ||
             signedInWithThisOrganization ||
             signedInWithThisFacebookAccount) &&
             <FriendsOnlyIndicator isFriendsOnly={!voterPositionIsPublic} />
            */}
            <BallotItemSupportOpposeCountDisplayWrapper>
              <BallotItemSupportOpposeCountDisplay
                ballotItemWeVoteId={ballotItemWeVoteId}
                hideNumbersOfAllPositions
              />
              <VerticalSeparator />
              <BallotItemVoterGuideSupportOpposeDisplay
                organizationInformationOnlyBallotItem={organizationInformationOnlyBallotItem}
                organizationOpposesBallotItem={organizationOpposesBallotItem}
                organizationSupportsBallotItem={organizationSupportsBallotItem}
                organizationImageUrlHttpsTiny={organizationImageUrlHttpsTiny}
                positionItem={position}
              />
            </BallotItemSupportOpposeCountDisplayWrapper>
            {' '}
          </BallotItemWrapper>
          <span className="u-show-mobile">
            { contestOfficeName && (
              <div>
                <OfficeNameText
                  contestOfficeName={contestOfficeName}
                  // politicalParty={politicalParty}
                  showOfficeName
                />
              </div>
            )}
            {statementText && (
              <MobileItemDescription>
                {organizationImageUrlHttpsTiny && (
                  <OrganizationImageWrapper>
                    <ImageHandler
                      sizeClassName="image-24x24 "
                      imageUrl={organizationImageUrlHttpsTiny}
                      alt="organization-photo"
                      kind_of_ballot_item="ORGANIZATION"
                    />
                  </OrganizationImageWrapper>
                )}
                <ReadMore
                  textToDisplay={statementText}
                  numberOfLines={4}
                />
              </MobileItemDescription>
            )}
          </span>
          <span className="u-show-desktop-tablet">
            {statementText && (
              <DesktopItemDescription>
                {organizationImageUrlHttpsTiny && (
                  <OrganizationImageWrapper>
                    <ImageHandler
                      sizeClassName="image-24x24 "
                      imageUrl={organizationImageUrlHttpsTiny}
                      alt="organization-photo"
                      kind_of_ballot_item="ORGANIZATION"
                    />
                  </OrganizationImageWrapper>
                )}
                <ReadMore
                  textToDisplay={statementText}
                  numberOfLines={3}
                />
              </DesktopItemDescription>
            )}
          </span>
        </BallotItemPadding>
      </Card>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const CandidateItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
`;

const BallotItemImageWrapper = styled.span`
  padding-right: 10px;
`;

const OrganizationImageWrapper = styled.span`
  padding-right: 4px;
`;

const BallotItemPadding = styled.div`
  padding: 15px;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const BallotItemSupportOpposeCountDisplayWrapper = styled.div`
  cursor: pointer;
  display: flex;
  float: right;
`;

const BallotItemWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: 2px;
  }
`;

const Candidate = styled.div`
`;

const DesktopItemDescription = styled.div`
  font-size: 16px;
  border-radius: 5px;
  list-style: none;
  padding: 6px;
  background: #eee;
  flex: 1 1 0;
`;

const MeasureItemWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  border-radius: 2px;
  list-style: none;
  padding: 4px;
  background: #eee;
  flex: 1 1 0;
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-top: .6rem;
  width: 135%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

const VerticalSeparator = styled.div`
  height: 44px;
  width: 2px;
  background: #ccc;
  margin: 0 4px;
`;

export default withStyles(styles)(VoterGuidePositionItem);
