import { withStyles, withTheme } from '@material-ui/core/styles';
import { Info, Twitter } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import TextTruncate from 'react-text-truncate'; // Replace with: import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import SupportStore from '../../stores/SupportStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { isAndroidSizeMD } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import isMobileAndTabletScreenSize from '../../utils/isMobileAndTabletScreenSize';
import { renderLog } from '../../common/utils/logging';
import { abbreviateNumber, numberWithCommas, stripHtmlFromString } from '../../utils/textFormat';
import ExternalLinkIcon from '../../common/components/Widgets/ExternalLinkIcon';

const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const IssuesByBallotItemDisplayList = React.lazy(() => import(/* webpackChunkName: 'IssuesByBallotItemDisplayList' */ '../Values/IssuesByBallotItemDisplayList'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const ShowMoreFooter = React.lazy(() => import(/* webpackChunkName: 'ShowMoreFooter' */ '../Navigation/ShowMoreFooter'));
const TopCommentByBallotItem = React.lazy(() => import(/* webpackChunkName: 'TopCommentByBallotItem' */ '../Widgets/TopCommentByBallotItem'));


// This is related to /js/components/VoterGuide/OrganizationVoterGuideCandidateItem.jsx
class CandidateItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidateLength: 0,
      ballotItemDisplayName: '',
      ballotpediaCandidateUrl: '',
      candidatePhotoUrl: '',
      candidateUrl: '',
      contestOfficeName: '',
      candidateWeVoteId: '',
      issuesUnderThisBallotItemVoterIsFollowingLength: 0,
      issuesUnderThisBallotItemVoterIsNotFollowingLength: 0,
      largeAreaHoverColorOnNow: null,
      largeAreaHoverLinkOnNow: false,
      officeWeVoteId: '',
      politicalParty: '',
      twitterFollowersCount: '',
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      voterTextStatement: '',
    };
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  componentDidMount () {
    // console.log('CandidateItem componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log('CandidateItem, this.props:', this.props);
    const { candidateWeVoteId, showLargeImage } = this.props;
    if (candidateWeVoteId) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);
      // console.log('CandidateItem, componentDidMount, candidate:', candidate);

      let candidatePhotoUrl;
      if (showLargeImage && candidate.candidate_photo_url_large) {
        candidatePhotoUrl = candidate.candidate_photo_url_large;
      } else if (candidate.candidate_photo_url_medium) {
        candidatePhotoUrl = candidate.candidate_photo_url_medium;
      } else if (candidate.candidate_photo_url_tiny) {
        candidatePhotoUrl = candidate.candidate_photo_url_tiny;
      }
      const candidateUrl = candidate.candidate_url;
      const twitterDescription = candidate.twitter_description;
      const twitterDescriptionText = twitterDescription && twitterDescription.length ? `${twitterDescription} ` : '';
      const ballotpediaCandidateSummary = candidate.ballotpedia_candidate_summary;
      let ballotpediaCandidateSummaryText = ballotpediaCandidateSummary && ballotpediaCandidateSummary.length ? ballotpediaCandidateSummary : '';
      ballotpediaCandidateSummaryText = stripHtmlFromString(ballotpediaCandidateSummaryText);
      const candidateText = twitterDescriptionText + ballotpediaCandidateSummaryText;
      const voterOpposesBallotItem = SupportStore.getVoterOpposesByBallotItemWeVoteId(candidateWeVoteId);
      const voterSupportsBallotItem = SupportStore.getVoterSupportsByBallotItemWeVoteId(candidateWeVoteId);
      const voterTextStatement = SupportStore.getVoterTextStatementByBallotItemWeVoteId(candidateWeVoteId);
      this.setState({
        ballotItemDisplayName: candidate.ballot_item_display_name,
        ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
        candidatePhotoUrl,
        candidateText,
        candidateUrl,
        candidateWeVoteId, // Move into state to signal that all state data is ready
        contestOfficeName: candidate.contest_office_name,
        officeWeVoteId: candidate.contest_office_we_vote_id,
        politicalParty: candidate.party,
        twitterFollowersCount: candidate.twitter_followers_count,
        voterOpposesBallotItem,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.allCachedPositionsForThisCandidateLength !== nextState.allCachedPositionsForThisCandidateLength) {
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      return true;
    }
    if (this.state.candidatePhotoUrl !== nextState.candidatePhotoUrl) {
      return true;
    }
    if (this.state.candidateText !== nextState.candidateText) {
      return true;
    }
    if (this.state.candidateUrl !== nextState.candidateUrl) {
      return true;
    }
    if (this.state.candidateWeVoteId !== nextState.candidateWeVoteId) {
      return true;
    }
    if (this.props.closeSupportOpposeCountDisplayModal !== nextProps.closeSupportOpposeCountDisplayModal) {
      return true;
    }
    if (this.state.issuesUnderThisBallotItemVoterIsFollowingLength !== nextState.issuesUnderThisBallotItemVoterIsFollowingLength) {
      return true;
    }
    if (this.state.issuesUnderThisBallotItemVoterIsNotFollowingLength !== nextState.issuesUnderThisBallotItemVoterIsNotFollowingLength) {
      return true;
    }
    if (this.state.largeAreaHoverColorOnNow !== nextState.largeAreaHoverColorOnNow) {
      return true;
    }
    if (this.props.openAdviserMaterialUIPopover !== nextProps.openAdviserMaterialUIPopover) {
      return true;
    }
    if (this.props.openSupportOpposeCountDisplayModal !== nextProps.openSupportOpposeCountDisplayModal) {
      return true;
    }
    if (this.props.organizationWeVoteId !== nextProps.organizationWeVoteId) {
      return true;
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      return true;
    }
    if (this.props.supportOpposeCountDisplayModalTutorialOn !== nextProps.supportOpposeCountDisplayModalTutorialOn) {
      return true;
    }
    if (this.props.supportOpposeCountDisplayModalTutorialText !== nextProps.supportOpposeCountDisplayModalTutorialText) {
      return true;
    }
    if (this.props.showDownArrow !== nextProps.showDownArrow) {
      return true;
    }
    if (this.props.showUpArrow !== nextProps.showUpArrow) {
      return true;
    }
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
      return true;
    }
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
      return true;
    }
    if (this.state.voterTextStatement !== nextState.voterTextStatement) {
      return true;
    }
    // console.log('CandidateItem shouldComponentUpdate FALSE');
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId, showLargeImage } = this.props;
    // console.log('CandidateItem onCandidateStoreChange, candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);
      // console.log('CandidateItem onCandidateStoreChange, candidate:', candidate);
      let candidatePhotoUrl;
      if (showLargeImage && candidate.candidate_photo_url_large) {
        candidatePhotoUrl = candidate.candidate_photo_url_large;
      } else if (candidate.candidate_photo_url_medium) {
        candidatePhotoUrl = candidate.candidate_photo_url_medium;
      } else if (candidate.candidate_photo_url_tiny) {
        candidatePhotoUrl = candidate.candidate_photo_url_tiny;
      }
      const candidateUrl = candidate.candidate_url;
      const twitterDescription = candidate.twitter_description;
      const twitterDescriptionText = twitterDescription && twitterDescription.length ? `${twitterDescription} ` : '';
      const ballotpediaCandidateSummary = candidate.ballotpedia_candidate_summary;
      let ballotpediaCandidateSummaryText = ballotpediaCandidateSummary && ballotpediaCandidateSummary.length ? ballotpediaCandidateSummary : '';
      ballotpediaCandidateSummaryText = stripHtmlFromString(ballotpediaCandidateSummaryText);
      const ballotpediaCandidateUrl = candidate.ballotpedia_candidate_url || '';
      const candidateText = twitterDescriptionText + ballotpediaCandidateSummaryText;
      const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
      const allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length || 0;
      this.setState({
        allCachedPositionsForThisCandidateLength,
        ballotItemDisplayName: candidate.ballot_item_display_name,
        ballotpediaCandidateUrl,
        candidatePhotoUrl,
        candidateText,
        candidateUrl,
        candidateWeVoteId, // Move into state to signal that all state data is ready
        contestOfficeName: candidate.contest_office_name,
        officeWeVoteId: candidate.contest_office_we_vote_id,
        politicalParty: candidate.party,
        twitterFollowersCount: candidate.twitter_followers_count,
      });
    }
  }

  onIssueStoreChange () {
    const { candidateWeVoteId } = this.props;
    // console.log('CandidateItem onIssueStoreChange candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(candidateWeVoteId) || [];
      const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(candidateWeVoteId) || [];
      const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
      const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
      this.setState({
        issuesUnderThisBallotItemVoterIsFollowingLength,
        issuesUnderThisBallotItemVoterIsNotFollowingLength,
      });
    }
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    const { candidateWeVoteId } = this.props;
    if (candidateWeVoteId) {
      const voterOpposesBallotItem = SupportStore.getVoterOpposesByBallotItemWeVoteId(candidateWeVoteId);
      const voterSupportsBallotItem = SupportStore.getVoterSupportsByBallotItemWeVoteId(candidateWeVoteId);
      this.setState({
        voterOpposesBallotItem,
        voterSupportsBallotItem,
      });
    }
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    const { candidateWeVoteId, organizationWeVoteId } = this.props;
    if (candidateWeVoteId) {
      if (organizationWeVoteId) {
        return `/candidate/${candidateWeVoteId}/bto/${organizationWeVoteId}`; // back-to-office
      } else {
        return `/candidate/${candidateWeVoteId}/b/btdo`; // back-to-default-office
      }
    }
    return '';
  }

  getOfficeLink () {
    const { organizationWeVoteId } = this.props;
    const { officeWeVoteId } = this.state;
    if (organizationWeVoteId && organizationWeVoteId !== '') {
      return `/office/${officeWeVoteId}/btvg/${organizationWeVoteId}`; // back-to-voter-guide
    } else if (officeWeVoteId) {
      return `/office/${officeWeVoteId}/b/btdb`; // back-to-default-ballot
    } else return '';
  }

  handleEnter = () => {
    // console.log('Handle largeAreaHoverColorOnNow', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverColorOnNow: true, largeAreaHoverLinkOnNow: true });
    }
  };

  handleLeave = () => {
    // console.log('Handle leave', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverColorOnNow: false, largeAreaHoverLinkOnNow: false });
    }
  };

  candidateRenderBlock = (candidateWeVoteId, useLinkToCandidatePage = false, forDesktop = false, openSupportOpposeCountDisplayModal = false) => {
    const {
      controlAdviserMaterialUIPopoverFromProp, closeSupportOpposeCountDisplayModal,
      hideCandidateUrl, linkToBallotItemPage, linkToOfficePage,
      openAdviserMaterialUIPopover,
      supportOpposeCountDisplayModalTutorialOn, supportOpposeCountDisplayModalTutorialText,
      showDownArrow, showUpArrow, showHover, showOfficeName,
    } = this.props;
    const {
      ballotItemDisplayName,
      candidatePhotoUrl,
      candidateUrl,
      contestOfficeName,
      largeAreaHoverColorOnNow,
      politicalParty,
      twitterFollowersCount,
    } = this.state;
    // console.log('CandidateItem candidateRenderBlock, candidateWeVoteId:', candidateWeVoteId, ', useLinkToCandidatePage:', useLinkToCandidatePage, ', forDesktop:', forDesktop, ', linkToBallotItemPage:', linkToBallotItemPage);
    // console.log('candidateRenderBlock candidatePhotoUrl: ', candidatePhotoUrl);
    return (
      <div>
        <CandidateWrapper className="card-main__media-object">
          <CandidateInfo
            isClickable={useLinkToCandidatePage === true}
            onClick={useLinkToCandidatePage === true ? () => this.goToCandidateLink() : null}
          >
            <div className="card-main__media-object-anchor">
              <ImageHandler
                className="card-main__avatar"
                sizeClassName="icon-office-child "
                imageUrl={candidatePhotoUrl}
                alt="candidate-photo"
                kind_of_ballot_item="CANDIDATE"
              />
            </div>
            <Candidate>
              <div className={`card-main__display-name ${linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? 'card__blue' : ''}`}>
                {ballotItemDisplayName}
              </div>
              {!!(twitterFollowersCount && forDesktop) && (
                <span
                  className={`u-show-desktop twitter-followers__badge ${linkToBallotItemPage ? 'u-cursor--pointer' : ''}`}
                  onClick={linkToBallotItemPage ? this.goToCandidateLink : null}
                >
                  <Twitter />
                  <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                </span>
              )}
              {(!hideCandidateUrl && candidateUrl && forDesktop) && (
                <ExternalWebSiteWrapper className="u-show-desktop">
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="candidateDesktop"
                      url={candidateUrl}
                      target="_blank"
                      className="u-gray-mid"
                      body={(
                        <span>
                          candidate website
                          {' '}
                          <ExternalLinkIcon />
                        </span>
                      )}
                    />
                  </Suspense>
                </ExternalWebSiteWrapper>
              )}
              { contestOfficeName && (
                <div className={linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? 'card__blue' : ''}>
                  <OfficeNameText
                    contestOfficeName={contestOfficeName}
                    officeLink={linkToOfficePage ? this.getOfficeLink() : ''}
                    politicalParty={politicalParty}
                    showOfficeName={showOfficeName}
                  />
                </div>
              )}
            </Candidate>
          </CandidateInfo>
          <BallotItemSupportOpposeCountDisplayWrapper>
            <Suspense fallback={<></>}>
              <BallotItemSupportOpposeCountDisplay
                ballotItemWeVoteId={candidateWeVoteId}
                closeSupportOpposeCountDisplayModal={closeSupportOpposeCountDisplayModal}
                controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                goToBallotItem={this.props.goToBallotItem}
                handleLeaveCandidateCard={forDesktop ? this.handleLeave : null}
                handleEnterCandidateCard={forDesktop ? this.handleEnter : null}
                hideEndorsementsOverview={this.props.hideEndorsementsOverview}
                hideShowMoreLink={!linkToBallotItemPage}
                openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                openSupportOpposeCountDisplayModal={openSupportOpposeCountDisplayModal}
                supportOpposeCountDisplayModalTutorialOn={supportOpposeCountDisplayModalTutorialOn}
                supportOpposeCountDisplayModalTutorialText={supportOpposeCountDisplayModalTutorialText}
                uniqueExternalId={forDesktop ? 'CandidateItem-Desktop' : 'CandidateItem-MobileTablet'}
                showDownArrow={showDownArrow}
                showUpArrow={showUpArrow}
              />
            </Suspense>
          </BallotItemSupportOpposeCountDisplayWrapper>
        </CandidateWrapper>
      </div>
    );
  };

  topCommentByBallotItem = (candidateWeVoteId, candidateText) => (
    <TopCommentByBallotItem
      ballotItemWeVoteId={candidateWeVoteId}
      hideMoreButton
    >
      {/* If there aren't any comments about the candidate, show the text description of the candidate */}
      { (candidateText && candidateText.length) ? (
        <div className={`u-stack--xs ${this.props.linkToBallotItemPage ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
          <div className="card-main__description">
            <TextTruncate
              line={2}
              truncateText="..."
              text={candidateText}
              textTruncateChild={null}
            />
          </div>
          {/* <span className="card-main__read-more-pseudo" /> */}
          {/* <span className="card-main__read-more-link"> */}
          {/*  &nbsp;more */}
          {/* </span> */}
        </div>
      ) : null }
    </TopCommentByBallotItem>
  );

  candidateIssuesAndCommentBlock = (candidateText, localUniqueId) => {
    const {
      candidateWeVoteId, expandIssuesByDefault, hideBallotItemSupportOpposeComment, hideCandidateText, hideIssuesRelatedToCandidate, hideShowMoreFooter,
      linkToBallotItemPage, showHover, showPositionStatementActionBar, showTopCommentByBallotItem, hidePositionPublicToggle, showPositionPublicToggle, inModal,
    } = this.props;
    const {
      ballotItemDisplayName, largeAreaHoverColorOnNow,
      largeAreaHoverLinkOnNow, voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement,
    } = this.state;
    // console.log('hideIssuesRelatedToCandidate: ', hideIssuesRelatedToCandidate);
    // console.log('showPositionStatementActionBar: ', showPositionStatementActionBar);

    return (
      <>
        <div className="card-main__actions">
          {hideBallotItemSupportOpposeComment ?
            null : (
              <BallotItemSupportOpposeComment
                hidePositionPublicToggle={hidePositionPublicToggle}
                inModal={inModal}
                showPositionPublicToggle={showPositionPublicToggle}
                ballotItemWeVoteId={candidateWeVoteId}
                externalUniqueId={`candidateItem-${localUniqueId}`}
                showPositionStatementActionBar={showPositionStatementActionBar}
              />
            )}
          {/* If there is a quote about the candidate, show that here. */}
          {showTopCommentByBallotItem ? (
            <>
              <div className="u-show-desktop">
                {linkToBallotItemPage && largeAreaHoverLinkOnNow && showHover ?
                  (
                    <div className="row">
                      <div className={`card__blue ${(voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement) ? 'col col-6' : 'col col-9'}`}>
                        <div onClick={this.goToCandidateLink} className="card-main__no-underline">
                          <br />
                          {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                        </div>
                      </div>
                      <div className={`${(voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement) ? 'col col-6' : 'col col-3'}`}>
                        <ItemActionBar
                          showPositionPublicToggle={showPositionPublicToggle}
                          inModal={inModal}
                          ballotItemWeVoteId={candidateWeVoteId}
                          buttonsOnly
                          className="u-float-right"
                          commentButtonHide
                          externalUniqueId={`candidateItem-ItemActionBar-${localUniqueId}`}
                          shareButtonHide
                        />
                      </div>
                    </div>
                  ) :
                  (
                    <div
                      className={linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? (
                        'card__blue'
                      ) : (
                        ''
                      )}
                    >
                      <br />
                      {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                    </div>
                  )}
              </div>
              <div className="u-show-mobile-tablet">
                {linkToBallotItemPage ? (
                  <div onClick={this.goToCandidateLink} className="card-main__no-underline">
                    <br />
                    {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                  </div>
                ) : (
                  <div>
                    <br />
                    {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {(!hideCandidateText && candidateText && candidateText.length) && (
                <CandidateTextWrapper
                  className={`${linkToBallotItemPage ? 'card-main__description-container--truncated' : 'card-main__description-container'}`}
                >
                  <Suspense fallback={<></>}>
                    <ReadMore
                      textToDisplay={candidateText}
                      numberOfLines={2}
                    />
                  </Suspense>
                </CandidateTextWrapper>
              )}
            </>
          )}
          {/* Issues related to this Candidate */}
          {!hideIssuesRelatedToCandidate && (
            <IssuesByBallotItemDisplayList
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={candidateWeVoteId}
              expandIssuesByDefault={expandIssuesByDefault}
              externalUniqueId={`candidateItem-${candidateWeVoteId}`}
              placement="bottom"
            />
          )}
        </div>
        {hideShowMoreFooter ?
          null :
          <ShowMoreFooter showMoreId="candidateItemShowMoreFooter" showMoreLink={this.goToCandidateLink} />}
      </>
    );
  };

  goToCandidateLink () {
    // In case we were in the OrganizationModal, close it
    AppObservableStore.setShowOrganizationModal(false);
    historyPush(this.getCandidateLink());
  }

  goToOfficeLink () {
    // In case we were in the OrganizationModal, close it
    AppObservableStore.setShowOrganizationModal(false);
    historyPush(this.getOfficeLink());
  }

  render () {
    renderLog('CandidateItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes, forMoreInformationTextOff,
      linkToBallotItemPage, openSupportOpposeCountDisplayModal, showHover,
    } = this.props;
    const {
      ballotpediaCandidateUrl, candidateText, candidateWeVoteId,
      largeAreaHoverColorOnNow, largeAreaHoverLinkOnNow,
    } = this.state;
    if (!candidateWeVoteId) {
      // console.log('CandidateItem waiting for candidateWeVoteId to make it into the state variable');
      return null;
    }
    // console.log('CandidateItem render, linkToBallotItemPage:', linkToBallotItemPage);
    const forDesktop = true;
    const openSupportOpposeCountDisplayModalAtMobileAndTabletScreenSize = (openSupportOpposeCountDisplayModal && isMobileAndTabletScreenSize());
    const openSupportOpposeCountDisplayModalAtDesktopScreenSize = (openSupportOpposeCountDisplayModal && !isMobileAndTabletScreenSize());
    return (
      <CandidateItemWrapper>
        <DesktopWrapper
          className={`u-show-desktop card-main u-overflow-hidden candidate-card ${linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? ' card-main--outline' : ''}`}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
        >
          {linkToBallotItemPage && largeAreaHoverLinkOnNow && showHover ? (
            <Suspense fallback={<></>}>
              <div className="card-main__no-underline">
                {this.candidateRenderBlock(candidateWeVoteId, linkToBallotItemPage, forDesktop, openSupportOpposeCountDisplayModalAtDesktopScreenSize)}
              </div>
            </Suspense>
          ) : (
            <Suspense fallback={<></>}>
              {this.candidateRenderBlock(candidateWeVoteId, linkToBallotItemPage, forDesktop, openSupportOpposeCountDisplayModalAtDesktopScreenSize)}
            </Suspense>
          )}
          {!forMoreInformationTextOff && (
            <ForMoreInformationInfoText className="u-show-desktop-tablet">
              <Info classes={{ root: classes.informationIcon }} />
              {ballotpediaCandidateUrl ? (
                <span>If you want to learn more, click the Ballotpedia or Google Search buttons to the right.</span>
              ) : (
                <span>If you want to learn more, click the Google Search button to the right.</span>
              )}
            </ForMoreInformationInfoText>
          )}
          <Suspense fallback={<></>}>
            {this.candidateIssuesAndCommentBlock(candidateText, 'desktopIssuesComment')}
          </Suspense>
        </DesktopWrapper>
        <MobileTabletWrapper className="u-show-mobile-tablet card-main candidate-card u-no-scroll">
          <Suspense fallback={<></>}>
            <div className="card-main__no-underline">
              {this.candidateRenderBlock(candidateWeVoteId, linkToBallotItemPage, !forDesktop, openSupportOpposeCountDisplayModalAtMobileAndTabletScreenSize)}
            </div>
          </Suspense>
          <Suspense fallback={<></>}>
            {this.candidateIssuesAndCommentBlock(candidateText, 'mobileIssuesComment')}
          </Suspense>
        </MobileTabletWrapper>
      </CandidateItemWrapper>
    );
  }
}
CandidateItem.propTypes = {
  candidateWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  closeSupportOpposeCountDisplayModal: PropTypes.bool,
  controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
  goToBallotItem: PropTypes.func, // We don't require this because sometimes we don't want the link to do anything
  expandIssuesByDefault: PropTypes.bool,
  forMoreInformationTextOff: PropTypes.bool,
  hideBallotItemSupportOpposeComment: PropTypes.bool,
  hideCandidateText: PropTypes.bool,
  hideCandidateUrl: PropTypes.bool,
  hideEndorsementsOverview: PropTypes.bool,
  hideIssuesRelatedToCandidate: PropTypes.bool,
  hideShowMoreFooter: PropTypes.bool,
  linkToBallotItemPage: PropTypes.bool,
  linkToOfficePage: PropTypes.bool,
  openAdviserMaterialUIPopover: PropTypes.bool,
  openSupportOpposeCountDisplayModal: PropTypes.bool,
  organizationWeVoteId: PropTypes.string,
  supportOpposeCountDisplayModalTutorialOn: PropTypes.bool,
  supportOpposeCountDisplayModalTutorialText: PropTypes.object,
  showDownArrow: PropTypes.bool,
  showUpArrow: PropTypes.bool,
  showHover: PropTypes.bool,
  showOfficeName: PropTypes.bool,
  showLargeImage: PropTypes.bool,
  showPositionStatementActionBar: PropTypes.bool,
  showTopCommentByBallotItem: PropTypes.bool,
  inModal: PropTypes.bool,
  hidePositionPublicToggle: PropTypes.bool,
  showPositionPublicToggle: PropTypes.bool,
};

const styles = () => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const BallotItemSupportOpposeCountDisplayWrapper = styled.div`
  cursor: pointer;
  float: right;
`;

const CandidateInfo = styled.div`
  ${({ isClickable }) => ((isClickable) ? 'cursor: pointer;' : '')}
  display: flex;
  flex-flow: row nowrap;
`;

const Candidate = styled.div`
`;

const CandidateItemWrapper = styled.div`
`;

const CandidateWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
  ${() => (isAndroidSizeMD() ? { width: '92% !important' } : {})}
`;

const CandidateTextWrapper = styled.div`
  margin: 12px 0;
`;

const DesktopWrapper = styled.div`
`;

const ExternalWebSiteWrapper = styled.span`
  padding-left: 15px;
  white-space: nowrap;
`;

const ForMoreInformationInfoText = styled.div`
  color: #999;
  margin-bottom: 4px;
`;

const MobileTabletWrapper = styled.div`
`;

export default withTheme(withStyles(styles)(CandidateItem));
