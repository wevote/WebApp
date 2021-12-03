import { Component } from 'react';
import historyPush from '../common/utils/historyPush';

export default class ReadyRedirect extends Component {
  componentDidMount () {
    historyPush('/ready');
  }

  render () {
    return null;
  }
}
