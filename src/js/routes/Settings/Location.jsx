import React, { Component } from "react";
import AddressBox from "../../components/AddressBox";
import Helmet from "react-helmet";

export default class Location extends Component {
      // <div className="container-fluid well u-gutter__top--small fluff-full1">
      //   <div>
      //     <div className="medium">
      //       March 2016: This site is a demo version of We Vote.
      //       If you would like to see a recent live ballot, copy and paste
      //       one of these addresses and paste them in the box above.
      //     </div>
      //     <h4 className="h4">
      //       Charlotte, NC 28205
      //     </h4>
      //     or
      //     <h4 className="h4">
      //       Columbus, OH 43202
      //     </h4>
      //   </div>
      // </div>

  render () {
    return <div>
      <Helmet title="Enter Your Address - We Vote" />
      <h3 className="h3">
        Enter address where you are registered to vote
      </h3>
      <div>
        <AddressBox {...this.props} saveUrl="/ballot" />
      </div>
    </div>;
  }
}
