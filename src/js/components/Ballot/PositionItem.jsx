import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Info, ThumbDown, ThumbUp, Twitter } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';
import { numberWithCommas } from '../../utils/textFormat';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import ExternalLinkIcon from '../Widgets/ExternalLinkIcon';
import PositionItemScorePopover from '../Widgets/PositionItemScorePopover';
import SvgImage from '../Widgets/SvgImage';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../Widgets/ReadMore'));
const StickyPopover = React.lazy(() => import(/* webpackChunkName: 'StickyPopover' */ './StickyPopover'));


class PositionItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationInVotersNetwork: false,
    };
  }

  componentDidMount () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionItem componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // We want to make sure we have all of the position information so that comments show up
    if (ballotItemWeVoteId) {
      const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

      if (voterGuidesForThisBallotItem) {
        voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
          // console.log('oneVoterGuide: ', oneVoterGuide);
          if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
            }
          }
        });
      }
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.ballotItemDisplayName !== nextProps.ballotItemDisplayName) {
  //     // console.log('this.props.ballotItemDisplayName: ', this.props.ballotItemDisplayName, ', nextProps.ballotItemDisplayName', nextProps.ballotItemDisplayName);
  //     return true;
  //   }
  //   if (this.props.searchResultsNode !== nextProps.searchResultsNode) {
  //     // console.log('this.props.searchResultsNode: ', this.props.searchResultsNode, ', nextProps.searchResultsNode', nextProps.searchResultsNode);
  //     return true;
  //   }
  //   if (this.state.componentDidMount !== nextState.componentDidMount) {
  //     // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount', nextState.componentDidMount);
  //     return true;
  //   }
  //   if (this.state.organizationInVotersNetwork !== nextState.organizationInVotersNetwork) {
  //     // console.log('this.state.organizationInVotersNetwork: ', this.state.organizationInVotersNetwork, ', nextState.organizationInVotersNetwork', nextState.organizationInVotersNetwork);
  //     return true;
  //   }
  //   if (this.state.voterIsFriendsWithThisOrganization !== nextState.voterIsFriendsWithThisOrganization) {
  //     // console.log('this.state.voterIsFriendsWithThisOrganization: ', this.state.voterIsFriendsWithThisOrganization, ', nextState.voterIsFriendsWithThisOrganization', nextState.voterIsFriendsWithThisOrganization);
  //     return true;
  //   }
  //   const { position: priorPosition } = this.props;
  //   const { position: nextPosition } = nextProps;
  //   if (priorPosition.speaker_we_vote_id !== nextPosition.speaker_we_vote_id) {
  //     // console.log('priorPosition.speaker_we_vote_id: ', priorPosition.speaker_we_vote_id, ', nextPosition.speaker_we_vote_id:', nextPosition.speaker_we_vote_id);
  //     return true;
  //   }
  //   // if (priorPosition.organization_we_vote_id !== nextPosition.organization_we_vote_id) {
  //   //   console.log('priorPosition.organization_we_vote_id: ', priorPosition.organization_we_vote_id, ', nextPosition.organization_we_vote_id:', nextPosition.organization_we_vote_id);
  //   //   return true;
  //   // }
  //   if (priorPosition.statement_text !== nextPosition.statement_text) {
  //     // console.log('priorPosition.statement_text: ', priorPosition.statement_text, ', nextPosition.statement_text:', nextPosition.statement_text);
  //     return true;
  //   }
  //   if (priorPosition.speaker_twitter_handle !== nextPosition.speaker_twitter_handle) {
  //     // console.log('priorPosition.speaker_twitter_handle: ', priorPosition.speaker_twitter_handle, ', nextPosition.speaker_twitter_handle:', nextPosition.speaker_twitter_handle);
  //     return true;
  //   }
  //   if (priorPosition.is_information_only !== nextPosition.is_information_only) {
  //     // console.log('priorPosition.is_information_only: ', priorPosition.is_information_only, ', nextPosition.is_information_only:', nextPosition.is_information_only);
  //     return true;
  //   }
  //   if (priorPosition.is_oppose !== nextPosition.is_oppose) {
  //     // console.log('priorPosition.is_oppose: ', priorPosition.is_oppose, ', nextPosition.is_oppose:', nextPosition.is_oppose);
  //     return true;
  //   }
  //   if (priorPosition.is_support !== nextPosition.is_support) {
  //     // console.log('priorPosition.is_oppose: ', priorPosition.is_oppose, ', nextPosition.is_oppose:', nextPosition.is_oppose);
  //     return true;
  //   }
  //   let priorPositionFollowed = false;
  //   let nextPositionFollowed = false;
  //   if (priorPosition.followed !== undefined) {
  //     priorPositionFollowed = priorPosition.followed;
  //   }
  //   if (nextPosition.followed !== undefined) {
  //     nextPositionFollowed = nextPosition.followed;
  //   }
  //   if (priorPositionFollowed !== nextPositionFollowed) {
  //     // console.log('priorPositionFollowed: ', priorPositionFollowed, ', nextPositionFollowed:', nextPositionFollowed);
  //     return true;
  //   }
  //   // console.log('PositionItem shouldComponentUpdate return FALSE');
  //   return false;
  // }

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
      const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
      const updatedPosition = OrganizationStore.getPositionByPositionWeVoteId(position.position_we_vote_id);

      this.setState({
        organizationInVotersNetwork,
        updatedPosition,
        voterIsFriendsWithThisOrganization,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;

    // We want to make sure we have all of the position information so that comments show up
    if (ballotItemWeVoteId) {
      const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

      if (voterGuidesForThisBallotItem) {
        voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
          // console.log('oneVoterGuide: ', oneVoterGuide);
          if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
            }
          }
        });
      }
    }
  }

  closeOrganizationModal () {
    AppObservableStore.setShowOrganizationModal(false);
  }

  render () {
    renderLog('PositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    const { classes, searchResultsNode } = this.props;
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
    const { organizationInVotersNetwork, voterIsFriendsWithThisOrganization } = this.state;

    // TwitterHandle-based link
    const voterGuideWeVoteIdLink = `/voterguide/${organizationWeVoteId}`;
    let speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : voterGuideWeVoteIdLink;
    let backToCandidateFound = false;
    let backToMeasureFound = false;
    const { params } = this.props;
    if (params) {
      if (params.candidate_we_vote_id) {
        speakerLink += `/btcand/${params.candidate_we_vote_id}`;
        backToCandidateFound = true;
      } else if (params.measure_we_vote_id) {
        speakerLink += `/btmeas/${params.measure_we_vote_id}`;
        backToMeasureFound = true;
      }
      if (backToCandidateFound || backToMeasureFound) {
        if (params.back_to_variable) {
          speakerLink += `/b/${params.back_to_variable}`;
        }
      }
    }

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
      imagePlaceholder = (
        <SvgImage imageName="organization-icon" />
      );
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      const avatar = cordovaDot('../../img/global/svg-icons/avatar-generic.svg');
      imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
    }

    // console.log(position);
    const organizationSupportsBallotItem = position.is_support;
    const organizationOpposesBallotItem = position.is_oppose;
    let supportOpposeInfo = 'InfoButNotPartOfScore';
    if (position.is_information_only) {
      supportOpposeInfo = 'InfoButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportAndPartOfScore';
    } else if (!organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_oppose) {
      supportOpposeInfo = 'OpposeAndPartOfScore';
    } else if (!position.is_support) {
      supportOpposeInfo = 'OpposeButNotPartOfScore';
    }

    // console.log('PositionItem supportOpposeInfo: ', supportOpposeInfo);
    const positionDescription = position.statement_text && (
      <ReadMore
        numberOfLines={3}
        textToDisplay={position.statement_text}
      />
    );

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      const organizationPopoverCard = (<OrganizationPopoverCard organizationWeVoteId={organizationWeVoteId} />);
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

      const positionItemSupportSquare = (
        <div>
          {supportOpposeInfo === 'SupportAndPartOfScore' ? (
            <OrganizationSupportWrapper>
              <SupportAndPartOfScore>
                <ScoreNumberWrapper advisorImageExists={position.speaker_image_url_https_medium}>
                  +1
                </ScoreNumberWrapper>
                <ToScoreLabel advisorImageExists={position.speaker_image_url_https_medium} className="u-no-break">
                  to score
                </ToScoreLabel>
              </SupportAndPartOfScore>
              {position.speaker_image_url_https_medium && (
                <OverlayImage>
                  <ImageHandler
                    alt="organization-photo-16x16"
                    className="image-border-support "
                    imageUrl={position.speaker_image_url_https_medium}
                    kind_of_ballot_item="ORGANIZATION"
                    sizeClassName="image-16x16 "
                  />
                </OverlayImage>
              )}
            </OrganizationSupportWrapper>
          ) : (
            <>
              {supportOpposeInfo === 'OpposeAndPartOfScore' ? (
                <OrganizationOpposeWrapper>
                  <OpposeAndPartOfScore>
                    <ScoreNumberWrapper advisorImageExists={position.speaker_image_url_https_medium}>
                      -1
                    </ScoreNumberWrapper>
                    {position.speaker_image_url_https_medium ? (
                      <FromScoreLabel>
                        from score
                      </FromScoreLabel>
                    ) : (
                      <FromScoreLabelNoImage>
                        from score
                      </FromScoreLabelNoImage>
                    )}
                  </OpposeAndPartOfScore>
                  {position.speaker_image_url_https_medium && (
                    <OverlayImage>
                      <ImageHandler
                        alt="organization-photo-16x16"
                        className="image-border-oppose "
                        imageUrl={position.speaker_image_url_https_medium}
                        kind_of_ballot_item="ORGANIZATION"
                        sizeClassName="image-16x16 "
                      />
                    </OverlayImage>
                  )}
                </OrganizationOpposeWrapper>
              ) : (
                <>
                  {supportOpposeInfo === 'SupportButNotPartOfScore' ? (
                    <OrganizationSupportWrapper>
                      <OrganizationSupportSquare>
                        <OrganizationSupportIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                          <ThumbUp />
                        </OrganizationSupportIconWrapper>
                      </OrganizationSupportSquare>
                      {position.speaker_image_url_https_medium && (
                        <OverlayImage>
                          <ImageHandler
                            alt="organization-photo-16x16"
                            className="image-border-support "
                            imageUrl={position.speaker_image_url_https_medium}
                            kind_of_ballot_item="ORGANIZATION"
                            sizeClassName="image-16x16 "
                          />
                        </OverlayImage>
                      )}
                    </OrganizationSupportWrapper>
                  ) : (
                    <>
                      {supportOpposeInfo === 'OpposeButNotPartOfScore' ? (
                        <OrganizationOpposeWrapper>
                          <OrganizationOpposeSquare>
                            <OrganizationOpposeIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                              <ThumbDown />
                            </OrganizationOpposeIconWrapper>
                          </OrganizationOpposeSquare>
                          {position.speaker_image_url_https_medium && (
                            <OverlayImage>
                              <ImageHandler
                                alt="organization-photo-16x16"
                                className="image-border-oppose "
                                imageUrl={position.speaker_image_url_https_medium}
                                kind_of_ballot_item="ORGANIZATION"
                                sizeClassName="image-16x16 "
                              />
                            </OverlayImage>
                          )}
                        </OrganizationOpposeWrapper>
                      ) : (
                        <>
                          {supportOpposeInfo === 'InfoButNotPartOfScore' && (
                            <OrganizationInformationOnlyWrapper>
                              <OrganizationInformationOnlySquare>
                                <OrganizationInfoOnlyIconWrapper speakerImageExists={!!(position.speaker_image_url_https_medium)}>
                                  <Info />
                                </OrganizationInfoOnlyIconWrapper>
                              </OrganizationInformationOnlySquare>
                              {position.speaker_image_url_https_medium && (
                                <OverlayImage>
                                  <ImageHandler
                                    alt="organization-photo-16x16"
                                    className="image-border-gray-border "
                                    imageUrl={position.speaker_image_url_https_medium}
                                    kind_of_ballot_item="ORGANIZATION"
                                    sizeClassName="image-16x16 "
                                  />
                                </OverlayImage>
                              )}
                            </OrganizationInformationOnlyWrapper>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      );

      return (
        <>
          {searchResultsNode}
          <div className="u-show-desktop-tablet">
            <DesktopContainer>
              <DesktopItemLeft>
                <DesktopItemImage>
                  <StickyPopover
                    delay={{ show: 700, hide: 100 }}
                    popoverComponent={organizationPopoverCard}
                    placement="auto"
                    id="positions-organization-popover-trigger-click-root-close"
                  >
                    <div>
                      <Link
                        to={speakerLink}
                        className="u-no-underline"
                      >
                        { position.speaker_image_url_https_medium ? (
                          <ImageHandler
                            className="card-child__avatar"
                            sizeClassName="icon-lg"
                            imageUrl={position.speaker_image_url_https_medium}
                          />
                        ) :
                          imagePlaceholder }
                      </Link>
                    </div>
                  </StickyPopover>
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
                  <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing anchorLeft platformType="desktop" />
                )}
              </DesktopItemLeft>
              <PositionItemDesktop isSupport={organizationSupportsBallotItem} isOppose={organizationOpposesBallotItem}>
                <DesktopItemHeader>
                  <DesktopItemNameIssueContainer>
                    <DesktopItemNameContainer>
                      <DesktopItemName>
                        <StickyPopover
                          delay={{ show: 700, hide: 100 }}
                          popoverComponent={organizationPopoverCard}
                          placement="auto"
                          id="positions-popover-trigger-click-root-close"
                        >
                          <div>
                            <Link
                              id={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                              onClick={this.closeOrganizationModal}
                              to={speakerLink}
                            >
                              { positionSpeakerDisplayName }
                            </Link>
                          </div>
                        </StickyPopover>
                      </DesktopItemName>
                      <DesktopItemTwitterContainer>
                        { !!(position.twitter_followers_count && String(position.twitter_followers_count) !== '0') && (
                          <DesktopItemTwitter>
                            <Twitter />
                            {numberWithCommas(position.twitter_followers_count)}
                          </DesktopItemTwitter>
                        )}
                      </DesktopItemTwitterContainer>
                    </DesktopItemNameContainer>
                    <DesktopItemIssues>
                      <IssuesByOrganizationDisplayList
                        organizationWeVoteId={organizationWeVoteId}
                        placement="auto"
                      />
                    </DesktopItemIssues>
                  </DesktopItemNameIssueContainer>
                  <DesktopItemEndorsementDisplay>
                    <StickyPopover
                      delay={{ show: 700, hide: 100 }}
                      popoverComponent={positionsPopover}
                      placement="auto"
                      id="position-item-score-desktop-popover-trigger-click-root-close"
                      key={`positionItemScoreDesktopPopover-${organizationWeVoteId}`}
                      openOnClick
                      showCloseIcon
                    >
                      {positionItemSupportSquare}
                    </StickyPopover>
                  </DesktopItemEndorsementDisplay>
                </DesktopItemHeader>
                <DesktopItemBody>
                  <DesktopItemDescription>
                    {positionDescription}
                  </DesktopItemDescription>
                  <DesktopItemFooter>
                    {/* <strong>Was this Useful?</strong>
                    Yes  No
                    <div className="u-float-right">
                      Flag Links
                    </div> */}
                    {moreInfoUrl ? (
                      <SourceLink>
                        <OpenExternalWebSite
                          linkIdAttribute="moreInfoDesktop"
                          body={(
                            <span>
                              view source
                              {' '}
                              <ExternalLinkIcon />
                            </span>
                          )}
                          className="u-gray-mid"
                          target="_blank"
                          url={moreInfoUrl}
                        />
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
                  <Link to={speakerLink} className="u-no-underline">
                    { position.speaker_image_url_https_medium ? (
                      <ImageHandler
                        className="card-child__avatar"
                        sizeClassName="icon-lg"
                        imageUrl={position.speaker_image_url_https_medium}
                      />
                    ) :
                      imagePlaceholder }
                  </Link>
                </MobileItemImage>
                {/* Visible for most phones */}
                <MobileItemNameIssuesContainer>
                  <MobileItemName>
                    <Link
                      className="u-break-word"
                      id={`mobile-LinkToEndorsingOrganization-${organizationWeVoteId}`}
                      onClick={this.closeOrganizationModal}
                      to={speakerLink}
                    >
                      { positionSpeakerDisplayName }
                    </Link>
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
                    <Link to={speakerLink} className="u-break-word">
                      { positionSpeakerDisplayName }
                    </Link>
                  </MobileItemName>
                </MobileSmallItemNameContainer>
                <MobileItemEndorsementContainer>
                  <MobileItemEndorsementDisplay>
                    <StickyPopover
                      delay={{ show: 1000000, hide: 100 }}
                      popoverComponent={positionsPopover}
                      placement="auto"
                      id="position-item-score-mobile-popover-trigger-click-root-close"
                      key={`positionItemScoreMobilePopover-${organizationWeVoteId}`}
                      openOnClick
                      showCloseIcon
                    >
                      {positionItemSupportSquare}
                    </StickyPopover>
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
                      <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing platformType="mobile" />
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
                      <OpenExternalWebSite
                        linkIdAttribute="moreInfoMobile"
                        body={(
                          <span>
                            source
                            {' '}
                            <ExternalLinkIcon />
                          </span>
                        )}
                        className="u-gray-mid"
                        target="_blank"
                        url={moreInfoUrl}
                      />
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
  position: PropTypes.object.isRequired,
  searchResultsNode: PropTypes.object,
  params: PropTypes.object,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const DesktopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 24px 24px 24px;
`;

const DesktopItemBody = styled.div`
  margin: 0;
`;

const DesktopItemDescription = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemEndorsementDisplay = styled.div`
  margin-left: auto;
  padding: 0;
`;

const DesktopItemFooter = styled.div`
  font-size: 12px;
  margin-top: 2px;
`;

const DesktopItemHeader = styled.div`
  display: flex;
  // align-items: top;   // nonsense property value, commented out July 7, 2021
  justify-content: flex-start;
`;

const DesktopItemImage = styled.div`
  width: 57.76px;
  margin: 0 auto 8px auto;
  height: 57.76px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  * {
    border-radius: 6px;
    width: 57.76px !important;
    height: 57.76px !important;
    max-width: 57.76px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const DesktopItemIssues = styled.div`
  margin: 0;
  padding: 0;
`;

const DesktopItemLeft = styled.div`
  width: 85px;
  padding: 0 16px 0 0;
`;

const DesktopItemName = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const DesktopItemNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DesktopItemNameIssueContainer = styled.div`
  padding: 0;
`;

const DesktopItemTwitter = styled.div`
  color: #999;
  display: inline-block;
  font-size: 12px;
  padding-left: 10px;
  white-space: nowrap;
`;

const DesktopItemTwitterContainer = styled.div`
`;

const FromScoreLabel = styled.div`
  font-size: 10px;
  line-height: .7;
  margin-top: -13px;
  margin-left: 15px;
`;

const FromScoreLabelNoImage = styled.div`
  font-size: 10px;
  line-height: .7;
  margin-top: -13px;
  margin-left: 9px;
`;

const MobileItemBody = styled.div`
  padding: 6px 6px 6px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

const MobileItemDescriptionFollowToggleContainer = styled.div`
  left: 2px;
  display: flex;
  justify-content: space-between;
`;

const MobileItemEndorsementContainer = styled.div`
  margin-left: auto;
  margin-bottom: auto;
  width: 50px;
  height: 100%;
  max-height: 100%;
`;

const MobileItemEndorsementDisplay = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 4px;
`;

const MobileItemFollowToggleDisplay = styled.div`
  width: 75px;
`;

const MobileItemFooter = styled.div`
  height: 20px;
  width: 100%;
  margin-top: 2px;
  font-size: 12px;
`;

const MobileItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 6px 0 6px 8px;
  min-height: 46px;
`;

const MobileItemImage = styled.div`
  margin-right: 16px;
  width: 40px;
  height: 40px;
  * {
    border-radius: 4px;
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

const MobileItemIssues = styled.div`
  margin: 0;
  font-size: 14px;
  flex: 1 1 0;
`;

const MobileItemName = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MobileItemNameIssuesContainer = styled.div`
  display: block;
  @media (max-width: 374px) {
    display: none;
  }
`;

const MobileSmallItemIssuesContainer = styled.div`
  @media (min-width: 375px) {
    display: none;
  }
  width: 100%;
  margin-top: -12px;
`;

const MobileSmallItemNameContainer = styled.div`
  @media (min-width: 375px) {
    display: none;
  }
`;

const OpposeAndPartOfScore = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
  height: 40px;
  @media print{
    border: 2px solid grey;
  }
`;

const OrganizationInfoOnlyIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '4px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-5px' : '0')};
`;

const OrganizationInformationOnlySquare = styled.div`
  color: ${({ theme }) => theme.colors.grayMid};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 3px solid ${({ theme }) => theme.colors.grayMid};
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationInformationOnlyWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OrganizationOpposeIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-2px' : '0')};
`;

const OrganizationOpposeSquare = styled.div`
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.opposeRedRgb};
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationOpposeWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OrganizationSupportIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
`;

const OrganizationSupportSquare = styled.div`
  align-items: center;
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`;

const OrganizationSupportWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OverlayImage = styled.div`
  margin-left: -2px;
  margin-top: -17px;
  z-index: 2;
`;

const PositionItemDesktop = styled.div`
  background: #eee;
  ${({ isSupport, isOppose }) => ((!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : '')}
  ${({ isOppose }) => (isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : '')}
  ${({ isSupport }) => (isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : '')}
  border-radius: 5px;
  flex: 1 1 0;
  list-style: none;
  padding: 6px 16px;
`;

const PositionItemMobile = styled.li`
  background: #eee;
  ${({ isSupport, isOppose }) => ((!isOppose && !isSupport) ? 'border-left: 4px solid #ccc;' : '')}
  ${({ isOppose }) => (isOppose ? 'border-left: 4px solid rgb(255, 73, 34);' : '')}
  ${({ isSupport }) => (isSupport ? 'border-left: 4px solid rgb(31, 192, 111);' : '')}
  border-radius: 5px;
  list-style: none;
  margin: 16px;
  max-width: 100% !important;
  @media (max-width: 476px) {
    margin: 16px 0;
  }
`;

const ScoreNumberWrapper = styled.div`
  ${({ advisorImageExists }) => (advisorImageExists ? 'margin-top: -5px;' : 'margin-top: 0px;')}
`;

const SourceLink = styled.div`
  float: right;
  margin-bottom: -4px;
`;

const SupportAndPartOfScore = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
  height: 40px;
  @media print{
    border: 2px solid grey;
  }
`;

const ToScoreLabel = styled.div`
  font-size: 10px;
  ${({ advisorImageExists }) => (advisorImageExists ? 'margin-top: -23px;' : 'margin-top: -20px;')}
`;

// const TwitterIcon = styled.span`
//   font-size: 16px;
//   color: #ccc;
//   margin-right: 2px;
//   vertical-align: bottom;
// `;

export default withTheme(withStyles(styles)(PositionItem));
