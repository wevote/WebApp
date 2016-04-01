import React, { Component, PropTypes } from "react";
import AddressBox from "../../components/AddressBox";

export default class Location extends Component {

  render () {
    return <div>
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">
          Enter address where you are registered to vote
        </h3>
        <div>
          <AddressBox {...this.props} saveUrl="/ballot" />
        </div>
      </div>
      <div className="container-fluid well gutter-top--small fluff-full1">
        <div>
          <div className="medium">
            March 2016: This site is a demo version of We Vote.
            If you would like to see a recent live ballot, copy and paste
            one of these addresses and paste them in the box above.
          </div>
          <h4>
            Charlotte, NC 28205
          </h4>
          or
          <h4>
            Columbus, OH 43202
          </h4>
        </div>
      </div>
    </div>;
  }
}
