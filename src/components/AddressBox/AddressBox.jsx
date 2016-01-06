import React, { Component, PropTypes } from 'react';

import { voterAddressSave } from 'utils/APIS'

export default class AddressBox extends Component {
    let inputStyle = {
        border: 'none',
        outline: 'none'
    };

    static propTypes = {

    }
    constructor(props) {
        super(props);
        this.state = {
            hasChanged: false,
            address: null
        };
    }

    render () {
        return (
            <div>
                <input
                    className="addressbox"
                    type="text"
                    placeholder="Enter Your Address"
                    style={inputStyle}
                    value={this.state.address}
                    onChange={this.onChange.bind(this) }
                    onBlur={this.onBlur.bind(this)}
                />
            </div>
        );
    }

    onChange (e) {
        this.setState({
            value: e.target.value,
            hasChanged: true
        });
    }

    onBlur (e) {
        this.saveChanges(this.state.address)
    }

    saveChanges(address){
        let { changeSaved } = this.props;
        voterAddressSave(address)
    }

}
