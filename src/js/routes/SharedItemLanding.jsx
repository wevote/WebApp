import { Component } from 'react';
import PropTypes from 'prop-types';
import { historyPush } from '../utils/cordovaUtils';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import ShareActions from '../actions/ShareActions';
import ShareStore from '../stores/ShareStore';

export default class SharedItemLanding extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      customLinkString: '',
      destinationFullUrl: '',
      sharedItemCode: '',
    };
  }

  componentDidMount () {
    // console.log('SharedItemLanding componentDidMount, this.props.params.shared_item_code: ' + this.props.params.shared_item_code);
    const customLinkString = this.props.params.custom_link_string;
    const sharedItemCode = this.props.params.shared_item_code;
    this.setState({
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

  componentWillReceiveProps (nextProps) {
    // console.log('SharedItemLanding componentWillReceiveProps');
    if (nextProps.params.custom_link_string && this.state.customLinkString !== nextProps.params.custom_link_string) {
      // We need this test to prevent an infinite loop
      const customLinkString = this.props.params.custom_link_string;
      // console.log('SharedItemLanding componentWillReceiveProps, different sharedItemCode: ', nextProps.params.shared_item_code);
      this.setState({
        customLinkString,
      });
      if (customLinkString) {
        // TODO
      }
    }
    if (nextProps.params.shared_item_code && this.state.sharedItemCode !== nextProps.params.shared_item_code) {
      // We need this test to prevent an infinite loop
      const sharedItemCode = this.props.params.shared_item_code;
      // console.log('SharedItemLanding componentWillReceiveProps, different sharedItemCode: ', nextProps.params.shared_item_code);
      this.setState({
        sharedItemCode,
      });
      if (sharedItemCode) {
        ShareActions.sharedItemRetrieveByCode(sharedItemCode);
      }
    }
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
      const { destination_full_url: destinationFullUrl } = sharedItem;
      this.setState({
        destinationFullUrl,
      });
    }
  }

  render () {
    renderLog('SharedItemLanding');  // Set LOG_RENDER_EVENTS to log all renders
    const { destinationFullUrl } = this.state;
    if (destinationFullUrl === undefined || destinationFullUrl === '') {
      // console.log('SharedItemLanding destinationFullUrl undefined');
      return LoadingWheel;
    } else {
      const { hostname } = window.location;
      // console.log('hostname:', hostname, ', destinationFullUrl:', destinationFullUrl);
      const hrefHostname = `https://${hostname}`;
      let destinationLocalUrl = destinationFullUrl.replace(hrefHostname, '');
      destinationLocalUrl = destinationLocalUrl.replace(':3000', ''); // For local development machines
      historyPush(destinationLocalUrl);
      return LoadingWheel;
    }
  }
}
