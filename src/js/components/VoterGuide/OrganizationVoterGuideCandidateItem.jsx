import { Twitter } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import CandidateStore from '../../stores/CandidateStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import ParsedTwitterDescription from '../Twitter/ParsedTwitterDescription';

const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../common/components/Widgets/OfficeNameText'));


// This is related to /js/components/Ballot/CandidateItem.jsx
export default class OrganizationVoterGuideCandidateItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
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
    const { weVoteId } = this.props;
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();

    // console.log("OrganizationVoterGuideCandidateItem, this.props:", this.props);
    if (weVoteId) {
      // If here we want to get the candidate so we can get the officeWeVoteId
      const candidate = CandidateStore.getCandidateByWeVoteId(weVoteId);
      this.setState({
        candidateWeVoteId: weVoteId,
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
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  getCandidateLink () {
    // If here, we assume the voter is on the Office page
    if (this.state.organizationWeVoteId) {
      return `/candidate/${this.state.candidateWeVoteId}/bto/${this.state.organizationWeVoteId}`; // back-to-office
    } else {
      return `/candidate/${this.state.candidateWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== '') {
      return `/office/${this.state.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`; // back-to-voter-guide
    } else if (this.state.officeWeVoteId) {
      return `/office/${this.state.officeWeVoteId}/b/btdb`; // back-to-default-ballot
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
    renderLog('OrganizationVoterGuideCandidateItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemDisplayName,
      candidatePhotoUrlMedium,
      candidatePhotoUrlLarge,
      contestOfficeName,
      linkToBallotItemPage,
      linkToOfficePage,
      party,
      showLargeImage,
      twitterDescription,
      twitterFollowersCount,
      weVoteId: candidateWeVoteId,
    } = this.props;

    let candidatePhotoUrl;
    if (showLargeImage) {
      if (candidatePhotoUrlLarge) {
        candidatePhotoUrl = candidatePhotoUrlLarge;
      }
    } else if (candidatePhotoUrlMedium) {
      candidatePhotoUrl = candidatePhotoUrlMedium;
    }
    let candidatePhotoUrlHtml;
    if (candidatePhotoUrl) {
      candidatePhotoUrlHtml = (
        <Suspense fallback={<></>}>
          <ImageHandler
            className="card-main__avatar"
            sizeClassName="icon-office-child "
            imageUrl={candidatePhotoUrl}
            alt=""
            kind_of_ballot_item="CANDIDATE"
          />
        </Suspense>
      );
    } else {
      candidatePhotoUrlHtml = <i className="card-main__avatar icon-office-child icon-main icon-icon-person-placeholder-6-1" />;
    }

    return (
      <div className="card-main candidate-card">
        <div className="card-main__media-object">
          <MediaObjectAnchor>
            {linkToBallotItemPage ?
              <Link to={this.getCandidateLink} className="u-no-underline">{candidatePhotoUrlHtml}</Link> :
              candidatePhotoUrlHtml}
            {twitterFollowersCount ? (
              <span
                className={linkToBallotItemPage ?
                  'twitter-followers__badge u-cursor--pointer' :
                  'twitter-followers__badge'}
                onClick={linkToBallotItemPage ? this.goToCandidateLink : null}
              >
                <Twitter />
                <span title={numberWithCommas(twitterFollowersCount)}>{numberAbbreviate(twitterFollowersCount)}</span>
              </span>
            ) : null}
          </MediaObjectAnchor>

          <DescriptionColumnWrapper>
            <h2 className="card-main__display-name">
              { linkToBallotItemPage ?
                <Link to={this.getCandidateLink}>{ballotItemDisplayName}</Link> :
                ballotItemDisplayName}
            </h2>
            <span onClick={linkToBallotItemPage ? this.goToCandidateLink : null}>
              <p
                className={linkToBallotItemPage ?
                  'u-gray-darker u-cursor--pointer' :
                  'u-gray-darker'}
              >
                { contestOfficeName ? (
                  <Suspense fallback={<></>}>
                    <OfficeNameText
                      officeLink={linkToOfficePage ? this.getOfficeLink() : ''}
                      officeName={contestOfficeName}
                      politicalParty={party}
                    />
                  </Suspense>
                ) : null}
              </p>
            </span>
            { twitterDescription ? (
              <div>
                {/* className={`u-stack--xs ${linkToBallotItemPage ? ' card-main__description-container--truncated' : ' card-main__description-container'}`} */}
                <div>
                  <ParsedTwitterDescription
                    twitterDescription={twitterDescription}
                  />
                </div>
                <Link to={this.getCandidateLink}>
                  { linkToBallotItemPage ? <span className="card-main__read-more-pseudo" /> : null }
                </Link>
                { linkToBallotItemPage ?
                  <Link to={this.getCandidateLink} className="card-main__read-more-link">&nbsp;Read more</Link> :
                  null}
              </div>
            ) : null}
          </DescriptionColumnWrapper>
          {' '}
        </div>
        {' '}
        {/* END .card-main__media-object */}
        <div className="card-main__actions">
          <div>
            <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50 u-float-right">
              <Suspense fallback={<></>}>
                <BallotItemSupportOpposeComment
                  ballotItemWeVoteId={candidateWeVoteId}
                  externalUniqueId="organizationVoterGuideCandidateItem"
                  showPositionStatementActionBar={this.state.showPositionStatementActionBar}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
OrganizationVoterGuideCandidateItem.propTypes = {
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidatePhotoUrlLarge: PropTypes.string.isRequired,
  candidatePhotoUrlMedium: PropTypes.string,
  contestOfficeName: PropTypes.string,
  linkToBallotItemPage: PropTypes.bool,
  linkToOfficePage: PropTypes.bool,
  organizationWeVoteId: PropTypes.string.isRequired,
  party: PropTypes.string,
  showLargeImage: PropTypes.bool,
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  weVoteId: PropTypes.string.isRequired, // This is the candidateWeVoteId
};

const DescriptionColumnWrapper = styled('div')`
`;
// flex: 1;
// @media all and (min-width: 480px) {
//   .card-main__media-object-content {
//     padding: 4px 32px;
//     margin-bottom: 32px;
//     font-size: 16px;
//   }
// }

// Replacing className="card-main__media-object-anchor"
const MediaObjectAnchor = styled('div')`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
