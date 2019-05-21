import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import CandidateStore from '../../stores/CandidateStore';
import { historyPush } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import IssuesByBallotItemDisplayList from '../Values/IssuesByBallotItemDisplayList';
import LearnMore from '../Widgets/LearnMore';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import SupportStore from '../../stores/SupportStore';
import TopCommentByBallotItem from '../Widgets/TopCommentByBallotItem';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { abbreviateNumber, numberWithCommas } from '../../utils/textFormat';
import ItemActionBar from '../Widgets/ItemActionBar';

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
      ballotItemDisplayName: '',
      ballotpediaCandidateSummary: '',
      ballotpediaCandidateUrl: '',
      candidatePhotoUrl: '',
      candidateWeVoteId: '',
      contestOfficeName: '',
      largeAreaHoverColorOnNow: null,
      largeAreaHoverLinkOnNow: false,
      officeWeVoteId: '',
      organizationWeVoteId: '',
      politicalParty: '',
      twitterDescription: '',
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
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log('CandidateItem, this.props:', this.props);
    if (this.props.candidateWeVoteId) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidate(this.props.candidateWeVoteId);
      // console.log('CandidateItem, componentDidMount, candidate:', candidate);

      let candidatePhotoUrl;
      if (this.props.showLargeImage) {
        if (candidate.candidate_photo_url_large) {
          candidatePhotoUrl = candidate.candidate_photo_url_large;
        }
      } else if (candidate.candidate_photo_url_medium) {
        candidatePhotoUrl = candidate.candidate_photo_url_medium;
      }

      this.setState({
        ballotItemDisplayName: candidate.ballot_item_display_name,
        ballotpediaCandidateSummary: candidate.ballotpedia_candidate_summary,
        ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
        candidatePhotoUrl,
        candidateWeVoteId: this.props.candidateWeVoteId,
        contestOfficeName: candidate.contest_office_name,
        officeWeVoteId: candidate.contest_office_we_vote_id,
        politicalParty: candidate.party,
        twitterDescription: candidate.twitter_description,
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
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
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
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onCandidateStoreChange () {
    // console.log('Candidate onCandidateStoreChange');
    const { candidateWeVoteId } = this.state;
    const candidate = CandidateStore.getCandidate(candidateWeVoteId);
    let candidatePhotoUrl;
    if (this.props.showLargeImage) {
      if (candidate.candidate_photo_url_large) {
        candidatePhotoUrl = candidate.candidate_photo_url_large;
      }
    } else if (candidate.candidate_photo_url_medium) {
      candidatePhotoUrl = candidate.candidate_photo_url_medium;
    }
    this.setState({
      ballotItemDisplayName: candidate.ballot_item_display_name,
      ballotpediaCandidateSummary: candidate.ballotpedia_candidate_summary,
      ballotpediaCandidateUrl: candidate.ballotpedia_candidate_url,
      candidatePhotoUrl,
      contestOfficeName: candidate.contest_office_name,
      officeWeVoteId: candidate.contest_office_we_vote_id,
      politicalParty: candidate.party,
      twitterDescription: candidate.twitter_description,
      twitterFollowersCount: candidate.twitter_followers_count,
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
    if (this.state.organizationWeVoteId) {
      return `/candidate/${this.state.candidateWeVoteId}/bto/${this.state.organizationWeVoteId}`; // back-to-office
    } else {
      return `/candidate/${this.state.candidateWeVoteId}/b/btdo/`; // back-to-default-office
    }
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

  handleEnableLink = () => {
    // console.log('Handle largeAreaHoverColorOnNow', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverLinkOnNow: true });
    }
  }

  handleDisableLink = () => {
    // console.log('Handle leave', e.target);
    if (this.props.showHover) {
      this.setState({ largeAreaHoverLinkOnNow: false });
    }
  }

  togglePositionStatement () {
    const { showPositionStatementActionBar } = this.state;
    this.setState({ showPositionStatementActionBar: !showPositionStatementActionBar });
  }

  goToCandidateLink () {
    // If here, we assume the voter is on the Office page
    historyPush(this.getCandidateLink());
  }

  goToOfficeLink () {
    historyPush(this.getOfficeLink());
  }

  render () {
    // console.log('CandidateItem render');
    renderLog(__filename);
    const {
      ballotItemDisplayName,
      ballotpediaCandidateSummary,
      ballotpediaCandidateUrl,
      politicalParty,
      twitterDescription,
      twitterFollowersCount,
      contestOfficeName,
      candidateWeVoteId,
      candidatePhotoUrl,
    } = this.state;

    const candidatePhotoUrlHtml = (
      <ImageHandler
        className="card-main__avatar"
        sizeClassName="icon-office-child "
        imageUrl={candidatePhotoUrl}
        alt="candidate-photo"
        kind_of_ballot_item="CANDIDATE"
      />
    );

    const twitterDescriptionText = twitterDescription && twitterDescription.length ? `${twitterDescription} ` : '';
    let ballotpediaCandidateSummaryText = ballotpediaCandidateSummary && ballotpediaCandidateSummary.length ? ballotpediaCandidateSummary : '';

    // Strip away any HTML tags
    ballotpediaCandidateSummaryText = ballotpediaCandidateSummaryText.split(/<[^<>]*>/).join('');
    const candidateText = twitterDescriptionText + ballotpediaCandidateSummaryText;

    const topCommentByBallotItem = (
      <TopCommentByBallotItem
        ballotItemWeVoteId={candidateWeVoteId}
        learnMoreUrl={this.getCandidateLink()}
      >
        {/* If there aren't any comments about the candidate, show the text description of the candidate */}
        { candidateText.length ? (
          <div className={`u-stack--sm${this.props.linkToBallotItemPage ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
            <div className="card-main__description">
              <LearnMore
                  learn_more_text="Read more on Ballotpedia"
                  num_of_lines={2}
                  learn_more_link={ballotpediaCandidateUrl}
                  text_to_display={candidateText}
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

    const candidateRenderBlock = (
      <div>
        <CandidateWrapper className="card-main__media-object">
          <CandidateInfo>
            <div className="card-main__media-object-anchor">
              {candidatePhotoUrlHtml}
            </div>
            <Candidate>
              <h2 className={this.state.largeAreaHoverColorOnNow && this.props.showHover ? (
                'card-main__display-name card__blue'
              ) : (
                'card-main__display-name'
              )}
              >
                {ballotItemDisplayName}
              </h2>
              {twitterFollowersCount ? (
                <span
                  className={this.props.linkToBallotItemPage ?
                    'twitter-followers__badge u-show-desktop-tablet u-cursor--pointer' :
                    'twitter-followers__badge u-show-desktop-tablet'}
                  onClick={this.props.linkToBallotItemPage ? this.goToCandidateLink : null}
                >
                  <span className="fa fa-twitter twitter-followers__icon" />
                  <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                </span>
              ) :
                null
              }
              <span className="u-show-desktop-tablet">
                { contestOfficeName ? (
                  <p className={this.state.largeAreaHoverColorOnNow && this.props.showHover ? 'card__blue' : ''}>
                    <OfficeNameText
                      contestOfficeName={contestOfficeName}
                      officeLink={this.props.linkToOfficePage ? this.getOfficeLink() : ''}
                      politicalParty={politicalParty}
                      showOfficeName={this.props.showOfficeName}
                    />
                  </p>
                ) :
                  null
                }
              </span>
            </Candidate>
          </CandidateInfo>
          <BallotItemSupportOpposeCountDisplay
            handleLeaveCandidateCard={this.handleLeave}
            handleEnterCandidateCard={this.handleEnter}
            ballotItemWeVoteId={candidateWeVoteId}
          />
          {' '}
        </CandidateWrapper>
        {' '}
        <span className="u-show-mobile">
          { contestOfficeName ? (
            <p className={this.state.largeAreaHoverColorOnNow && this.props.showHover ? 'card__blue' : ''}>
              <OfficeNameText
                contestOfficeName={contestOfficeName}
                officeLink={this.props.linkToOfficePage ? this.getOfficeLink() : ''}
                politicalParty={politicalParty}
                showOfficeName={this.props.showOfficeName}
              />
            </p>
          ) :
            null
          }
        </span>
      </div>
    );

    const candidateIssuesAndCommentBlock = (
      <div>
        <div className="card-main__actions">
          <div>
            {/* Issues related to this Candidate */}
            <IssuesByBallotItemDisplayList
              ballotItemWeVoteId={candidateWeVoteId}
              placement="bottom"
            />
            {/* If there is a quote about the candidate, show that too. */}
            { this.props.showTopCommentByBallotItem && (
              <div>
                { this.state.largeAreaHoverLinkOnNow && this.props.showHover ?
                  (
                    <div className="row">
                      <div className="col col-9 card__blue">
                        <Link to={this.getCandidateLink} className="card-main__no-underline">
                          {topCommentByBallotItem}
                        </Link>
                      </div>
                      <div className="col col-3">
                        <ItemActionBar
                          ballotItemWeVoteId={candidateWeVoteId}
                          buttonsOnly
                          className="u-float-right"
                          commentButtonHide
                          shareButtonHide
                          type="CANDIDATE"
                        />
                      </div>
                    </div>
                  ) :
                  (
                    <div className={this.state.largeAreaHoverColorOnNow && this.props.showHover ? (
                      'card__blue'
                    ) : (
                      ''
                    )}
                    >
                      {topCommentByBallotItem}
                    </div>
                  )
                }
              </div>
            )}
            <div>
              {this.props.hideBallotItemSupportOpposeComment ?
                null : (
                  <BallotItemSupportOpposeComment
                    ballotItemWeVoteId={candidateWeVoteId}
                    showPositionStatementActionBar={this.state.showPositionStatementActionBar}
                  />
                )
              }
            </div>
          </div>
        </div>
        {this.props.hideShowMoreFooter ?
          null :
          <ShowMoreFooter showMoreId="candidateItemShowMoreFooter" showMoreLink={this.goToCandidateLink} />
        }
      </div>
    );

    return (
      <div
        className={this.state.largeAreaHoverColorOnNow && this.props.showHover ? (
          'card-main candidate-card card-main--outline'
        ) : (
          'card-main candidate-card'
        )}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        {this.state.largeAreaHoverLinkOnNow && this.props.showHover ? (
          <Link to={this.getCandidateLink} className="card-main__no-underline">
            {candidateRenderBlock}
          </Link>
        ) : (
          <div>
            {candidateRenderBlock}
          </div>
        )}
        <div>
          {candidateIssuesAndCommentBlock}
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
