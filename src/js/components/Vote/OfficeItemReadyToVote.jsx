import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar/index';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { isCordova } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { toTitleCase } from '../../utils/textFormat';
import { Wrapper, InnerWrapper, BioColumn, OfficeColumn, OfficeText, BioInformation, NameText, DescriptionText, HR, DesktopTabletView, MobileView } from './BallotItemReadyToVote';


class OfficeItemReadyToVote extends Component {
  static propTypes = {
    candidateList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log("OfficeItemCompressed, this.props.we_vote_id: ", this.props.we_vote_id);
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
    // We just want to trigger a re-render
    this.setState();
  }

  render () {
    renderLog(__filename);
    const isSupportArray = [];
    let supportProps;
    let isSupport;

    // ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    this.props.candidateList.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        isSupport = supportProps.is_support;

        if (isSupport) {
          isSupportArray.push(candidate.ballot_item_display_name);
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largestSupportCount = 0;

    if (isSupportArray.length === 0) {
      let networkSupportCount;
      let networkOpposeCount;

      this.props.candidateList.forEach((candidate) => {
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          networkSupportCount = supportProps.support_count;
          networkOpposeCount = supportProps.oppose_count;

          if (networkSupportCount > networkOpposeCount) {
            if (networkSupportCount > largestSupportCount) {
              largestSupportCount = networkSupportCount;
            }
          }
        }
      });
    }
    let candidatePhotoUrl;
    return (
      <React.Fragment>
        <Wrapper>
          { this.props.candidateList.map((oneCandidate) => {
            candidatePhotoUrl = '';
            if (oneCandidate.candidate_photo_url_medium) {
              candidatePhotoUrl = oneCandidate.candidate_photo_url_medium;
            } else if (oneCandidate.candidate_photo_url_large) {
              candidatePhotoUrl = oneCandidate.candidate_photo_url_large;
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
            return (
              <React.Fragment key={oneCandidate.we_vote_id}>
                { SupportStore.get(oneCandidate.we_vote_id) && SupportStore.get(oneCandidate.we_vote_id).is_support && (  // eslint-disable-line no-nested-ternary
                  <InnerWrapper>
                    <BioColumn>
                      {isCordova() ? candidatePhotoUrlHtml : <Avatar src={candidatePhotoUrl} /> }
                      <BioInformation>
                        <NameText>{oneCandidate.ballot_item_display_name}</NameText>
                        <DesktopTabletView>
                          <DescriptionText>{toTitleCase(oneCandidate.party)}</DescriptionText>
                        </DesktopTabletView>
                        <MobileView>
                          <DescriptionText>{oneCandidate.contest_office_name}</DescriptionText>
                        </MobileView>
                      </BioInformation>
                    </BioColumn>
                    <OfficeColumn>
                      <DesktopTabletView>
                        <OfficeText>{oneCandidate.contest_office_name}</OfficeText>
                      </DesktopTabletView>
                      <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={oneCandidate.we_vote_id} />
                    </OfficeColumn>
                  </InnerWrapper>
                )
                }
              </React.Fragment>
            );
          })
          }
        </Wrapper>
        <HR />
      </React.Fragment>
    );
  }
}

export default OfficeItemReadyToVote;
