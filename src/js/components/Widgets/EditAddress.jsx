import React from 'react';

export default function EditAddress (props) {
  return (
    <div>
      {props.address ?
        <p className="ballot__date_location">
          {props.address}
          <span className="hidden-print"> (<a onClick={props._toggleSelectAddressModal}>Edit</a>)</span>
        </p> :
        <p className="ballot__date_location">
          In order to see your ballot, please enter your address.
          <span className="hidden-print"> (<a onClick={props._toggleSelectAddressModal}>Add Your Address</a>)</span>
        </p> }
    </div>
  );
}
