import React, { Component, PropTypes } from "react";
import AddressBox from "../../components/AddressBox";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import Helmet from "react-helmet";

export default class Location extends Component {
  static propTypes = {
      location: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {};
  }

  render () {
    // console.log("Settings/Location");
    return <div>
      <Helmet title="Enter Your Address - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <h3 className="h3">
        Enter address where you are registered to vote
      </h3>
      <div>
        <AddressBox {...this.props} saveUrl="/ballot" />
      </div>
    </div>;
  }
}
