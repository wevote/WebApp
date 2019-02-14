import React, { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';
import { renderLog } from './logging';

export default function connectToStores (stores, getState) {
  return (DecoractedComponent) => {
    class StoreConnector extends Component {
      constructor (props) {
        super(props);
        this.handleStoresChanged = this.handleStoresChanged.bind(this);

        this.state = getState(props);
      }

      componentWillMount () {
        stores.forEach(store => store.addChangeListener(this.handleStoresChanged));
      }

      componentWillReceiveProps (nextProps) {
        if (!shallowEqual(nextProps, this.props)) {
          this.setState(getState(nextProps));
        }
      }

      componentWillUnmount () {
        stores.forEach(store => store.removeChangeListener(this.handleStoresChanged));
      }

      handleStoresChanged () {
        this.setState(getState(this.props));
      }

      render () {
        renderLog(__filename);
        return <DecoractedComponent {...this.props} {...this.state} />;
      }
    }
    return StoreConnector;
  };
}
