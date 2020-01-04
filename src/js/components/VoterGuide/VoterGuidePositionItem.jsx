import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/esm/Card';
import { withStyles } from '@material-ui/core/esm/styles';
// import BallotItemVoterGuideSupportOpposeDisplay from '../Widgets/BallotItemVoterGuideSupportOpposeDisplay';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import ImageHandler from '../ImageHandler';
import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import OrganizationStore from '../../stores/OrganizationStore';
import { capitalizeString } from '../../utils/textFormat';
import ReadMore from '../Widgets/ReadMore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';

class VoterGuidePositionItem extends Component {
  static propTypes = {
    ballotItemLink: PropTypes.string,
    classes: PropTypes.object,
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
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
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

  render () {
    renderLog('VoterGuidePositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { position } = this.props;
    // console.log('VoterGuidePositionItem position:', position);
    const {
      // voterOpposesBallotItem,
      voterPositionIsPublic,
      // voterSupportsBallotItem,
      signedInWithThisFacebookAccount,
      signedInWithThisOrganization,
      signedInWithThisTwitterAccount,
      // voterTextStatement,
    } = this.state;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, kind_of_ballot_item: kindOfBallotItem, statement_text: statementText } = position;
    let { ballot_item_display_name: ballotItemDisplayName } = position;

    if (!ballotItemWeVoteId) {
      // console.log('VoterGuidePositionItem cannot render yet -- missing ballotItemWeVoteId');
      return null;
    }

    let { ballotItemLink } = this.props;
    if (!ballotItemLink) {
      // TwitterHandle-based link
      const ballotItemUrl = String(kindOfBallotItem) === 'MEASURE' ? '/measure/' : '/candidate/';
      // We are turning off links to twitter pages until we get politician pages working
      // let ballotItemLink = position.ballot_item_twitter_handle ? '/' + position.ballot_item_twitter_handle : ballotItemUrl + ballotItemWeVoteId;
      ballotItemLink = ballotItemUrl + ballotItemWeVoteId;
    }
    const isCandidate = String(kindOfBallotItem) === 'CANDIDATE';
    if (ballotItemDisplayName) {
      ballotItemDisplayName = capitalizeString(ballotItemDisplayName);
    } else {
      ballotItemDisplayName = '';
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    let contestOfficeName;
    let politicalParty;
    let ballotDisplay = [];
    if (isCandidate) {
      contestOfficeName = position.contest_office_name;
      politicalParty = position.ballot_item_political_party;
    } else {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    return (
      <Card>
        <BallotItemPadding>
          <BallotItemWrapper className="card-main__media-object">
            <BallotItemInfo>
              { isCandidate ? (
                <>
                  <BallotItemImageWrapper>
                    <ImageHandler
                      className="card-main__avatar"
                      sizeClassName="icon-lg "
                      imageUrl={position.ballot_item_image_url_https_large}
                      alt="candidate-photo"
                      kind_of_ballot_item={kindOfBallotItem}
                    />
                  </BallotItemImageWrapper>
                  <Candidate>
                    <h2 className="card-main__display-name">
                      {ballotItemDisplayName}
                    </h2>
                    {/* !!(twitterFollowersCount) && (
                      <span
                        className="u-show-desktop twitter-followers__badge u-cursor--pointer"
                      >
                        <span className="fab fa-twitter fa-sm" />
                        <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                      </span>
                    ) */}
                    { (signedInWithThisTwitterAccount ||
                     signedInWithThisOrganization ||
                     signedInWithThisFacebookAccount) &&
                     <FriendsOnlyIndicator isFriendsOnly={!voterPositionIsPublic} />
                    }
                    <span className="u-show-desktop">
                      { !!(contestOfficeName) && (
                        <p>
                          <OfficeNameText
                            contestOfficeName={contestOfficeName}
                            politicalParty={politicalParty}
                            showOfficeName
                          />
                        </p>
                      )}
                    </span>
                  </Candidate>
                </>
              ) : (
                <>
                  <Title>
                    {ballotDisplay[0]}
                  </Title>
                  <SubTitle>{ballotDisplay[1]}</SubTitle>
                </>
              )}
            </BallotItemInfo>
            <BallotItemSupportOpposeCountDisplayWrapper>
              <BallotItemSupportOpposeCountDisplay
                ballotItemWeVoteId={ballotItemWeVoteId}
                hideNumbersOfAllPositions
              />
            </BallotItemSupportOpposeCountDisplayWrapper>
            {/* Waiting to update BallotItemVoterGuideSupportOpposeDisplay
            <BallotItemSupportOpposeCountDisplayWrapper>
              <BallotItemVoterGuideSupportOpposeDisplay
                ballotItemWeVoteId={ballotItemWeVoteId}
                hideNumbersOfAllPositions
              />
            </BallotItemSupportOpposeCountDisplayWrapper>
            */}
            {' '}
          </BallotItemWrapper>
          {' '}
          <span className="u-show-mobile">
            { contestOfficeName && (
              <p>
                <OfficeNameText
                  contestOfficeName={contestOfficeName}
                  politicalParty={politicalParty}
                  showOfficeName
                />
              </p>
            )}
            {statementText && (
              <MobileItemDescription>
                {position.speaker_image_url_https_tiny && (
                  <BallotItemImageWrapper>
                    <ImageHandler
                      sizeClassName="icon-sm "
                      imageUrl={position.speaker_image_url_https_tiny}
                      alt="organization-photo"
                      kind_of_ballot_item="ORGANIZATION"
                    />
                  </BallotItemImageWrapper>
                )}
                <ReadMore
                  text_to_display={statementText}
                  num_of_lines={4}
                />
              </MobileItemDescription>
            )}
          </span>
          <span className="u-show-desktop-tablet">
            {statementText && (
              <DesktopItemDescription>
                {position.speaker_image_url_https_tiny && (
                  <BallotItemImageWrapper>
                    <ImageHandler
                      sizeClassName="icon-sm "
                      imageUrl={position.speaker_image_url_https_tiny}
                      alt="organization-photo"
                      kind_of_ballot_item="ORGANIZATION"
                    />
                  </BallotItemImageWrapper>
                )}
                <ReadMore
                  text_to_display={statementText}
                  num_of_lines={3}
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

const BallotItemInfo = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
`;

const BallotItemImageWrapper = styled.span`
  padding-right: 8px;
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
`;

const BallotItemWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const Candidate = styled.div`
`;

const DesktopItemDescription = styled.div`
  // display: flex;
  // flex-flow: row nowrap;
  font-size: 16px;
  border-radius: 5px;
  list-style: none;
  padding: 6px;
  background: #eee;
  flex: 1 1 0;
`;

const MobileItemDescription = styled.div`
  // display: flex;
  // flex-flow: row nowrap;
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 13px;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

export default withStyles(styles)(VoterGuidePositionItem);
