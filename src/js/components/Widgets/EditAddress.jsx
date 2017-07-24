import React, { Component } from "react";

export default class EditAddress extends Component {
  render () {
    if (this.props.address) {
      return (
        <p className="ballot__date_location">
          {this.props.address}
          <span className="hidden-print"> (<a onClick={this.props._toggleSelectAddressModal}>Edit</a>)</span>
        </p>
      );
    } else {
      return (
        <p className="ballot__date_location">
          In order to see your ballot, please enter your address.
          <span className="hidden-print"> (<a onClick={this.props._toggleSelectAddressModal}>Add Your Address</a>)</span>
        </p>
      );
    }
  }
}
