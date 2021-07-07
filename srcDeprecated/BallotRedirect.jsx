import { Component } from 'react';
import { historyPush } from '../../utils/cordovaUtils';

export default class BallotRedirect extends Component {
  componentDidMount () {
    historyPush('/ballot');
  }

  render () {
    return null;
  }
}
