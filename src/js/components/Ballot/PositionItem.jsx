import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ReactSVG from 'react-svg';
import { cordovaDot } from '../../utils/cordovaUtils';
import FollowToggle from '../Widgets/FollowToggle';
import FriendStore from '../../stores/FriendStore';
import ImageHandler from '../ImageHandler';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import OrganizationStore from '../../stores/OrganizationStore';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';
import PositionItemScorePopover from '../Widgets/PositionItemScorePopover';
import ReadMore from '../Widgets/ReadMore';
import StickyPopover from './StickyPopover';
import { numberWithCommas } from '../../utils/textFormat';

class PositionItem extends Component {
  static propTypes = {
    classes: PropTypes.object,
    position: PropTypes.object.isRequired,
    params: PropTypes.object,
    searchResultsNode: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizationInVotersNetwork: false,
    };
  }

  componentDidMount () {
    // console.log('PositionItem componentDidMount');
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
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
      // let voterWeVoteIdForThisOrganization = '';
      // if (voterIsFriendsWithThisOrganization && position.voter_we_vote_id) {
      //   voterWeVoteIdForThisOrganization = position.voter_we_vote_id;
      // }
      // console.log('voterIsFriendsWithThisOrganization:', voterIsFriendsWithThisOrganization);
      // console.log('voterWeVoteIdForThisOrganization:', voterWeVoteIdForThisOrganization);
      this.setState({
        organizationInVotersNetwork,
        voterIsFriendsWithThisOrganization,
      });
    }
  }

  render () {
    renderLog('PositionItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, position } = this.props;
    if (!position) {
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
    if (this.props.params) {
      if (this.props.params.candidate_we_vote_id) {
        speakerLink += `/btcand/${this.props.params.candidate_we_vote_id}`;
        backToCandidateFound = true;
      } else if (this.props.params.measure_we_vote_id) {
        speakerLink += `/btmeas/${this.props.params.measure_we_vote_id}`;
        backToMeasureFound = true;
      }
      if (backToCandidateFound || backToMeasureFound) {
        if (this.props.params.back_to_variable) {
          speakerLink += `/b/${this.props.params.back_to_variable}`;
        }
      }
    }

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      imagePlaceholder = (
        <ReactSVG
          src={cordovaDot('/img/global/svg-icons/organization-icon.svg')}
        />
      );
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      imagePlaceholder = (
        <ReactSVG
          src={cordovaDot('/img/global/svg-icons/avatar-generic.svg')}
        />
      );
    }

    // console.log(position);
    let supportOpposeInfo = 'InfoButNotPartOfScore';
    if (position.is_information_only) {
      supportOpposeInfo = 'InfoButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportAndPartOfScore';
    } else if (!organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_oppose) {
      supportOpposeInfo = 'OpposeAndPartOfScore';
    } else if (!position.support) {
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
          positionItem={position}
          showPersonalScoreInformation
        />
      );

      const positionItemSupportSquare = (
        <div>
          {supportOpposeInfo === 'SupportAndPartOfScore' ? (
            <OrganizationSupportWrapper>
              <SupportAndPartOfScore>
                +1
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
                    -1
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
                          <ThumbUpIcon />
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
                              <ThumbDownIcon />
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
                                  <InfoIcon />
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
          <div className="u-show-desktop-tablet">
            {this.props.searchResultsNode}
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
              <PositionItemDesktop className={`position-item--${supportOpposeInfo} position-item`}>
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
                            <Link to={speakerLink} id={`desktop-LinkToEndorsingOrganization-${organizationWeVoteId}`}>
                              { position.speaker_display_name }
                            </Link>
                          </div>
                        </StickyPopover>
                      </DesktopItemName>
                      <DesktopItemTwitterContainer>
                        { !!(position.twitter_followers_count && String(position.twitter_followers_count) !== '0') && (
                          <DesktopItemTwitter>
                            <TwitterIcon className="fab fa-twitter" />
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
                          body={(
                            <span>
                              view source
                              {' '}
                              <i className="fas fa-external-link-alt" aria-hidden="true" />
                            </span>
                          )}
                          className="u-gray-mid"
                          target="_blank"
                          url={moreInfoUrl}
                        />
                      </SourceLink>
                    ) : null
                    }
                  </DesktopItemFooter>
                </DesktopItemBody>
              </PositionItemDesktop>
            </DesktopContainer>
          </div>
          <div className="u-show-mobile">
            <PositionItemMobile className={`position-item--${supportOpposeInfo} position-item`}>
              {this.props.searchResultsNode}
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
                    <Link to={speakerLink} className="u-break-word" id={`mobile-LinkToEndorsingOrganization-${organizationWeVoteId}`}>
                      { position.speaker_display_name }
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
                      { position.speaker_display_name }
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
                        body={(
                          <span>
                            source
                            {' '}
                            <i className="fas fa-external-link-alt" aria-hidden="true" />
                          </span>
                        )}
                        className="u-gray-mid"
                        target="_blank"
                        url={moreInfoUrl}
                      />
                    </SourceLink>
                  ) : null
                  }
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

const styles = theme => ({
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

const PositionItemMobile = styled.li`
  background: #eee;
  border-radius: 5px;
  margin: 16px;
  list-style: none;
  @media (max-width: 476px) {
    margin: 16px 0;
  }
  max-width: 100% !important;
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

const MobileSmallItemNameContainer = styled.div`
  @media (min-width: 375px) {
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

const MobileItemIssues = styled.div`
  margin: 0;
  font-size: 14px;
  flex: 1 1 0;
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

const MobileItemBody = styled.div`
  padding: 6px 6px 6px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescriptionFollowToggleContainer = styled.div`
  left: 2px;
  display: flex;
  justify-content: space-between;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
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

const DesktopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 24px 24px 24px;
`;

const DesktopItemLeft = styled.div`
  width: 85px;
  padding: 0 16px 0 0;
`;

const DesktopItemImage = styled.div`
  width: 57.76px;
  margin: 0 auto;
  height: 57.76px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 8px;
  * {
    border-radius: 6px;
    width: 57.76px !important;
    height: 57.76px !important;
    max-width: 57.76px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const PositionItemDesktop = styled.div`
  border-radius: 5px;
  list-style: none;
  padding: 6px 16px;
  background: #eee;
  flex: 1 1 0;
`;

const DesktopItemHeader = styled.div`
  display: flex;
  align-items: top;
  justify-content: flex-start;
`;

const DesktopItemNameIssueContainer = styled.div`
  padding: 0px;
`;

const DesktopItemNameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const DesktopItemName = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const DesktopItemIssues = styled.div`
  margin: 0;
  padding: 0;
`;

const DesktopItemEndorsementDisplay = styled.div`
  margin-left: auto;
  padding: 0;
`;

const DesktopItemBody = styled.div`
  margin: 0;
`;

const DesktopItemDescription = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemFooter = styled.div`
  font-size: 12px;
  margin-top: 2px;
`;

const DesktopItemTwitterContainer = styled.div`
`;

const DesktopItemTwitter = styled.div`
  color: #999;
  display: inline-block;
  font-size: 12px;
  padding-left: 10px;
  white-space: nowrap;
`;

const SupportAndPartOfScore = styled.div`
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  @media print{
    border: 2px solid grey;
  }
`;

const OpposeAndPartOfScore = styled.div`
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  @media print{
    border: 2px solid grey;
  }
`;

const OverlayImage = styled.div`
  margin-left: -2px;
  margin-top: -17px;
  z-index: 2;
`;

const SourceLink = styled.div`
  float: right;
  margin-bottom: -4px;
`;

const TwitterIcon = styled.span`
  font-size: 16px;
  color: #ccc;
  margin-right: 2px;
  vertical-align: bottom;
`;

const OrganizationSupportWrapper = styled.div`
  position: relative;
  z-index: 1;
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

const OrganizationSupportIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
`;

const OrganizationOpposeWrapper = styled.div`
  position: relative;
  z-index: 1;
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

const OrganizationOpposeIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '2px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-2px' : '0')};
`;

const OrganizationInformationOnlyWrapper = styled.div`
  position: relative;
  z-index: 1;
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

const OrganizationInfoOnlyIconWrapper = styled.div`
  margin-left: ${({ speakerImageExists }) => (speakerImageExists ? '4px' : '0')};
  margin-top: ${({ speakerImageExists }) => (speakerImageExists ? '-5px' : '0')};
`;

export default withTheme(withStyles(styles)(PositionItem));
