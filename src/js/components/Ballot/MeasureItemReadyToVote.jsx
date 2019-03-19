import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';
import thumbsUpColorIcon from '../../../img/global/svg-icons/thumbs-up-color-icon.svg';
import thumbsDownColorIcon from '../../../img/global/svg-icons/thumbs-down-color-icon.svg';
import upArrowColorIcon from '../../../img/global/icons/up-arrow-color-icon.svg';
import downArrowColorIcon from '../../../img/global/icons/down-arrow-color-icon.svg';

export default class MeasureItemReadyToVote extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    linkToBallotItemPage: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.measureWeVoteId) });
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
    this.setState({ supportProps: SupportStore.get(this.props.measureWeVoteId) });
  }

  render () {
    renderLog(__filename);
    const { supportProps } = this.state;

    let { ballot_item_display_name: ballotItemDisplayName } = this.props;
    const { measureWeVoteId }  = this.props;
    const measureLink = `/measure/${measureWeVoteId}`;

    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    return (
      <div className="card-main measure-card">

        <div className="card-main__content">
          <div className="u-flex u-items-center">

            <div className="u-flex-auto u-cursor--pointer">
              <h2 className="card-main__display-name">
                { this.props.linkToBallotItemPage ?
                  <a onClick={measureLink}>{ballotItemDisplayName}</a> :
                  ballotItemDisplayName
                }
              </h2>
            </div>

            {
              supportProps && supportProps.is_support ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Supported by you</span>
                  <img src={cordovaDot(thumbsUpColorIcon)} width="24" height="24" />
                </div>
              ) :
                null
            }
            {
              supportProps && supportProps.is_oppose ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Opposed by you</span>
                  <img src={cordovaDot(thumbsDownColorIcon)} width="24" height="24" />
                </div>
              ) :
                null
            }
            {
              supportProps && !supportProps.is_support && !supportProps.is_oppose && supportProps.support_count > supportProps.oppose_count ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Your network supports</span>
                  <img src={cordovaDot(upArrowColorIcon)} className="network-positions__support-icon" width="20" height="20" />
                </div>
              ) :
                null
            }
            {
              supportProps && !supportProps.is_support && !supportProps.is_oppose && supportProps.support_count < supportProps.oppose_count ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Your network opposes</span>
                  <img src={cordovaDot(downArrowColorIcon)} className="network-positions__oppose-icon" width="20" height="20" />
                </div>
              ) :
                null
            }
            {
              supportProps && !supportProps.is_support && !supportProps.is_oppose && supportProps.support_count === supportProps.oppose_count ? (
                <div className="u-flex-none u-justify-end">
                  Your network is undecided
                  <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover d-print-none" aria-hidden="true" />
                </div>
              ) :
                null
            }
            {/* This is the area *under* the measure title */}
          </div>
        </div>
        {' '}
        {/* END .card-main__content */}
      </div>
    );
  }
}
