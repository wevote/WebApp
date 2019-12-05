import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TextTruncate from 'react-text-truncate';
import styled from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import CandidateStore from '../../stores/CandidateStore';
import { historyPush } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import IssuesByBallotItemDisplayList from '../Values/IssuesByBallotItemDisplayList';
import IssueStore from '../../stores/IssueStore';
import ItemActionBar from '../Widgets/ItemActionBar';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import ReadMore from '../Widgets/ReadMore';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import SupportStore from '../../stores/SupportStore';
import TopCommentByBallotItem from '../Widgets/TopCommentByBallotItem';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { abbreviateNumber, numberWithCommas } from '../../utils/textFormat';

// This is related to /js/components/VoterGuide/OrganizationVoterGuideCandidateItem.jsx
class CandidateItem extends Component {
  static propTypes = {
    candidateWeVoteId: PropTypes.string.isRequired,
    hideBallotItemSupportOpposeComment: PropTypes.bool,
    hideShowMoreFooter: PropTypes.bool,
    linkToBallotItemPage: PropTypes.bool,
    linkToOfficePage: PropTypes.bool,
    organizationWeVoteId: PropTypes.string,
    showHover: PropTypes.bool,
    showOfficeName: PropTypes.bool,
    showLargeImage: PropTypes.bool,
    showPositionStatementActionBar: PropTypes.bool,
    showTopCommentByBallotItem: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidateLength: 0,
      ballotItemDisplayName: '',
      // ballotpediaCandidateUrl: '',
      candidatePhotoUrl: '',
      candidateWeVoteId: '',
      contestOfficeName: '',
      issuesUnderThisBallotItemVoterIsFollowingLength: 0,
      issuesUnderThisBallotItemVoterIsNotFollowingLength: 0,
      largeAreaHoverColorOnNow: null,
      largeAreaHoverLinkOnNow: false,
      officeWeVoteId: '',
      organizationWeVoteId: '',
      politicalParty: '',
      twitterFollowersCount: '',
      showPositionStatementActionBar: false,
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
    if (this.props.candidateWeVoteId) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidate(this.props.candidateWeVoteId);
      // console.log('CandidateItem, componentDidMount, candidate:', candidate);

      let candidatePhotoUrl;
      if (this.props.showLargeImage && candidate.candidate_photo_url_large) {
        candidatePhotoUrl = candidate.candidate_photo_url_large;
      } else if (candidate.candidate_photo_url_medium) {
        candidatePhotoUrl = candidate.candidate_photo_url_medium;
      } else if (candidate.candidate_photo_url_tiny) {
        candidatePhotoUrl = candidate.candidate_photo_url_tiny;
      }
      const twitterDescription = candidate.twitter_description;
      const twitterDescriptionText = twitterDescription && twitterDescription.length ? `${twitterDescription} ` : '';
      const ballotpediaCandidateSummary = candidate.ballotpedia_candidate_summary;
      let ballotpediaCandidateSummaryText = ballotpediaCandidateSummary && ballotpediaCandidateSummary.length ? ballotpediaCandidateSummary : '';
      ballotpediaCandidateSummaryText = ballotpediaCandidateSummaryText.split(/<[^<>]*>/).join(''); // Strip away any HTML tags
      const candidateText = twitterDescriptionText + ballotpediaCandidateSummaryText;
      this.setState({
        ballotItemDisplayName: candidate.ballot_item_display_name,
        // ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
        candidatePhotoUrl,
        candidateText,
        candidateWeVoteId: this.props.candidateWeVoteId,
        contestOfficeName: candidate.contest_office_name,
        officeWeVoteId: candidate.contest_office_we_vote_id,
        politicalParty: candidate.party,
        twitterFollowersCount: candidate.twitter_followers_count,
      });
    }

    if (this.props.organizationWeVoteId) {
      this.setState({
        organizationWeVoteId: this.props.organizationWeVoteId,
      });
    }
    this.setState({
      showPositionStatementActionBar: this.props.showPositionStatementActionBar,
    });
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
    if (this.state.candidateWeVoteId !== nextState.candidateWeVoteId) {
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
    if (this.state.showPositionStatementActionBar !== nextState.showPositionStatementActionBar) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log('CandidateItem onCandidateStoreChange, candidateWeVoteId:', candidateWeVoteId);
    const candidate = CandidateStore.getCandidate(candidateWeVoteId);
    let candidatePhotoUrl;
    if (this.props.showLargeImage && candidate.candidate_photo_url_large) {
      candidatePhotoUrl = candidate.candidate_photo_url_large;
    } else if (candidate.candidate_photo_url_medium) {
      candidatePhotoUrl = candidate.candidate_photo_url_medium;
    } else if (candidate.candidate_photo_url_tiny) {
      candidatePhotoUrl = candidate.candidate_photo_url_tiny;
    }
    const twitterDescription = candidate.twitter_description;
    const twitterDescriptionText = twitterDescription && twitterDescription.length ? `${twitterDescription} ` : '';
    const ballotpediaCandidateSummary = candidate.ballotpedia_candidate_summary;
    let ballotpediaCandidateSummaryText = ballotpediaCandidateSummary && ballotpediaCandidateSummary.length ? ballotpediaCandidateSummary : '';
    ballotpediaCandidateSummaryText = ballotpediaCandidateSummaryText.split(/<[^<>]*>/).join(''); // Strip away any HTML tags
    const candidateText = twitterDescriptionText + ballotpediaCandidateSummaryText;
    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    const allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length || 0;
    this.setState({
      allCachedPositionsForThisCandidateLength,
      ballotItemDisplayName: candidate.ballot_item_display_name,
      // ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
      candidatePhotoUrl,
      candidateText,
      contestOfficeName: candidate.contest_office_name,
      officeWeVoteId: candidate.contest_office_we_vote_id,
      politicalParty: candidate.party,
      twitterFollowersCount: candidate.twitter_followers_count,
    });
  }

  onIssueStoreChange () {
    const { candidateWeVoteId } = this.state;
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(candidateWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(candidateWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    this.setState({
      issuesUnderThisBallotItemVoterIsFollowingLength,
      issuesUnderThisBallotItemVoterIsNotFollowingLength,
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    // DALE 2019-02-26 Is this needed?
    this.setState();
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    const { candidateWeVoteId, organizationWeVoteId } = this.state;
    if (candidateWeVoteId) {
      if (organizationWeVoteId) {
        return `/candidate/${candidateWeVoteId}/bto/${organizationWeVoteId}`; // back-to-office
      } else {
        return `/candidate/${candidateWeVoteId}/b/btdo/`; // back-to-default-office
      }
    }
    return '';
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== '') {
      return `/office/${this.state.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`; // back-to-voter-guide
    } else if (this.state.officeWeVoteId) {
      return `/office/${this.state.officeWeVoteId}/b/btdb/`; // back-to-default-ballot
    } else return '';
  }

  handleEnter = () => {
    // console.log('Handle largeAreaHoverColorOnNow', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverColorOnNow: true, largeAreaHoverLinkOnNow: true });
    }
  }

  handleLeave = () => {
    // console.log('Handle leave', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverColorOnNow: false, largeAreaHoverLinkOnNow: false });
    }
  }

  candidateRenderBlock = (candidateWeVoteId) => {
    const { linkToBallotItemPage, linkToOfficePage, showHover, showOfficeName } = this.props;
    const {
      ballotItemDisplayName,
      politicalParty,
      twitterFollowersCount,
      contestOfficeName,
      candidatePhotoUrl,
      largeAreaHoverColorOnNow,
    } = this.state;
    // console.log('candidateRenderBlock candidatePhotoUrl: ', candidatePhotoUrl);
    return (
      <div>
        <CandidateWrapper className="card-main__media-object">
          <CandidateInfo>
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
              <h2 className={`card-main__display-name ${linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? 'card__blue' : ''}`}>
                {ballotItemDisplayName}
              </h2>
              {twitterFollowersCount ? (
                <span
                  className={`u-show-desktop twitter-followers__badge ${linkToBallotItemPage ? 'u-cursor--pointer' : ''}`}
                  onClick={linkToBallotItemPage ? this.goToCandidateLink : null}
                >
                  <span className="fab fa-twitter fa-sm" />
                  <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                </span>
              ) :
                null
              }
              <span className="u-show-desktop">
                { contestOfficeName ? (
                  <p className={linkToBallotItemPage && largeAreaHoverColorOnNow && showHover ? 'card__blue' : ''}>
                    <OfficeNameText
                      contestOfficeName={contestOfficeName}
                      officeLink={linkToOfficePage ? this.getOfficeLink() : ''}
                      politicalParty={politicalParty}
                      showOfficeName={showOfficeName}
                    />
                  </p>
                ) :
                  null
                }
              </span>
            </Candidate>
          </CandidateInfo>
          <div className="u-show-desktop">
            <BallotItemSupportOpposeCountDisplay
              handleLeaveCandidateCard={this.handleLeave}
              handleEnterCandidateCard={this.handleEnter}
              ballotItemWeVoteId={candidateWeVoteId}
            />
          </div>
          <div className="u-show-mobile-tablet">
            <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={candidateWeVoteId} />
          </div>
          {' '}
        </CandidateWrapper>
        {' '}
        <span className="u-show-mobile-tablet">
          { contestOfficeName ? (
            <p>
              <OfficeNameText
                contestOfficeName={contestOfficeName}
                officeLink={linkToOfficePage ? this.getOfficeLink() : ''}
                politicalParty={politicalParty}
                showOfficeName={showOfficeName}
              />
            </p>
          ) :
            null
          }
        </span>
      </div>
    );
  };

  topCommentByBallotItem = (candidateWeVoteId, candidateText) => (
    <TopCommentByBallotItem
      ballotItemWeVoteId={candidateWeVoteId}
      hideMoreButton
    >
      {/* If there aren't any comments about the candidate, show the text description of the candidate */}
      { candidateText.length ? (
        <div className={`u-stack--sm${this.props.linkToBallotItemPage ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
          <div className="card-main__description">
            <TextTruncate
              line={2}
              truncateText="..."
              text={candidateText}
              textTruncateChild={null}
            />
          </div>
          <span className="card-main__read-more-pseudo" />
          <span className="card-main__read-more-link">
            &nbsp;more
          </span>
        </div>
      ) :
        null
      }
    </TopCommentByBallotItem>
  );

  candidateIssuesAndCommentBlock = (candidateText, localUniqueId) => {
    const { hideBallotItemSupportOpposeComment, hideShowMoreFooter, linkToBallotItemPage, showHover, showTopCommentByBallotItem } = this.props;
    const { ballotItemDisplayName, candidateWeVoteId, largeAreaHoverColorOnNow, largeAreaHoverLinkOnNow, showPositionStatementActionBar } = this.state;
    return (
      <div>
        <div className="card-main__actions">
          <div>
            {/* Issues related to this Candidate */}
            <IssuesByBallotItemDisplayList
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={candidateWeVoteId}
              placement="bottom"
            />
            {/* If there is a quote about the candidate, show that too. */}
            {showTopCommentByBallotItem ? (
              <div>
                <div className="u-show-desktop">
                  {linkToBallotItemPage && largeAreaHoverLinkOnNow && showHover ?
                    (
                      <div className="row">
                        <div className="col col-9 card__blue">
                          <Link to={this.getCandidateLink()} className="card-main__no-underline">
                            {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                          </Link>
                        </div>
                        <div className="col col-3">
                          <ItemActionBar
                            ballotItemWeVoteId={candidateWeVoteId}
                            buttonsOnly
                            className="u-float-right"
                            commentButtonHide
                            externalUniqueId={`candidateItem-ItemActionBar-${localUniqueId}`}
                            shareButtonHide
                            type="CANDIDATE"
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
                        {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                      </div>
                    )
                  }
                </div>
                <div className="u-show-mobile-tablet">
                  <Link to={this.getCandidateLink()} className="card-main__no-underline">
                    {this.topCommentByBallotItem(candidateWeVoteId, candidateText)}
                  </Link>
                </div>
              </div>
            ) : (
              <span>
                {candidateText.length ? (
                  <div
                    className={`u-stack--sm ${linkToBallotItemPage ? 'card-main__description-container--truncated' : 'card-main__description-container'}`}
                  >
                    <div className="card-main__description">
                      <ReadMore
                        text_to_display={candidateText}
                        num_of_lines={2}
                      />
                    </div>
                  </div>
                ) :
                  null
                }
              </span>
            )}
            <div>
              {hideBallotItemSupportOpposeComment ?
                null : (
                  <BallotItemSupportOpposeComment
                    ballotItemWeVoteId={candidateWeVoteId}
                    externalUniqueId={`candidateItem-${localUniqueId}`}
                    showPositionStatementActionBar={showPositionStatementActionBar}
                  />
                )
              }
            </div>
          </div>
        </div>
        {hideShowMoreFooter ?
          null :
          <ShowMoreFooter showMoreId="candidateItemShowMoreFooter" showMoreLink={this.goToCandidateLink} />
        }
      </div>
    );
  };

  goToCandidateLink () {
    // If here, we assume the voter is on the Office page
    historyPush(this.getCandidateLink());
  }

  goToOfficeLink () {
    historyPush(this.getOfficeLink());
  }

  render () {
    renderLog('CandidateItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidateText, candidateWeVoteId } = this.state;
    if (!candidateWeVoteId) {
      return null;
    }

    return (
      <div>
        <div
          className={`u-show-desktop card-main u-overflow-hidden candidate-card ${this.props.linkToBallotItemPage && this.state.largeAreaHoverColorOnNow && this.props.showHover ? ' card-main--outline' : ''}`}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleLeave}
        >
          {this.props.linkToBallotItemPage && this.state.largeAreaHoverLinkOnNow && this.props.showHover ? (
            <Link to={this.getCandidateLink()} className="card-main__no-underline">
              {this.candidateRenderBlock(candidateWeVoteId)}
            </Link>
          ) : (
            <div>
              {this.candidateRenderBlock(candidateWeVoteId)}
            </div>
          )}
          <div>
            {this.candidateIssuesAndCommentBlock(candidateText, 'desktopIssuesComment')}
          </div>
        </div>
        <div className="u-show-mobile-tablet card-main candidate-card u-no-scroll">
          {this.props.linkToBallotItemPage ? (
            <Link to={this.getCandidateLink()} className="card-main__no-underline">
              {this.candidateRenderBlock(candidateWeVoteId)}
            </Link>
          ) : (
            <span>
              {this.candidateRenderBlock(candidateWeVoteId)}
            </span>
          )}
          <div>
            {this.candidateIssuesAndCommentBlock(candidateText, 'mobileIssuesComment')}
          </div>
        </div>
      </div>
    );
  }
}

const CandidateInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Candidate = styled.div`
`;

const CandidateWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export default CandidateItem;
