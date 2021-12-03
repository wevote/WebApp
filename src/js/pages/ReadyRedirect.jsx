import { Component } from 'react';
import { historyPush } from '../utils/cordovaUtils';

export default class ReadyRedirect extends Component {
  componentDidMount () {
    historyPush('/ready');
  }

  render () {
    return null;
  }
}
