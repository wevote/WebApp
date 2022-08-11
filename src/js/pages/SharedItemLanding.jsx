import React, { Component } from 'react';
import PropTypes from 'prop-types';
import historyPush from '../common/utils/historyPush';
import LoadingWheel from '../common/components/Widgets/LoadingWheel';
import { renderLog } from '../common/utils/logging';
import ShareActions from '../common/actions/ShareActions';
import ShareStore from '../common/stores/ShareStore';

const BallotShared = React.lazy(() => import(/* webpackChunkName: 'BallotShared' */ './BallotShared/BallotShared'));

export default class SharedItemLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
      customLinkString: '',
      destinationFullUrl: '',
      sharedItemCodeIncoming: '',
      sharedItemCodeRetrieved: false,
    };
  }

  componentDidMount () {
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
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.shareStoreListener.remove();
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
    if (sharedItemCodeIncoming) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCodeIncoming);
      // console.log('sharedItem:', sharedItem);
      const {
        destination_full_url: destinationFullUrl,
        is_ballot_share: isBallotShare,
        shared_item_code_all_opinions: sharedItemCodeAllOpinions,
      } = sharedItem;
      this.setState({
        destinationFullUrl,
        isBallotShare,
        sharedItemCodeAllOpinions,
        sharedItemCodeRetrieved: true,
      });
    }
  }

  render () {
    renderLog('SharedItemLanding');  // Set LOG_RENDER_EVENTS to log all renders
    const { componentDidMount, destinationFullUrl, isBallotShare, sharedItemCodeAllOpinions, sharedItemCodeIncoming, sharedItemCodeRetrieved } = this.state;
    // console.log('sharedItemCodeIncoming:', sharedItemCodeIncoming, 'sharedItemCodeAllOpinions:', sharedItemCodeAllOpinions);
    if (!componentDidMount) {
      // console.log('SharedItemLanding componentDidMount not true yet');
      return LoadingWheel;
    } else if (!sharedItemCodeRetrieved) {
      // console.log('SharedItemLanding sharedItemCodeRetrieved not retrieved');
      return LoadingWheel;
    } else if (sharedItemCodeRetrieved && (destinationFullUrl === undefined || destinationFullUrl === '')) {
      // console.log('SharedItemLanding destinationFullUrl undefined');
      historyPush('/ready');
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
        let destinationLocalUrl = destinationFullUrl.replace(hrefHostname, '');
        destinationLocalUrl = destinationLocalUrl.replace(':3000', ''); // For local development machines
        historyPush(destinationLocalUrl);
        // const destinationLocalUrlWithModal = `${destinationLocalUrl}/modal/sic/${sharedItemCodeIncoming}`;
        // // console.log('*** WILL Direct to LOCAL destinationLocalUrlWithModal:', destinationLocalUrlWithModal);
        // historyPush(destinationLocalUrlWithModal);
        return LoadingWheel;
      } else {
        historyPush(destinationFullUrl);
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
