import React, { Component } from 'react';
import PropTypes from 'prop-types';
import historyPush from '../common/utils/historyPush';
import LoadingWheel from '../common/components/Widgets/LoadingWheel';
import { renderLog } from '../common/utils/logging';
import ShareActions from '../common/actions/ShareActions';
import VoterActions from '../actions/VoterActions';
import ShareStore from '../common/stores/ShareStore';
import VoterStore from '../stores/VoterStore';

const BallotShared = React.lazy(() => import(/* webpackChunkName: 'BallotShared' */ './BallotShared/BallotShared'));

export default class SharedItemLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
      customLinkString: '',
      destinationBackupPath: '',
      destinationFullUrl: '',
      destinationFullUrlOverride: '',
      isBallotShare: false,
      isChallengeShare: false,
      sharedItemCodeIncoming: '',
      sharedItemCodeRetrieved: false,
      waitForVoterDeviceId: false,
    };
  }

  componentDidMount () {
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    // console.log('SharedItemLanding componentDidMount, params.shared_item_code: ', params.shared_item_code);
    const customLinkString = params.custom_link_string;
    const sharedItemCodeIncoming = params.shared_item_code;
    // console.log('componentDidMount sharedItemCodeIncoming:', sharedItemCodeIncoming);
    this.setState({
      componentDidMount: true,
      customLinkString,
      sharedItemCodeIncoming,
    });
    if (customLinkString) {
      // TODO
    } else {
      ShareActions.sharedItemRetrieveByCode(sharedItemCodeIncoming);
    }
  }

  componentWillUnmount () {
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { customLinkString, sharedItemCodeIncoming } = this.state;
    if (customLinkString) {
      // const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
      // const { destination_full_url: destinationFullUrl } = sharedItem;
      // this.setState({
      //   destinationFullUrl,
      // });
    }
    // console.log('sharedItemCodeIncoming:', sharedItemCodeIncoming);
    if (sharedItemCodeIncoming) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
      // console.log('sharedItem:', sharedItem);
      if (sharedItem && sharedItem.destination_full_url) {
        const {
          destination_full_url: destinationFullUrl,
          destination_full_url_override: destinationFullUrlOverride,
          email_secret_key: emailSecretKey,
          is_ballot_share: isBallotShare,
          is_challenge_share: isChallengeShare,
          shared_item_code_all_opinions: sharedItemCodeAllOpinions,
          other_voter_display_name: voterDisplayName,
          other_voter_first_name: voterFirstName,
          other_voter_last_name: voterLastName,
        } = sharedItem;
        // console.log('SharedItemLanding emailSecretKey:', emailSecretKey);
        let waitForVoterDeviceId = false;
        if (emailSecretKey) {
          if (VoterStore.voterDeviceId()) {
            // We trigger this here (instead of on the API server with ShareActions.sharedItemRetrieveByCode)
            //  to reduce delay around first page display
            //  If the email hasn't been previously verified, this verifies it and attaches it to this account
            // console.log('SharedItemLanding firstName:', voterFirstName, ', lastName:', voterLastName, ', fullName:', voterDisplayName);
            VoterActions.voterEmailAddressVerify(emailSecretKey, voterFirstName, voterLastName, voterDisplayName);
            // VoterActions.voterFullNameSoftSave(voterFirstName, voterLastName, voterDisplayName);
          } else {
            waitForVoterDeviceId = true;
          }
        }
        this.setState({
          destinationFullUrl,
          destinationFullUrlOverride,
          isBallotShare,
          isChallengeShare,
          sharedItemCodeAllOpinions,
          sharedItemCodeRetrieved: true,
          waitForVoterDeviceId,
        });
      } else if (sharedItem && sharedItem.destination_path_backup && sharedItem.destination_path_backup !== '') {
        this.setState({
          destinationBackupPath: sharedItem.destination_path_backup,
          sharedItemCodeRetrieved: true,
        });
      } else {
        console.log('SharedItemLanding destination_full_url not found');
      }
    }
  }

  onVoterStoreChange () {
    this.onShareStoreChange();
  }

  localHistoryPush = (routePath) => {
    const { waitForVoterDeviceId } = this.state;
    if (!waitForVoterDeviceId) {
      historyPush(routePath);
    }
  }

  render () {
    renderLog('SharedItemLanding');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      componentDidMount, destinationBackupPath, destinationFullUrlOverride,
      isBallotShare, isChallengeShare,
      sharedItemCodeAllOpinions, sharedItemCodeIncoming, sharedItemCodeRetrieved,
    } = this.state;
    let { destinationFullUrl } = this.state;
    // console.log('sharedItemCodeIncoming:', sharedItemCodeIncoming, 'sharedItemCodeAllOpinions:', sharedItemCodeAllOpinions);
    // console.log('destinationFullUrl:', destinationFullUrl, 'destinationFullUrlOverride:', destinationFullUrlOverride);
    if (destinationFullUrlOverride) {
      destinationFullUrl = destinationFullUrlOverride;
    }
    if (!componentDidMount) {
      // console.log('SharedItemLanding componentDidMount not true yet');
      return LoadingWheel;
    } else if (!sharedItemCodeRetrieved) {
      // console.log('SharedItemLanding sharedItemCodeRetrieved not retrieved');
      return LoadingWheel;
    } else if (sharedItemCodeRetrieved && (destinationFullUrl === undefined || destinationFullUrl === '')) {
      // console.log('SharedItemLanding destinationFullUrl undefined, directing to /ready');
      this.localHistoryPush('/ready');
      return LoadingWheel;
    } else if (destinationBackupPath !== '') {
      console.log('If we receive a destinationBackupPath, then the shared item was not found:', destinationBackupPath);
      this.localHistoryPush(destinationBackupPath);
      return LoadingWheel;
    } else {
      // console.log('destinationFullUrl:', destinationFullUrl);
      const { hostname } = window.location;
      // console.log('hostname:', hostname, ', destinationFullUrl:', destinationFullUrl);
      const hrefHostname = `https://${hostname}`;

      if (isBallotShare && (sharedItemCodeIncoming === sharedItemCodeAllOpinions)) {
        // We want to show the voter's endorsements
        // console.log('Ballot Share AllOpinions');
        return <BallotShared sharedItemCodeIncoming={sharedItemCodeIncoming} />;
      } else if (destinationFullUrl && destinationFullUrl.startsWith(hrefHostname)) {
        let destinationPath = destinationFullUrl.replace(hrefHostname, '');
        destinationPath = destinationPath.replace(':3000', ''); // For local development machines
        if (isChallengeShare) {
          // Add the sharedItemCode to the end of the URL so we have access to the sharedItem data on the next page
          destinationPath += `-${sharedItemCodeIncoming}`;
        }
        // console.log('SharedItemLanding destinationPath:', destinationPath);
        this.localHistoryPush(destinationPath);
        // const destinationPathWithModal = `${destinationPath}/modal/sic/${sharedItemCodeIncoming}`;
        // // console.log('*** WILL Direct to LOCAL destinationPathWithModal:', destinationPathWithModal);
        // historyPush(destinationPathWithModal);
        return LoadingWheel;
      } else {
        // console.log('SharedItemLanding destinationFullUrl:', destinationFullUrl);
        this.localHistoryPush(destinationFullUrl);
        // const destinationFullUrlWithModal = `${destinationFullUrl}/modal/sic/${sharedItemCodeIncoming}`;
        // // console.log('*** WILL Direct to EXTERNAL destinationFullUrlWithModal:', destinationFullUrlWithModal);
        // window.location.href = destinationFullUrlWithModal;
        return LoadingWheel;
      }
    }
  }
}
SharedItemLanding.propTypes = {
  match: PropTypes.object,
};
