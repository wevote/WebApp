import React, { Component, PropTypes } from "react";
import Navigator from "./components/Navigator";
import MoreMenu from "./components/MoreMenu";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";
import VoterStore from "./stores/VoterStore";

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      voter: { }
    };
  }

  componentDidMount () {
    // console.log("Application.jsx, About to initialize VoterStore");
    VoterStore.getLocation( (err) => {
      if (err) console.error("Application.jsx, Error initializing voter object", err);
      VoterStore.getVoterObject( (_err, voter) => {
        if (_err) console.error("Application.jsx, Error initializing voter object", err);
        this.setState({voter});
        // console.log("Application.jsx, voter_object: ", voter)
      });
    });
    // console.log("Application.jsx componentDidMount VoterStore.addChangeListener");
    VoterStore.addChangeListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log("Application.jsx componentWillUnmount VoterStore.removeChangeListener");
    VoterStore.removeChangeListener(this._onVoterStoreChange.bind(this));
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getCachedVoterObject()
    });
  }

  render () {
    var { location: { pathname }} = this.props;
    var { voter } = this.state;
    // console.log("In Application.jsx render, voter: ", voter)

    return <div className="app-base">
      <div className="container-fluid">
        <div className="row">
          <Header/>
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
            { voter.signed_in_personal ? <MoreMenu {...voter} /> : <MoreMenu /> }
          </div>
          <div className="col-xs-8 col-sm-8 col-md-8 container-main">
            { this.props.children }
          </div>
        </div>
      </div>
        <Navigator pathname={pathname} />
    </div>;
  }
}
