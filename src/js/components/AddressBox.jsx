import React, { Component } from 'react';

// import 'stylesheets/main.scss';

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
