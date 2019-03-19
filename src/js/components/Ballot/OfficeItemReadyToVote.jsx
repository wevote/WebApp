import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';
import thumbsUpColorIcon from '../../../img/global/svg-icons/thumbs-up-color-icon.svg';
import upArrowColorIcon from '../../../img/global/icons/up-arrow-color-icon.svg';

export default class OfficeItemReadyToVote extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    candidate_list: PropTypes.array,
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
    let { ballot_item_display_name: ballotItemDisplayName } = this.props;
    const { we_vote_id: weVoteId } = this.props;
    const officeLink = `/office/${weVoteId}`;
    const goToOfficeLink = () => { historyPush(officeLink); };
    const isSupportArray = [];
    let candidateWithMostSupport = null;
    let voterSupportsAtLeastOneCandidate = false;
    let supportProps;
    let isSupport;

    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        isSupport = supportProps.is_support;

        if (isSupport) {
          isSupportArray.push(candidate.ballot_item_display_name);
          voterSupportsAtLeastOneCandidate = true;
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largestSupportCount = 0;
    let atLeastOneCandidateChosen = false;

    if (isSupportArray.length === 0) {
      let networkSupportCount;
      let networkOpposeCount;

      this.props.candidate_list.forEach((candidate) => {
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          networkSupportCount = supportProps.support_count;
          networkOpposeCount = supportProps.oppose_count;

          if (networkSupportCount > networkOpposeCount) {
            if (networkSupportCount > largestSupportCount) {
              largestSupportCount = networkSupportCount;
              candidateWithMostSupport = candidate.ballot_item_display_name;
              atLeastOneCandidateChosen = true;
            }
          }
        }
      });
    }

    return (
      <div className="card-main office-item">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            { this.props.link_to_ballot_item_page ?
              <Link to={officeLink}>{ballotItemDisplayName}</Link> :
              ballotItemDisplayName
            }
          </h2>

          <div className={this.props.link_to_ballot_item_page ? 'u-cursor--pointer' : null}>
            { this.props.candidate_list.map(oneCandidate => (
              <div key={oneCandidate.we_vote_id}>
                {/* *** Candidate name *** */}
                { SupportStore.get(oneCandidate.we_vote_id) && SupportStore.get(oneCandidate.we_vote_id).is_support ? (  // eslint-disable-line no-nested-ternary
                  <div className="u-flex u-items-center">
                    <div
                      className="u-flex-auto u-cursor--pointer"
                      onClick={this.props.link_to_ballot_item_page ?
                        goToOfficeLink : null}
                    >
                      <h2 className="h5">
                        {oneCandidate.ballot_item_display_name}
                      </h2>
                    </div>

                    <div className="u-flex-none u-justify-end">
                      <span className="u-push--xs">Chosen by you</span>
                      <img src={cordovaDot(thumbsUpColorIcon)} width="24" height="24" />
                    </div>
                  </div>
                ) :
                  candidateWithMostSupport === oneCandidate.ballot_item_display_name ? (        // eslint-disable-line no-nested-ternary
                    <div className="u-flex u-items-center">
                      <div className="u-flex-auto u-cursor--pointer"
                           onClick={this.props.link_to_ballot_item_page ?
                             goToOfficeLink : null}
                      >
                        <h2 className="h5">
                          {oneCandidate.ballot_item_display_name}
                        </h2>
                      </div>
                      <div className="u-flex-none u-justify-end">
                        <span className="u-push--xs">Your network supports</span>
                        <img src={cordovaDot(upArrowColorIcon)} className="network-positions__support-icon" width="20" height="20" />
                      </div>
                    </div>
                  ) :
                    isSupportArray === 0 && candidateWithMostSupport !== oneCandidate.ballot_item_display_name && !voterSupportsAtLeastOneCandidate ?
                      <div className="u-flex-none u-justify-end">Your network is undecided</div> :
                      null
                }
                {/* *** "Positions in your Network" bar OR items you can follow *** */}
              </div>
            ))
          }
            { () => {
              if (voterSupportsAtLeastOneCandidate) {
                return null;
              } else {
                return (
                  <span>
                    {atLeastOneCandidateChosen ? null : <div className="u-tr">Your network is undecided</div>}
                  </span>
                );
              }
            }
            }
          </div>
        </div>
      </div>
    );
  }
}
