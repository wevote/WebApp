import React, { Component, PropTypes } from "react";
import EditAddressPopover from "./EditAddressPopover";

export default class EditAddress extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    _toggleSelectAddressModal: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    let address = this.props.address.text_for_map_search || "";
    let normalized_line1 = this.props.address.normalized_line1 || "";

    if (address.length) {
      return (
        <p className="ballot__date_location">
          { address }
          { normalized_line1.length ? <span>&nbsp;</span> : <EditAddressPopover popover_off={false} placement={"bottom"} onClick={this.props._toggleSelectAddressModal} /> }
          <span className="hidden-print">(<a onClick={this.props._toggleSelectAddressModal}>Edit</a>)</span>
        </p>
      );
    } else {
      return (
        <p className="ballot__date_location">
          In order to see your ballot, please enter your address.
          <span className="hidden-print">&nbsp;(<a onClick={this.props._toggleSelectAddressModal}>Add Your Address</a>)</span>
        </p>
      );
    }
  }
}
