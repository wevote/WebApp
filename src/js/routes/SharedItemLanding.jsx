import { Component } from 'react';
import PropTypes from 'prop-types';
import { historyPush } from '../utils/cordovaUtils';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import ShareActions from '../actions/ShareActions';
import ShareStore from '../stores/ShareStore';

export default class SharedItemLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
      customLinkString: '',
      destinationFullUrl: '',
      sharedItemCode: '',
      sharedItemCodeRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('SharedItemLanding componentDidMount, this.props.params.shared_item_code: ', this.props.params.shared_item_code);
    const customLinkString = this.props.params.custom_link_string;
    const sharedItemCode = this.props.params.shared_item_code;
    // console.log('componentDidMount sharedItemCode:', sharedItemCode);
    this.setState({
      componentDidMount: true,
      customLinkString,
      sharedItemCode,
    });
    if (customLinkString) {
      // TODO
    } else {
      ShareActions.sharedItemRetrieveByCode(sharedItemCode);
    }
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.shareStoreListener.remove();
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { customLinkString, sharedItemCode } = this.state;
    if (customLinkString) {
      // const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      // const { destination_full_url: destinationFullUrl } = sharedItem;
      // this.setState({
      //   destinationFullUrl,
      // });
    }
    if (sharedItemCode) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      // console.log('sharedItem:', sharedItem);
      const { destination_full_url: destinationFullUrl } = sharedItem;
      this.setState({
        destinationFullUrl,
        sharedItemCodeRetrieved: true,
      });
    }
  }

  render () {
    renderLog('SharedItemLanding');  // Set LOG_RENDER_EVENTS to log all renders
    const { componentDidMount, destinationFullUrl, sharedItemCode, sharedItemCodeRetrieved } = this.state;
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
      if (destinationFullUrl && destinationFullUrl.startsWith(hrefHostname)) {
        let destinationLocalUrl = destinationFullUrl.replace(hrefHostname, '');
        destinationLocalUrl = destinationLocalUrl.replace(':3000', ''); // For local development machines
        const destinationLocalUrlWithModal = `${destinationLocalUrl}/modal/sic/${sharedItemCode}`;
        // console.log('*** WILL Direct to LOCAL destinationLocalUrlWithModal:', destinationLocalUrlWithModal);
        historyPush(destinationLocalUrlWithModal);
        return LoadingWheel;
      } else {
        const destinationFullUrlWithModal = `${destinationFullUrl}/modal/sic/${sharedItemCode}`;
        // console.log('*** WILL Direct to EXTERNAL destinationFullUrlWithModal:', destinationFullUrlWithModal);
        window.location.href = destinationFullUrlWithModal;
        return LoadingWheel;
      }
    }
  }
}
SharedItemLanding.propTypes = {
  params: PropTypes.object,
};
