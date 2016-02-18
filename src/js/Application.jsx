import React, { Component, PropTypes } from "react";
import Navigator from "./components/Navigator";
import MoreMenu from "./components/MoreMenu";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    // TODO: Figure out if voter is actually signed in...
    this.setState({ is_signed_in: false });
  }

  render () {
    var {is_signed_in} = this.state;
    var {voter} = this.props.route;

    return <div className="app-base">
      <div className="container-fluid">
        <div className="row">
          <Header />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <SubHeader />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-4 col-sm-4 col-md-4 no-show">
            { is_signed_in ? <MoreMenu {...voter} /> : <span></span> }
          </div>
          <div className="col-xs-8 col-sm-8 col-md-8">
            { this.props.children }
          </div>
        </div>
      </div>
        <Navigator />
    </div>;
  }
}
