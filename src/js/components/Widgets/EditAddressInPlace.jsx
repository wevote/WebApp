import React, { Component, PropTypes } from "react";
import AddressBox from "../AddressBox";
import { shortenText } from "../../utils/textFormat";

export default class EditAddressInPlace extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      editingAddress: false,
      text_for_map_search: "",
    };
    this.toggleEditingAddress = this.toggleEditingAddress.bind(this);
  }

  componentDidMount () {
    // console.log("In EditAddressInPlace componentDidMount");
    this.setState({
      text_for_map_search: this.props.address.text_for_map_search || "",
    });
  }
  componentWillReceiveProps (nextProps) {
    // console.log("EditAddressInPlace componentWillReceiveProps");
    this.setState({
      text_for_map_search: nextProps.address.text_for_map_search || "",
    });
  }

  toggleEditingAddress () {
    this.setState({
      editingAddress: !this.state.editingAddress
    });
  }

  render () {
    let no_address_message = "- no address entered -";
    let maximum_address_display_length = 60;

    if (this.state.editingAddress) {
      return <span>
          <h4 className="h4">Please Enter the Address Where You Are Registered to Vote</h4>
          <AddressBox cancelEditAddress={this.toggleEditingAddress} saveUrl="/ballot" toggleSelectAddressModal={this.props.toggleFunction} />
        </span>;

    } else {
      return <span>
          <h4 className="h4">Your Address</h4>
          <span className="ballot__edit-address-preview">{ this.state.text_for_map_search.length ? shortenText(this.state.text_for_map_search, maximum_address_display_length) : no_address_message }</span>
          <span className="hidden-print"> (<a onClick={this.toggleEditingAddress}>Edit</a>)</span>
        </span>;
    }
  }
}
