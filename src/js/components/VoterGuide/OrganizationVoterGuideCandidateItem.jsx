import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CandidateStore from '../../stores/CandidateStore';
import { historyPush } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import ItemSupportOpposeRaccoon from '../Widgets/ItemSupportOpposeRaccoon';
import { renderLog } from '../../utils/logging';
import OfficeNameText from '../Widgets/OfficeNameText';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';
import SupportStore from '../../stores/SupportStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { abbreviateNumber, numberWithCommas } from '../../utils/textFormat';

// This is related to /js/components/Ballot/CandidateItem.jsx
export default class OrganizationVoterGuideCandidateItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_photo_url_large: PropTypes.string.isRequired,
    candidate_photo_url_medium: PropTypes.string,
    contest_office_name: PropTypes.string,
    showLargeImage: PropTypes.bool,
    link_to_ballot_item_page: PropTypes.bool,
    linkToOfficePage: PropTypes.bool,
    organization_we_vote_id: PropTypes.string.isRequired,
    party: PropTypes.string,
    showPositionStatementActionBar: PropTypes.bool,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    we_vote_id: PropTypes.string.isRequired, // This is the candidateWeVoteId
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateSupportStore: {},
      candidateWeVoteId: '',
      officeWeVoteId: '',
      organizationWeVoteId: '',
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
    const candidateSupportStore = SupportStore.get(this.props.we_vote_id);
    if (candidateSupportStore !== undefined) {
      this.setState({
        candidateSupportStore,
      });
    }

    // console.log("OrganizationVoterGuideCandidateItem, this.props:", this.props);
    if (this.props.we_vote_id) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidate(this.props.we_vote_id);
      this.setState({
        candidateWeVoteId: this.props.we_vote_id,
        officeWeVoteId: candidate.contest_office_we_vote_id,
      });
    }

    if (this.props.organization_we_vote_id) {
      this.setState({
        organizationWeVoteId: this.props.organization_we_vote_id,
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
    const candidateSupportStore = SupportStore.get(this.state.candidateWeVoteId);
    if (candidateSupportStore !== undefined) {
      this.setState({ candidateSupportStore });
    }
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    if (this.state.organizationWeVoteId) {
      return `/candidate/${this.state.candidateWeVoteId}/bto/${this.state.organizationWeVoteId}`; // back-to-office
    } else {
      return `/candidate/${this.state.candidateWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== '') {
      return `/office/${this.state.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`; // back-to-voter-guide
    } else if (this.state.officeWeVoteId) {
      return `/office/${this.state.officeWeVoteId}/b/btdb/`; // back-to-default-ballot
    } else return '';
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
    let candidatePhotoUrlHtml;
    if (candidatePhotoUrl) {
      candidatePhotoUrlHtml = (
        <ImageHandler
          className="card-main__avatar"
          sizeClassName="icon-office-child "
          imageUrl={candidatePhotoUrl}
          alt="candidate-photo"
          kind_of_ballot_item="CANDIDATE"
        />
      );
    } else {
      candidatePhotoUrlHtml = <i className="card-main__avatar icon-office-child icon-main icon-icon-person-placeholder-6-1" />;
    }
    // let positions_in_your_network = SupportStore.get(we_vote_id) && ( SupportStore.get(we_vote_id).oppose_count || SupportStore.get(we_vote_id).support_count);

    const oneCandidate = CandidateStore.getCandidate(candidateWeVoteId);
    const { candidateSupportStore } = this.state;
    const organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidateWeVoteId);
    const organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidateWeVoteId);

    return (
      <div className="card-main candidate-card">
        <div className="card-main__media-object">
          <div className="card-main__media-object-anchor">
            {this.props.link_to_ballot_item_page ?
              <Link to={this.getCandidateLink} className="u-no-underline">{candidatePhotoUrlHtml}</Link> :
              candidatePhotoUrlHtml
            }
            {twitterFollowersCount ? (
              <span
                className={this.props.link_to_ballot_item_page ?
                  'twitter-followers__badge u-cursor--pointer' :
                  'twitter-followers__badge'}
                onClick={this.props.link_to_ballot_item_page ? this.goToCandidateLink : null}
              >
                <span className="fa fa-twitter twitter-followers__icon" />
                <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
              </span>
            ) : null
            }
          </div>

          <div className="card-main__media-object-content">
            <h2 className="card-main__display-name">
              { this.props.link_to_ballot_item_page ?
                <Link to={this.getCandidateLink}>{ballotItemDisplayName}</Link> :
                ballotItemDisplayName
            }
            </h2>
            <a onClick={this.props.link_to_ballot_item_page ? this.goToCandidateLink : null}>
              <p
                className={this.props.link_to_ballot_item_page ?
                  'u-gray-darker u-cursor--pointer' :
                  'u-gray-darker'
                }
              >
                { contestOfficeName ? (
                  <OfficeNameText
                    politicalParty={party}
                    contestOfficeName={contestOfficeName}
                    officeLink={this.props.linkToOfficePage ? this.getOfficeLink() : ''}
                  />
                ) : null
                }
              </p>
            </a>
            { twitterDescription ? (
              <div className={`u-stack--sm${this.props.link_to_ballot_item_page ? ' card-main__description-container--truncated' : ' card-main__description-container'}`}>
                <div>
                  <ParsedTwitterDescription
                    twitter_description={twitterDescription}
                  />
                </div>
                <Link to={this.getCandidateLink}>
                  { this.props.link_to_ballot_item_page ? <span className="card-main__read-more-pseudo" /> : null }
                </Link>
                { this.props.link_to_ballot_item_page ?
                  <Link to={this.getCandidateLink} className="card-main__read-more-link">&nbsp;Read more</Link> :
                  null
              }
              </div>
            ) : null
            }
          </div>
          {' '}
          {/* END .card-main__media-object-content */}
        </div>
        {' '}
        {/* END .card-main__media-object */}
        <div className="card-main__actions">
          <div>
            <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
              {/* Positions in Your Network and Possible Voter Guides to Follow */}
              <ItemSupportOpposeRaccoon
                ballotItemWeVoteId={candidateWeVoteId}
                ballot_item_display_name={oneCandidate.ballot_item_display_name}
                goToCandidate={this.goToCandidateLink}
                maximumOrganizationDisplay={8}
                organizationsToFollowSupport={organizationsToFollowSupport}
                organizationsToFollowOppose={organizationsToFollowOppose}
                popoverBottom
                showPositionStatementActionBar={this.props.showPositionStatementActionBar}
                supportProps={candidateSupportStore}
                type="CANDIDATE"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
