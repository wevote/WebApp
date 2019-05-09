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

// This is related to /js/components/VoterGuide/OrganizationVoterGuideCandidateItem.jsx
class CandidateItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    ballotpedia_candidate_summary: PropTypes.string,
    ballotpedia_candidate_url: PropTypes.string,
    candidate_photo_url_large: PropTypes.string.isRequired,
    candidate_photo_url_medium: PropTypes.string,
    contest_office_name: PropTypes.string,
    showLargeImage: PropTypes.bool,
    hideBallotItemSupportOpposeComment: PropTypes.bool,
    hideShowMoreFooter: PropTypes.bool,
    link_to_ballot_item_page: PropTypes.bool,
    linkToOfficePage: PropTypes.bool,
    organizationWeVoteId: PropTypes.string,
    party: PropTypes.string,
    showOfficeName: PropTypes.bool,
    showPositionStatementActionBar: PropTypes.bool,
    showTopCommentByBallotItem: PropTypes.bool,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    // twitter_handle: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired, // This is the candidate_we_vote_id
    showHover: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateWeVoteId: '',
      showPositionStatementActionBar: this.props.showPositionStatementActionBar,
      officeWeVoteId: '',
      hover: null,
    };
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log("CandidateItem, this.props:", this.props);
    if (this.props.we_vote_id) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidate(this.props.we_vote_id);

      // console.log("CandidateItem, componentDidMount, candidate:", candidate)
      this.setState({
        candidateWeVoteId: this.props.we_vote_id,
        officeWeVoteId: candidate.contest_office_we_vote_id,
      });
    }

    if (this.props.organizationWeVoteId) {
      this.setState({
        organizationWeVoteId: this.props.organizationWeVoteId,
      });
    }
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
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
    // console.log('Handle hover', e.target);
    this.setState({ hover: true });
  }

  handleLeave = () => {
    // console.log('Handle leave', e.target);
    this.setState({ hover: false });
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
    renderLog(__filename);
    const {
      ballot_item_display_name: ballotItemDisplayName,
      ballotpedia_candidate_summary: ballotpediaCandidateSummary,
      ballotpedia_candidate_url: ballotpediaCandidateUrl,
      party,
      we_vote_id: candidateWeVoteId,
      twitter_description: twitterDescription,
      twitter_followers_count: twitterFollowersCount,
      contest_office_name: contestOfficeName,
    } = this.props;

    let candidatePhotoUrl;
    if (this.props.showLargeImage) {
      if (this.props.candidate_photo_url_large) {
        candidatePhotoUrl = this.props.candidate_photo_url_large;
      }
    } else if (this.props.candidate_photo_url_medium) {
      candidatePhotoUrl = this.props.candidate_photo_url_medium;
    }

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

    return (
      <div
        className={this.state.hover && this.props.showHover ? (
          'card-main candidate-card card-main--outline'
        ) : (
          'card-main candidate-card'
        )}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        {this.state.hover && this.props.showHover ? (
          <Link to={this.getCandidateLink} className="card-main__no-underline">
            <div>
              <CandidateInfo className="card-main__media-object">
                <div className="card-main__media-object-anchor">
                  {/* {this.props.link_to_ballot_item_page ?
                    <Link to={this.getCandidateLink} className="u-no-underline">{candidatePhotoUrlHtml}</Link> :
                    candidatePhotoUrlHtml
                  } */}
                  {candidatePhotoUrlHtml}
                </div>
                <CandidateWrapper>
                  <Candidate>
                    <h2 className={this.state.hover && this.props.showHover ? (
                      'card-main__display-name card__blue'
                    ) : (
                      'card-main__display-name'
                    )}
                    >
                      {/* { this.props.link_to_ballot_item_page ?
                        <Link to={this.getCandidateLink}>{ballotItemDisplayName}</Link> :
                        ballotItemDisplayName
                      } */}
                      {ballotItemDisplayName}
                    </h2>
                    {twitterFollowersCount ? (
                      <span
                        className={this.props.link_to_ballot_item_page ?
                          'twitter-followers__badge u-show-desktop-tablet u-cursor--pointer' :
                          'twitter-followers__badge u-show-desktop-tablet'}
                        onClick={this.props.link_to_ballot_item_page ? this.goToCandidateLink : null}
                      >
                        <span className="fa fa-twitter twitter-followers__icon" />
                        <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                      </span>
                    ) :
                      null
                    }
                    {
                      <p /* className={this.props.link_to_ballot_item_page ?
                        'u-gray-darker u-cursor--pointer' :
                        'u-gray-darker'
                      } */
                      className={this.state.hover && this.props.showHover ? (
                        'card__blue'
                      ) : (
                        ''
                      )}
                      >
                        { contestOfficeName ? (
                          <OfficeNameText
                            contestOfficeName={contestOfficeName}
                            officeLink={this.props.linkToOfficePage ? this.getOfficeLink() : ''}
                            politicalParty={party}
                            showOfficeName={this.props.showOfficeName}
                          />
                        ) :
                          null
                      }
                      </p>
                    }
                    {/* Endorsement count or Network score */}
                  </Candidate>
                  <BallotItemSupportOpposeCountDisplay
                    handleLeaveCandidateCard={this.handleLeave}
                    handleEnterCandidateCard={this.handleEnter}
                    ballotItemWeVoteId={candidateWeVoteId}
                  />
                </CandidateWrapper>
                {' '}
                {/* END .card-main__media-object-content */}
              </CandidateInfo>
              {' '}
              {/* END .card-main__media-object */}
              <div className="card-main__actions">
                <div>
                  {/* Issues related to this Candidate */}
                  <IssuesByBallotItemDisplayList
                  handleLeaveCandidateCard={this.handleLeave}
                  handleEnterCandidateCard={this.handleEnter}
                  ballotItemWeVoteId={candidateWeVoteId}
                  placement="bottom"
                  />
                  {/* If there is a quote about the candidate, show that too. */}
                  <div className={this.state.hover && this.props.showHover ? (
                    'card__blue'
                  ) : (
                    ''
                  )}
                  >
                    { this.props.showTopCommentByBallotItem && (
                      <TopCommentByBallotItem
                        ballotItemWeVoteId={candidateWeVoteId}
                        learnMoreUrl={this.getCandidateLink()}
                      >
                        {/* If there aren't any comments about the candidate, show the text description of the candidate */}
                        { candidateText.length ? (
                          <div className={`u-stack--sm${this.props.link_to_ballot_item_page ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
                            <div className="card-main__description">
                              <LearnMore
                                  learn_more_text="Read more on Ballotpedia"
                                  num_of_lines={2}
                                  learn_more_link={ballotpediaCandidateUrl}
                                  text_to_display={candidateText}
                              />
                            </div>
                            {/* <Link to={this.getCandidateLink}>
                              { this.props.link_to_ballot_item_page ? <span className="card-main__read-more-pseudo" /> : null }
                            </Link> */}
                            <span className="card-main__read-more-pseudo" />
                            {/* { this.props.link_to_ballot_item_page ?
                              <Link to={this.getCandidateLink} className="card-main__read-more-link">&nbsp;more</Link> :
                              null
                            } */}
                            <span className="card-main__read-more-link">
                              &nbsp;more
                            </span>
                          </div>
                        ) :
                          null
                        }
                      </TopCommentByBallotItem>
                    )}
                  </div>
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
                <ShowMoreFooter showMoreLink={this.goToCandidateLink} />
              }
            </div>
          </Link>
        ) : (
          <div>
            <CandidateInfo className="card-main__media-object">
              <div className="card-main__media-object-anchor">
                {/* {this.props.link_to_ballot_item_page ?
                    <Link to={this.getCandidateLink} className="u-no-underline">{candidatePhotoUrlHtml}</Link> :
                  candidatePhotoUrlHtml
                } */}
                {candidatePhotoUrlHtml}
              </div>
              <CandidateWrapper>
                <Candidate>
                  <h2 className={this.state.hover && this.props.showHover ? (
                    'card-main__display-name card__blue'
                  ) : (
                    'card-main__display-name'
                  )}
                  >
                    {/* { this.props.link_to_ballot_item_page ?
                      <Link to={this.getCandidateLink}>{ballotItemDisplayName}</Link> :
                      ballotItemDisplayName
                    } */}
                    {ballotItemDisplayName}
                  </h2>
                  {twitterFollowersCount ? (
                    <span
                      className={this.props.link_to_ballot_item_page ?
                        'twitter-followers__badge u-show-desktop-tablet u-cursor--pointer' :
                        'twitter-followers__badge u-show-desktop-tablet'}
                      onClick={this.props.link_to_ballot_item_page ? this.goToCandidateLink : null}
                    >
                      <span className="fa fa-twitter twitter-followers__icon" />
                      <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                    </span>
                  ) :
                    null
                  }
                  {
                    <p /* className={this.props.link_to_ballot_item_page ?
                      'u-gray-darker u-cursor--pointer' :
                      'u-gray-darker'
                    } */
                    className={this.state.hover && this.props.showHover ? (
                      'card__blue'
                    ) : (
                      ''
                    )}
                    >
                      { contestOfficeName ? (
                        <OfficeNameText
                          contestOfficeName={contestOfficeName}
                          officeLink={this.props.linkToOfficePage ? this.getOfficeLink() : ''}
                          politicalParty={party}
                          showOfficeName={this.props.showOfficeName}
                        />
                      ) :
                        null
                    }
                    </p>
                  }
                  {/* Endorsement count or Network score */}
                </Candidate>
                <BallotItemSupportOpposeCountDisplay
                  handleLeaveCandidateCard={this.handleLeave}
                  handleEnterCandidateCard={this.handleEnter}
                  ballotItemWeVoteId={candidateWeVoteId}
                />
              </CandidateWrapper>
              {' '}
              {/* END .card-main__media-object-content */}
            </CandidateInfo>
            {' '}
            {/* END .card-main__media-object */}
            <div className="card-main__actions">
              <div>
                {/* Issues related to this Candidate */}
                <IssuesByBallotItemDisplayList
                  handleLeaveCandidateCard={this.handleLeave}
                  handleEnterCandidateCard={this.handleEnter}
                  ballotItemWeVoteId={candidateWeVoteId}
                  placement="bottom"
                />
                {/* If there is a quote about the candidate, show that too. */}
                <div className={this.state.hover && this.props.showHover ? (
                  'card__blue'
                ) : (
                  ''
                )}
                >
                  { this.props.showTopCommentByBallotItem && (
                    <TopCommentByBallotItem
                      ballotItemWeVoteId={candidateWeVoteId}
                      learnMoreUrl={this.getCandidateLink()}
                    >
                      {/* If there aren't any comments about the candidate, show the text description of the candidate */}
                      { candidateText.length ? (
                        <div className={`u-stack--sm${this.props.link_to_ballot_item_page ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
                          <div className="card-main__description">
                            <LearnMore
                                learn_more_text="Read more on Ballotpedia"
                                num_of_lines={2}
                                learn_more_link={ballotpediaCandidateUrl}
                                text_to_display={candidateText}
                            />
                          </div>
                          {/* <Link to={this.getCandidateLink}>
                              { this.props.link_to_ballot_item_page ? <span className="card-main__read-more-pseudo" /> : null }
                            </Link> */}
                          <span className="card-main__read-more-pseudo" />
                          {/* { this.props.link_to_ballot_item_page ?
                              <Link to={this.getCandidateLink} className="card-main__read-more-link">&nbsp;more</Link> :
                              null
                          } */}
                          <span className="card-main__read-more-link">
                            &nbsp;more
                          </span>
                        </div>
                      ) :
                        null
                      }
                    </TopCommentByBallotItem>
                  )
                  }
                </div>
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
              <ShowMoreFooter showMoreLink={this.goToCandidateLink} />
            }
          </div>
        )}
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
  flex-flow: row;
  justify-content: space-between;
  width: 90%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export default CandidateItem;
