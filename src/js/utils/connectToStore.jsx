import React, { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default function connectToStores(stores, getState) {
    return function (DecoractedComponent) {

        return class StoreConnector extends Component {
            constructor(props) {
                super(props);
                this.handleStoresChanged = this.handleStoresChanged.bind(this);

                this.state = getState(props);
            }

            componentWillMount() {
                stores.forEach(store =>
                    store.addChangeListener(this.handleStoresChanged)
                );
            }

            componentWillReceiveProps(nextProps) {
                if (!shallowEqual(nextProps, this.props)) {
                    this.setState(getState(nextProps));
                }
            }

            componentWillUnmount() {
                stores.forEach(store =>
                    store.removeChangeListener(this.handleStoresChanged)
                );
            }

            handleStoresChanged() {
                this.setState(getState(this.props));
            }

            render() {
                return <DecoractedComponent {...this.props} {...this.state} />;
            }
        };
    };
}
