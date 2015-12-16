import React, { Component, PropTypes } from 'react';

import './AddressBox.css';

export default class AddressBox extends Component {
    static propTypes = {

    }
    render () {
        return (
            <div>
                <input type='text' placeholder='Enter Your Address' />
            </div>
        );
    }
}
