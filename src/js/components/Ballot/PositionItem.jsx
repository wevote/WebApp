import { Launch, Twitter } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SvgImage from '../../common/components/Widgets/SvgImage';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore from '../../common/stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import PositionItemScorePopover from '../Widgets/ScoreDisplay/PositionItemScorePopover';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import PositionItemSquare from './PositionItemSquare';
import StickyPopover from './StickyPopover';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));


class PositionItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // const { position } = this.props;
    // const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionItem componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // This creates too much load on the browser
    // // We want to make sure we have all the position information so that comments show up
    // if (ballotItemWeVoteId) {
    //   const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    //
    //   if (voterGuidesForThisBallotItem) {
    //     voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
    //       // console.log('oneVoterGuide: ', oneVoterGuide);
    //       if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
    //         if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
    //           OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onFriendStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationInVotersNetworkChange () {
    const { position } = this.props;
    if (position) {
      const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;
      const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
      const updatedPosition = OrganizationStore.getPositionByPositionWeVoteId(position.position_we_vote_id);

      this.setState({
        updatedPosition,
        voterIsFriendsWithThisOrganization,
      });
    }
  }

  onVoterGuideStoreChange () {
    // const { position } = this.props;
    // const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;

    // This puts too much strain on the browser since PositionItems are in a list
    // // We want to make sure we have all the position information so that comments show up
    // if (ballotItemWeVoteId) {
    //   const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    //
    //   if (voterGuidesForThisBallotItem) {
    //     voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
    //       // console.log('oneVoterGuide: ', oneVoterGuide);
    //       if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
    //         if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
    //           OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  closeDrawer () {
    AppObservableStore.setShowOrganizationModal(false);
    AppObservableStore.setShowPositionDrawer(false);
  }

  render () {
    renderLog('PositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    const { classes, linksOpenExternalWebsite, searchResultsNode, showEntireStatementText } = this.props;
    ({ position } = this.props);
    const { updatedPosition } = this.state;
    if (updatedPosition && updatedPosition.speaker_we_vote_id) {
      position = updatedPosition;
    }
    if (!position || !position.speaker_we_vote_id) {
      return null;
    }
    // console.log('PositionItem position render, position:', position);
    const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;
    const { voterIsFriendsWithThisOrganization } = this.state;

    // TwitterHandle-based link
    const voterGuideWeVoteIdLink = `/voterguide/${organizationWeVoteId}`;
    const speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : voterGuideWeVoteIdLink;
    // Steve: 9/21/21, save until we revive stepping back to the previous page.  We currently always go back to ballot
    // let speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : voterGuideWeVoteIdLink;
    // let backToCandidateFound = false;
    // let backToMeasureFound = false;
    // const { params } = this.props;
    // if (params) {
    //   if (params.candidate_we_vote_id) {
    //     speakerLink += `/btcand/${params.candidate_we_vote_id}`;
    //     backToCandidateFound = true;
    //   } else if (params.measure_we_vote_id) {
    //     speakerLink += `/btmeas/${params.measure_we_vote_id}`;
    //     backToMeasureFound = true;
    //   }
    //   if (backToCandidateFound || backToMeasureFound) {
    //     if (params.back_to_variable) {
    //       speakerLink += `/b/${params.back_to_variable}`;
    //     }
    //   }
    // }
    const hostnameAndPort = AppObservableStore.getWeVoteRootURL();
    // console.log('hostnameAndPort:', hostnameAndPort);
    const speakerLinkExternal = `${hostnameAndPort}${speakerLink}`;

    let positionSpeakerDisplayName = position.speaker_display_name;
    // console.log('position:', position, ', VoterStore.getLinkedOrganizationWeVoteId():', VoterStore.getLinkedOrganizationWeVoteId());
    if (VoterStore.getLinkedOrganizationWeVoteId() === position.speaker_we_vote_id) {
      // Voter looking at own position
      if (position.speaker_display_name && position.speaker_display_name.startsWith('Voter-')) {
        positionSpeakerDisplayName = 'You';
      }
    }

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      const organizationIcon = normalizedImagePath('../../img/global/svg-icons/organization-icon.svg');
      imagePlaceholder = (
        <SvgImage imageName={organizationIcon} />
      );
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
      imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
    }

    // console.log(position);
    const organizationSupportsBallotItem = position.is_support;
    const organizationOpposesBallotItem = position.is_oppose;

    // console.log('PositionItem supportOpposeInfo: ', supportOpposeInfo);
    let positionDescription = <>{position.statement_text}</>;
    if (!!(position.statement_text) && !showEntireStatementText) {
      positionDescription = (
        <Suspense fallback={<></>}>
          <ReadMore
            numberOfLines={3}
            textToDisplay={position.statement_text}
          />
        </Suspense>
      );
    }

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      const organizationPopoverCard = (<OrganizationPopoverCard linksOpenExternalWebsite organizationWeVoteId={organizationWeVoteId} />);
      let moreInfoUrl = position.more_info_url;
      if (moreInfoUrl) {
        if (!moreInfoUrl.toLowerCase().startsWith('http')) {
          moreInfoUrl = `http://${moreInfoUrl}`;
        }
      }
      const positionsPopover = (
        <PositionItemScorePopover
          positionWeVoteId={position.position_we_vote_id}
          showPersonalScoreInformation
        />
      );

      const voterLinkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
      const lookingAtOwnPosition = (voterLinkedOrganizationWeVoteId === position.speaker_we_vote_id);

      return (
        <>
          {searchResultsNode}
          <div className="u-show-desktop-tablet">
            <DesktopContainer>
              <DesktopItemLeft>
                <DesktopItemImage>
                  <Suspense fallback={<></>}>
                    <StickyPopover
                      delay={{ show: 700, hide: 100 }}
                      popoverComponent={organizationPopoverCard}
                      placement="auto"
                      id="positions-organization-popover-trigger-click-root-close"
                    >
                      <div>
                        {linksOpenExternalWebsite ? (
                          <OpenExternalWebSite
                            linkIdAttribute="desktopSpeakerImage"
                            body={(
                              <span>
                                { position.speaker_image_url_https_medium ? (
                                  <Suspense fallback={<></>}>
                                    <ImageHandler
                                      className="card-child__avatar"
                                      sizeClassName="icon-lg"
                                      imageUrl={position.speaker_image_url_https_medium}
                                    />
                                  </Suspense>
                                ) :
                                  imagePlaceholder }
                              </span>
                            )}
                            className="u-no-underline"
                            target="_blank"
                            url={speakerLinkExternal}
                          />
                        ) : (
                          <Link
                            id="desktopSpeakerImage"
                            to={speakerLink}
                            className="u-no-underline"
                          >
                            { position.speaker_image_url_https_medium ? (
                              <Suspense fallback={<></>}>
                                <ImageHandler
                                  className="card-child__avatar"
                                  sizeClassName="icon-lg"
                                  imageUrl={position.speaker_image_url_https_medium}
                                />
                              </Suspense>
                            ) :
                              imagePlaceholder }
                          </Link>
                        )}
                      </div>
                    </StickyPopover>
                  </Suspense>
                </DesktopItemImage>
                {voterIsFriendsWithThisOrganization  ? (
                  <>
                    <Button
                      variant="outlined"
                      classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
                      color="primary"
                      disabled
                    >
                      Friend
                    </Button>
                    {/* We don't want to make it too easy to remove friend
                    voterWeVoteIdForThisOrganization && <FriendToggle otherVoterWeVoteId={voterWeVoteIdForThisOrganization} /> */}
                  </>
                ) : (
                  <Suspense fallback={<></>}>
                    <FollowToggle
                      addToScoreLabelOn
                      anchorLeft
                      hideDropdownButtonUntilFollowing
                      lightModeOn
                      organizationWeVoteId={organizationWeVoteId}
                      platformType="desktop"
                    />
                  </Suspense>
                )}
              </DesktopItemLeft>
              <PositionItemDesktop isSupport={organizationSupportsBallotItem} isOppose={organizationOpposesBallotItem}>
                <DesktopItemHeader>
                  <DesktopItemNameIssueContainer>
                    <DesktopItemNameContainer>
                      <DesktopItemName>
                        <Suspense fallback={<></>}>
                          <StickyPopover
                            delay={{ show: 700, hide: 100 }}
                            popoverComponent={organizationPopoverCard}
                            placement="auto"
                            id={`positions-popover-trigger-click-root-close-${organizationWeVoteId}`}
                          >
                            <div>
                              {linksOpenExternalWebsite ? (
                                <OpenExternalWebSite
                                  linkIdAttribute={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                                  body={(
                                    <span>
                                      { positionSpeakerDisplayName }
                                    </span>
                                  )}
                                  target="_blank"
                                  url={speakerLinkExternal}
                                />
                              ) : (
                                <Link
                                  id={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                                  onClick={this.closeDrawer}
                                  to={speakerLink}
                                >
                                  { positionSpeakerDisplayName }
                                </Link>
                              )}
                            </div>
                          </StickyPopover>
                        </Suspense>
                      </DesktopItemName>
                      <DesktopItemTwitterContainer>
                        { !!(position.twitter_followers_count && String(position.twitter_followers_count) !== '0') && (
                          <DesktopItemTwitter>
                            <OpenExternalWebSite
                              body={(
                                <div style={{ marginTop: '-24px' }}>
                                  <Twitter classes={{ root: classes.twitterLogo }} />
                                  <TwitterHandleWrapper>
                                    @
                                    {position.speaker_twitter_handle}
                                  </TwitterHandleWrapper>
                                  <TwitterFollowersWrapper>
                                    {numberAbbreviate(position.twitter_followers_count)}
                                  </TwitterFollowersWrapper>
                                </div>
                              )}
                              linkIdAttribute="positionItemTwitterDesktop"
                              url={`https://twitter.com/${position.speaker_twitter_handle}`}
                              target="_blank"
                            />
                          </DesktopItemTwitter>
                        )}
                      </DesktopItemTwitterContainer>
                    </DesktopItemNameContainer>
                    {(position.is_support || position.is_oppose) && (
                      <DesktopItemSupportOrOppose>
                        {position.is_support ? (
                          <>
                            {lookingAtOwnPosition ? (
                              <>
                                endorse
                              </>
                            ) : (
                              <>
                                endorses
                              </>
                            )}
                            {' '}
                            {position.ballot_item_display_name}
                          </>
                        ) : (
                          <>
                            {position.is_oppose && (
                              <>
                                {lookingAtOwnPosition ? (
                                  <>
                                    oppose
                                  </>
                                ) : (
                                  <>
                                    opposes
                                  </>
                                )}
                                {' '}
                                {position.ballot_item_display_name}
                              </>
                            )}
                          </>
                        )}
                      </DesktopItemSupportOrOppose>
                    )}
                    <DesktopItemIssues>
                      <IssuesByOrganizationDisplayList
                        organizationWeVoteId={organizationWeVoteId}
                        placement="auto"
                      />
                    </DesktopItemIssues>
                  </DesktopItemNameIssueContainer>
                  <DesktopItemEndorsementDisplay>
                    <Suspense fallback={<></>}>
                      <StickyPopover
                        delay={{ show: 700, hide: 100 }}
                        popoverComponent={positionsPopover}
                        placement="auto"
                        id={`position-item-score-desktop-popover-trigger-click-root-close-${organizationWeVoteId}`}
                        key={`positionItemScoreDesktopPopover-${organizationWeVoteId}`}
                        openOnClick
                        showCloseIcon
                      >
                        <div>
                          <PositionItemSquare
                            position={position}
                          />
                        </div>
                      </StickyPopover>
                    </Suspense>
                  </DesktopItemEndorsementDisplay>
                </DesktopItemHeader>
                <DesktopItemBody>
                  <DesktopItemDescription>
                    {positionDescription}
                  </DesktopItemDescription>
                  <DesktopItemFooter>
                    {moreInfoUrl ? (
                      <SourceLink>
                        <Suspense fallback={<></>}>
                          <OpenExternalWebSite
                            linkIdAttribute="moreInfoDesktop"
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
          </div>
          <div className="u-show-mobile">
            <PositionItemMobile isSupport={organizationSupportsBallotItem} isOppose={organizationOpposesBallotItem}>
              {searchResultsNode}
              <MobileItemHeader>
                <MobileItemImage>
                  {linksOpenExternalWebsite ? (
                    <OpenExternalWebSite
                      linkIdAttribute="mobileSpeakerImage"
                      body={(
                        <span>
                          { position.speaker_image_url_https_medium ? (
                            <Suspense fallback={<></>}>
                              <ImageHandler
                                className="card-child__avatar"
                                sizeClassName="icon-lg"
                                imageUrl={position.speaker_image_url_https_medium}
                              />
                            </Suspense>
                          ) :
                            imagePlaceholder }
                        </span>
                      )}
                      className="u-no-underline"
                      target="_blank"
                      url={speakerLinkExternal}
                    />
                  ) : (
                    <Link to={speakerLink} className="u-no-underline">
                      { position.speaker_image_url_https_medium ? (
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            className="card-child__avatar"
                            sizeClassName="icon-lg"
                            imageUrl={position.speaker_image_url_https_medium}
                          />
                        </Suspense>
                      ) :
                        imagePlaceholder }
                    </Link>
                  )}
                </MobileItemImage>
                {/* Visible for most phones */}
                <MobileItemNameIssuesContainer>
                  <MobileItemName>
                    {linksOpenExternalWebsite ? (
                      <OpenExternalWebSite
                        linkIdAttribute={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                        body={(
                          <span>
                            { positionSpeakerDisplayName }
                          </span>
                        )}
                        className="u-break-word"
                        target="_blank"
                        url={speakerLinkExternal}
                      />
                    ) : (
                      <Link
                        className="u-break-word"
                        id={`mobile-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                        onClick={this.closeDrawer}
                        to={speakerLink}
                      >
                        { positionSpeakerDisplayName }
                      </Link>
                    )}
                  </MobileItemName>
                  <MobileItemIssues>
                    <IssuesByOrganizationDisplayList
                      organizationWeVoteId={organizationWeVoteId}
                      placement="bottom"
                      fullWidth
                    />
                  </MobileItemIssues>
                </MobileItemNameIssuesContainer>
                {/* Visible on iPhone 5/se */}
                <MobileSmallItemNameContainer>
                  <MobileItemName>
                    {linksOpenExternalWebsite ? (
                      <OpenExternalWebSite
                        body={(
                          <span>
                            { positionSpeakerDisplayName }
                          </span>
                        )}
                        className="u-break-word"
                        target="_blank"
                        url={speakerLinkExternal}
                      />
                    ) : (
                      <Link to={speakerLink} className="u-break-word">
                        { positionSpeakerDisplayName }
                      </Link>
                    )}
                  </MobileItemName>
                </MobileSmallItemNameContainer>
                <MobileItemEndorsementContainer>
                  <MobileItemEndorsementDisplay>
                    <Suspense fallback={<></>}>
                      <StickyPopover
                        delay={{ show: 1000000, hide: 100 }}
                        popoverComponent={positionsPopover}
                        placement="auto"
                        id={`position-item-score-mobile-popover-trigger-click-root-close-${organizationWeVoteId}`}
                        key={`positionItemScoreMobilePopover-${organizationWeVoteId}`}
                        openOnClick
                        showCloseIcon
                      >
                        <div>
                          <PositionItemSquare
                            position={position}
                          />
                        </div>
                      </StickyPopover>
                    </Suspense>
                  </MobileItemEndorsementDisplay>
                </MobileItemEndorsementContainer>
              </MobileItemHeader>
              <MobileSmallItemIssuesContainer>
                <MobileItemIssues>
                  <IssuesByOrganizationDisplayList
                    organizationWeVoteId={organizationWeVoteId}
                    placement="bottom"
                    fullWidth
                  />
                </MobileItemIssues>
              </MobileSmallItemIssuesContainer>
              <MobileItemBody>
                <MobileItemDescriptionFollowToggleContainer>
                  <MobileItemDescription>
                    {positionDescription}
                  </MobileItemDescription>
                  <MobileItemFollowToggleDisplay>
                    {voterIsFriendsWithThisOrganization  ? (
                      <>
                        <Button
                          variant="outlined"
                          classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
                          color="primary"
                          disabled
                        >
                          Friend
                        </Button>
                        {/* We don't want to make it too easy to remove friend
                        voterWeVoteIdForThisOrganization && <FriendToggle otherVoterWeVoteId={voterWeVoteIdForThisOrganization} /> */}
                      </>
                    ) : (
                      <Suspense fallback={<></>}>
                        <FollowToggle
                          addToScoreLabelOn
                          lightModeOn
                          hideDropdownButtonUntilFollowing
                          organizationWeVoteId={organizationWeVoteId}
                          platformType="mobile"
                        />
                      </Suspense>
                    )}
                  </MobileItemFollowToggleDisplay>
                </MobileItemDescriptionFollowToggleContainer>
                <MobileItemFooter>
                  {/* <strong>Was this Useful?</strong>
                  Yes  No
                  <div className="u-float-right">
                    Flag Links
                  </div> */}
                  {moreInfoUrl ? (
                    <SourceLink>
                      <Suspense fallback={<></>}>
                        <OpenExternalWebSite
                          linkIdAttribute="moreInfoMobile"
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
                  ) : null}
                </MobileItemFooter>
              </MobileItemBody>
            </PositionItemMobile>
          </div>
        </>
      );
    } else {
      return nothingToDisplay;
    }
  }
}
PositionItem.propTypes = {
  classes: PropTypes.object,
  linksOpenExternalWebsite: PropTypes.bool,
  position: PropTypes.object.isRequired,
  searchResultsNode: PropTypes.object,
  showEntireStatementText: PropTypes.bool,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  twitterLogo: {
    color: '#1d9bf0',
    height: 18,
    marginRight: '-2px',
    marginTop: '-4px',
  },
});

const DesktopContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: 8px 24px 24px 24px;
`;

const DesktopItemBody = styled('div')`
  margin: 0;
`;

const DesktopItemDescription = styled('div')`
  // font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemEndorsementDisplay = styled('div')`
  margin-left: auto;
  padding: 0;
`;

const DesktopItemFooter = styled('div')`
  font-size: 12px;
  margin-top: 2px;
`;

const DesktopItemHeader = styled('div')`
  display: flex;
  // align-items: top;   // nonsense property value, commented out July 7, 2021
  justify-content: flex-start;
`;

const DesktopItemImage = styled('div')`
  width: 57.76px;
  margin: 0 auto 8px auto;
  height: 57.76px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  * {
    border-radius: 29px;
    width: 57.76px !important;
    height: 57.76px !important;
    max-width: 57.76px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const DesktopItemIssues = styled('div')`
  margin: 0;
  padding: 0;
`;

const DesktopItemLeft = styled('div')`
  width: 85px;
  padding: 0 16px 0 0;
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

const DesktopItemNameIssueContainer = styled('div')`
  padding: 0;
`;

const DesktopItemSupportOrOppose = styled('div')`
  margin-top: -4px;
  margin-right: 10px;
`;

const DesktopItemTwitter = styled('div')`
  display: inline-block;
  font-size: 13px;
  padding-left: 10px;
  padding-right: 3px;
  white-space: nowrap;
`;

const DesktopItemTwitterContainer = styled('div')`
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
    // font-size: 14px;
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
  width: 50px;
  height: 100%;
  max-height: 100%;
`;

const MobileItemEndorsementDisplay = styled('div')`
  width: 100%;
  height: 100%;
  margin-bottom: 4px;
`;

const MobileItemFollowToggleDisplay = styled('div')`
  width: 75px;
`;

const MobileItemFooter = styled('div')`
  height: 20px;
  width: 100%;
  margin-top: 2px;
  font-size: 12px;
`;

const MobileItemHeader = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 6px 0 6px 8px;
  min-height: 46px;
`;

const MobileItemImage = styled('div')`
  margin-right: 16px;
  width: 40px;
  height: 40px;
  * {
    border-radius: 20px;
    width: 40px !important;
    height: 40px !important;
    max-width: 40px !important;
    display: flex;
    align-items: flex-start;
    &::before {
      font-size: 40px !important;
    }
  }
`;

const MobileItemIssues = styled('div')`
  margin: 0;
  font-size: 14px;
  flex: 1 1 0;
`;

const MobileItemName = styled('h4')`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MobileItemNameIssuesContainer = styled('div')`
  display: block;
  @media (max-width: 374px) {
    display: none;
  }
`;

const MobileSmallItemIssuesContainer = styled('div')`
  @media (min-width: 375px) {
    display: none;
  }
  width: 100%;
  margin-top: -12px;
`;

const MobileSmallItemNameContainer = styled('div')`
  @media (min-width: 375px) {
    display: none;
  }
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
  margin: 16px;
  max-width: 100% !important;
  @media (max-width: 476px) {
    margin: 16px 0;
  }
`));

const SourceLink = styled('div')`
  float: right;
  margin-bottom: -4px;
`;

const TwitterFollowersWrapper = styled('span')`
  color: #000;
`;

const TwitterHandleWrapper = styled('span')`
  color: #000;
  margin-right: 5px;
`;

export default withTheme(withStyles(styles)(PositionItem));
