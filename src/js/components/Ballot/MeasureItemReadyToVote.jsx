import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { capitalizeString } from '../../utils/textFormat';


export default class MeasureItemReadyToVote extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
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

    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    return (
      <div className="card-main measure-card">

        <div className="card-main__content">
          <div className="u-flex u-items-center">

            <div className="u-flex-auto">
              <h2 className="card-main__display-name">
                {/* Measure name */}
                {ballotItemDisplayName}
              </h2>
            </div>
            {
              supportProps && supportProps.is_support ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Supported by you</span>
                  <img src={cordovaDot('/img/global/svg-icons/thumbs-up-color-icon.svg')} width="24" height="24" />
                </div>
              ) :
                null
            }
            {
              supportProps && supportProps.is_oppose ? (
                <div className="u-flex-none u-justify-end">
                  <span className="u-push--xs">Opposed by you</span>
                  <img src={cordovaDot('/img/global/svg-icons/thumbs-down-color-icon.svg')} width="24" height="24" />
                </div>
              ) :
                null
            }
          </div>
        </div>
      </div>
    );
  }
}
