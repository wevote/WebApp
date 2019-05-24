import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';


export default class OfficeItemReadyToVote extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
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
    const isSupportArray = [];
    let supportProps;
    let isSupport;

    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    this.props.candidate_list.forEach((candidate) => {
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

      this.props.candidate_list.forEach((candidate) => {
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

    return (
      <div className="card-main office-item">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            {/* Office name */}
            {ballotItemDisplayName}
          </h2>

          <div>
            { this.props.candidate_list.map(oneCandidate => (
              <div key={oneCandidate.we_vote_id}>
                { SupportStore.get(oneCandidate.we_vote_id) && SupportStore.get(oneCandidate.we_vote_id).is_support ? (  // eslint-disable-line no-nested-ternary
                  <div className="u-flex u-items-center">
                    <div
                      className="u-flex-auto"
                    >
                      <h2 className="h5">
                        {oneCandidate.ballot_item_display_name}
                      </h2>
                    </div>

                    <div className="u-flex-none u-justify-end">
                      <span className="u-push--xs">Chosen by you</span>
                      <img src={cordovaDot('/img/global/svg-icons/thumbs-up-color-icon.svg')} width="24" height="24" />
                    </div>
                  </div>
                ) :
                  null
                }
              </div>
            ))
            }
          </div>
        </div>
      </div>
    );
  }
}
