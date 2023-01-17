import { Component } from 'react';
import historyPush from '../common/utils/historyPush';

export default class ReadyRedirect extends Component {
  componentDidMount () {
    // console.log('ready redirect -----------------------');
    historyPush('/ready');
  }

  render () {
    return null;
  }
}
