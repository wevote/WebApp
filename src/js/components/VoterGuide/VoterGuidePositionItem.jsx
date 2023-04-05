import { Launch, Twitter } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { ReactSVG } from 'react-svg';
import CandidateActions from '../../actions/CandidateActions';
import MeasureActions from '../../actions/MeasureActions';
import { renderLog } from '../../common/utils/logging';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import numberWithCommas from '../../common/utils/numberWithCommas';
import stringContains from '../../common/utils/stringContains';
import toTitleCase from '../../common/utils/toTitleCase';
import AppObservableStore from '../../common/stores/AppObservableStore';
import YearState from '../../common/components/Widgets/YearState';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import BallotItemVoterGuideSupportOpposeDisplay from '../Widgets/ScoreDisplay/BallotItemVoterGuideSupportOpposeDisplay';

const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../common/components/Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));


class VoterGuidePositionItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemStateName: '',
      hidePositionStatement: false,
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
    this.onClickShowOrganizationModal = this.onClickShowOrganizationModal.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onOrganizationStoreChange();
    const { ballotItemWeVoteId } = this.props;
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    if (ballotItemWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(ballotItemWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(ballotItemWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic:', ballotItemWeVoteId);
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
      // console.log('componentDidMount positionListForBallotItemFromFriends:', ballotItemWeVoteId);
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
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
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
    const { ballotItemWeVoteId } = this.props;
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // console.log('VoterGuidePositionItem, onMeasureStoreChange:', ballotItemWeVoteId);
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
    const { positionWeVoteId } = this.props;
    const positionItem = OrganizationStore.getPositionByPositionWeVoteId(positionWeVoteId);
    // console.log('positionItem:', positionItem);
    const {
      ballot_item_display_name: ballotItemDisplayName,
      ballot_item_image_url_https_medium: ballotItemImageUrlHttpsMedium,
      ballot_item_state_code: ballotItemStateCode,
      contest_office_name: contestOfficeName,
      is_oppose: organizationOpposesBallotItem,
      is_support: organizationSupportsBallotItem,
      kind_of_ballot_item: kindOfBallotItem,
      more_info_url: moreInfoUrl,
      position_year: positionYear,
      statement_text: positionDescription,
      speaker_twitter_followers_count: twitterFollowersCount,
    } = positionItem;
    this.setState({
      ballotItemDisplayName,
      ballotItemImageUrlHttpsMedium,
      contestOfficeName,
      kindOfBallotItem,
      moreInfoUrl,
      organizationOpposesBallotItem,
      organizationSupportsBallotItem,
      positionDescription,
      positionYear,
      twitterFollowersCount,
    });
    if (ballotItemStateCode) {
      const ballotItemStateName = convertStateCodeToStateText(ballotItemStateCode);
      this.setState({
        // ballotItemStateCode,
        ballotItemStateName,
      });
    }
  }

  onClickShowOrganizationModal () {
    const { ballotItemWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
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
    const { ballotItemWeVoteId, positionWeVoteId, searchResultsNode } = this.props;
    const {
      ballotItemImageUrlHttpsMedium,
      ballotItemStateName,
      contestOfficeName,
      kindOfBallotItem,
      organizationOpposesBallotItem,
      organizationSupportsBallotItem,
      positionDescription,
      positionYear,
      twitterFollowersCount,
    } = this.state;
    // console.log('VoterGuidePositionItem render');
    let {
      ballotItemDisplayName,
      moreInfoUrl,
    } = this.state;
    const isCandidate = String(kindOfBallotItem) === 'CANDIDATE';
    // console.log('kindOfBallotItem:', kindOfBallotItem, 'isCandidate:', isCandidate);
    if (!ballotItemWeVoteId) {
      // console.log('VoterGuidePositionItem cannot render yet -- missing ballotItemWeVoteId');
      return null;
    }

    if (ballotItemDisplayName) {
      ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    } else {
      ballotItemDisplayName = '';
    }

    // const onEditPositionClick = this.state.showEditPositionModal ? this.closeEditPositionModal.bind(this) : this.openEditPositionModal.bind(this);
    if (moreInfoUrl) {
      if (!moreInfoUrl.toLowerCase().startsWith('http')) {
        moreInfoUrl = `http://${moreInfoUrl}`;
      }
    }
    const imagePlaceholder = (
      <ReactSVG
        src={normalizedImagePath('/img/global/svg-icons/avatar-generic.svg')}
      />
    );

    return (
      <>
        {!!(searchResultsNode) && (
          <SearchResultsNodeWrapper>
            {searchResultsNode}
          </SearchResultsNodeWrapper>
        )}
        <DesktopContainerWrapper className="u-show-desktop-tablet">
          <DesktopContainer>
            {isCandidate && (
              <DesktopItemLeft>
                <DesktopItemImage onClick={this.onClickShowOrganizationModal} className="u-cursor--pointer">
                  <div>
                    { ballotItemImageUrlHttpsMedium ? (
                      <Suspense fallback={<></>}>
                        <ImageHandler
                          className="card-child__avatar--round"
                          sizeClassName="icon-lg"
                          imageUrl={ballotItemImageUrlHttpsMedium}
                        />
                      </Suspense>
                    ) :
                      imagePlaceholder }
                  </div>
                </DesktopItemImage>
              </DesktopItemLeft>
            )}
            <PositionItemDesktop isSupport={organizationSupportsBallotItem} isOppose={organizationOpposesBallotItem}>
              <DesktopItemHeader>
                <DesktopItemNameAndOfficeContainer>
                  <DesktopItemNameContainer>
                    <DesktopItemName onClick={this.onClickShowOrganizationModal} className="u-cursor--pointer">
                      { ballotItemDisplayName }
                    </DesktopItemName>
                    <DesktopItemTwitterContainer>
                      { !!(twitterFollowersCount && String(twitterFollowersCount) !== '0') && (
                        <DesktopItemTwitter>
                          <Twitter />
                          {numberWithCommas(twitterFollowersCount)}
                        </DesktopItemTwitter>
                      )}
                    </DesktopItemTwitterContainer>
                  </DesktopItemNameContainer>
                  <DesktopItemOffice onClick={this.onClickShowOrganizationModal} className="u-cursor--pointer">
                    {(contestOfficeName) && (
                      <Suspense fallback={<></>}>
                        <OfficeNameText
                          inCard
                          officeName={contestOfficeName}
                          // politicalParty={politicalParty}
                          showOfficeName
                        />
                      </Suspense>
                    )}
                    <YearState year={`${positionYear}`} stateName={ballotItemStateName} />
                  </DesktopItemOffice>
                </DesktopItemNameAndOfficeContainer>
                <BallotItemSupportOpposeCountDisplayWrapper>
                  <Suspense fallback={<></>}>
                    <BallotItemSupportOpposeScoreDisplay
                      ballotItemDisplayName={ballotItemDisplayName}
                      ballotItemWeVoteId={ballotItemWeVoteId}
                      // hideEndorsementsOverview
                      hideNumbersOfAllPositions
                    />
                  </Suspense>
                  <VerticalSeparator />
                  <BallotItemVoterGuideSupportOpposeDisplay
                    positionWeVoteId={positionWeVoteId}
                  />
                </BallotItemSupportOpposeCountDisplayWrapper>
              </DesktopItemHeader>
              <DesktopItemBody>
                <DesktopItemDescription>
                  {positionDescription && (
                    <Suspense fallback={<></>}>
                      <ReadMore
                        textToDisplay={positionDescription}
                        numberOfLines={4}
                      />
                    </Suspense>
                  )}
                </DesktopItemDescription>
                <DesktopItemFooter>
                  {/* <strong>Was this Useful?</strong>
                  Yes  No
                  <div className="u-float-right">
                    Flag Links
                  </div> */}
                  {moreInfoUrl ? (
                    <SourceLink>
                      <Suspense fallback={<></>}>
                        <OpenExternalWebSite
                          linkIdAttribute="moreInfo-desktop"
                          body={(
                            <span>
                              view source
                              {' '}
                              <Launch
                                style={{
                                  height: 14,
                                  marginLeft: 2,
                                  marginTop: '-3px',
                                  width: 14,
                                }}
                              />
                            </span>
                          )}
                          className="u-gray-mid"
                          target="_blank"
                          url={moreInfoUrl}
                        />
                      </Suspense>
                    </SourceLink>
                  ) : null}
                </DesktopItemFooter>
              </DesktopItemBody>
            </PositionItemDesktop>
          </DesktopContainer>
        </DesktopContainerWrapper>
        <MobileContainerWrapper className="u-show-mobile">
          <PositionItemMobile isSupport={organizationSupportsBallotItem} isOppose={organizationOpposesBallotItem}>
            <MobileItemHeader>
              <MobileItemNameAndOfficeContainer>
                <MobileItemNameContainer onClick={this.onClickShowOrganizationModal} className="u-cursor--pointer">
                  {isCandidate && (
                    <MobileItemImage>
                      { ballotItemImageUrlHttpsMedium ? (
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            className="card-child__avatar"
                            sizeClassName="icon-lg"
                            imageUrl={ballotItemImageUrlHttpsMedium}
                          />
                        </Suspense>
                      ) :
                        imagePlaceholder }
                    </MobileItemImage>
                  )}
                  {/* Visible for most phones */}
                  <MobileItemNameAndOfficeContainerLarger className="u-show-mobile-bigger-than-iphone5">
                    <MobileItemName>
                      { ballotItemDisplayName }
                    </MobileItemName>
                    <MobileItemOffice>
                      {(contestOfficeName) && (
                        <Suspense fallback={<></>}>
                          <OfficeNameText
                            inCard
                            officeName={contestOfficeName}
                            // politicalParty={politicalParty}
                            showOfficeName
                          />
                        </Suspense>
                      )}
                      <YearState year={`${positionYear}`} stateName={ballotItemStateName} />
                    </MobileItemOffice>
                  </MobileItemNameAndOfficeContainerLarger>
                  {/* Visible on iPhone 5/se */}
                  <MobileItemNameAndOfficeContainerSmaller className="u-show-mobile-iphone5-or-smaller">
                    <MobileItemName>
                      { ballotItemDisplayName }
                    </MobileItemName>
                  </MobileItemNameAndOfficeContainerSmaller>
                </MobileItemNameContainer>
              </MobileItemNameAndOfficeContainer>
              <MobileItemEndorsementContainer>
                <MobileItemEndorsementDisplay>
                  <BallotItemSupportOpposeCountDisplayWrapper>
                    <Suspense fallback={<></>}>
                      <BallotItemSupportOpposeScoreDisplay
                        ballotItemDisplayName={ballotItemDisplayName}
                        ballotItemWeVoteId={ballotItemWeVoteId}
                        // hideEndorsementsOverview
                        hideNumbersOfAllPositions
                      />
                    </Suspense>
                    <VerticalSeparator />
                    <BallotItemVoterGuideSupportOpposeDisplay
                      positionWeVoteId={positionWeVoteId}
                    />
                  </BallotItemSupportOpposeCountDisplayWrapper>
                </MobileItemEndorsementDisplay>
              </MobileItemEndorsementContainer>
            </MobileItemHeader>
            <div className="u-show-mobile-iphone5-or-smaller">
              <MobileItemOfficeSmallerPhones onClick={this.onClickShowOrganizationModal} className="u-cursor--pointer">
                {(contestOfficeName) && (
                  <Suspense fallback={<></>}>
                    <OfficeNameText
                      inCard
                      officeName={contestOfficeName}
                      // politicalParty={politicalParty}
                      showOfficeName
                    />
                  </Suspense>
                )}
                <YearState year={`${positionYear}`} stateName={ballotItemStateName} />
              </MobileItemOfficeSmallerPhones>
            </div>
            <MobileItemBody>
              <MobileItemDescriptionFollowToggleContainer>
                <MobileItemDescription>
                  {positionDescription && (
                    <Suspense fallback={<></>}>
                      <ReadMore
                        textToDisplay={positionDescription}
                        numberOfLines={4}
                      />
                    </Suspense>
                  )}
                </MobileItemDescription>
              </MobileItemDescriptionFollowToggleContainer>
              <MobileItemFooter>
                {/* <strong>Was this Useful?</strong>
                Yes  No
                <div className="u-float-right">
                  Flag Links
                </div> */}
                {moreInfoUrl && (
                  <SourceLink>
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="moreInfo-mobile"
                        body={(
                          <span>
                            source
                            {' '}
                            <Launch
                              style={{
                                height: 14,
                                marginLeft: 2,
                                marginTop: '-3px',
                                width: 14,
                              }}
                            />
                          </span>
                        )}
                        className="u-gray-mid"
                        target="_blank"
                        url={moreInfoUrl}
                      />
                    </Suspense>
                  </SourceLink>
                )}
              </MobileItemFooter>
            </MobileItemBody>
          </PositionItemMobile>
        </MobileContainerWrapper>
      </>
    );
  }
}
VoterGuidePositionItem.propTypes = {
  // ballotItemDisplayName: PropTypes.string,
  ballotItemWeVoteId: PropTypes.string,
  positionWeVoteId: PropTypes.string.isRequired,
  searchResultsNode: PropTypes.object,
};

const styles = (theme) => ({
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

const BallotItemSupportOpposeCountDisplayWrapper = styled('div')`
  cursor: pointer;
  display: flex;
`;

const DesktopContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: 2px 15px 8px 15px;
`;

const DesktopContainerWrapper = styled('div')`
`;

const DesktopItemBody = styled('div')`
  margin: 0;
`;

const DesktopItemDescription = styled('div')`
  font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemFooter = styled('div')`
  font-size: 12px;
  margin-top: 8px;
  padding-bottom: 12px;
`;

const DesktopItemHeader = styled('div')`
  display: flex;
  align-items: top;  // nonsense css
  justify-content: space-between;
`;

const DesktopItemImage = styled('div')`
  width: 48px;
  margin: 0 auto;
  height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 8px;
  * {
    border-radius: 6px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const DesktopItemLeft = styled('div')`
  width: 56px;
  padding: 0 8px 0 0;
`;

const DesktopItemName = styled('h4')`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const DesktopItemNameContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const DesktopItemNameAndOfficeContainer = styled('div')`
  padding: 0;
`;

const DesktopItemOffice = styled('div')`
`;

const DesktopItemTwitter = styled('div')`
  color: #999;
  display: inline-block;
  font-size: 12px;
  padding-left: 10px;
  padding-right: 3px;
  white-space: nowrap;
`;

const DesktopItemTwitterContainer = styled('div')`
`;

const MobileContainerWrapper = styled('div')`
`;

const MobileItemBody = styled('div')`
  padding: 6px 6px 6px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescription = styled('div')(({ theme }) => (`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`));

const MobileItemDescriptionFollowToggleContainer = styled('div')`
  left: 2px;
  display: flex;
  justify-content: space-between;
`;

const MobileItemEndorsementContainer = styled('div')`
  margin-left: auto;
  margin-bottom: auto;
  height: 100%;
  max-height: 100%;
`;

const MobileItemEndorsementDisplay = styled('div')`
  width: 100%;
  height: 100%;
  margin-bottom: 4px;
`;

const MobileItemFooter = styled('div')`
  height: 20px;
  width: 100%;
  margin-top: 2px;
  font-size: 12px;
`;

const MobileItemHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 6px 0 6px 8px;
  min-height: 46px;
`;

const MobileItemNameAndOfficeContainer = styled('div')`
`;

const MobileItemNameContainer = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const MobileItemImage = styled('div')`
  margin-right: 6px;
  width: 48px;
  height: 48px;
  * {
    border-radius: 4px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
    &::before {
      font-size: 48px !important;
    }
  }
`;

const MobileItemName = styled('h4')`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  padding-right: 2px;
`;

const MobileItemNameAndOfficeContainerLarger = styled('div')`
`;

const MobileItemOffice = styled('div')`
`;

const MobileItemOfficeSmallerPhones = styled('div')`
  padding-left: 6px;
`;

const MobileItemNameAndOfficeContainerSmaller = styled('div')`
`;

const PositionItemDesktop = styled('div', {
  shouldForwardProp: (prop) => !['isSupport', 'isOppose'].includes(prop),
})(({ isSupport, isOppose }) => (`
  background: #eee;
  ${(!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : ''}
  ${isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : ''}
  ${isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : ''}
  border-radius: 5px;
  flex: 1 1 0;
  list-style: none;
  padding: 6px 16px;
`));

const PositionItemMobile = styled('li', {
  shouldForwardProp: (prop) => !['isSupport', 'isOppose'].includes(prop),
})(({ isSupport, isOppose }) => (`
  background: #eee;
  ${(!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : ''}
  ${isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : ''}
  ${isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : ''}
  border-radius: 5px;
  list-style: none;
  margin-top: 2px;
  margin-bottom: 12px;
  max-width: 100% !important;
`));

const SearchResultsNodeWrapper = styled('div')`
  margin-bottom: 2px !important;
  padding: 0 15px;
  @media (max-width: 476px) {
    padding: 0 !important;
  }
`;

const SourceLink = styled('div')`
  float: right;
  margin-bottom: -4px;
`;

// const TwitterIcon = styled('span')`
//   font-size: 16px;
//   color: #ccc;
//   margin-right: 2px;
//   vertical-align: bottom;
// `;

const VerticalSeparator = styled('div')`
  height: 44px;
  width: 2px;
  background: #ccc;
  margin: 0 4px;
`;

export default withStyles(styles)(VoterGuidePositionItem);
