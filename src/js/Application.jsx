import React, { Component, PropTypes } from "react";
import Navigator from './components/Navigator';
import MoreMenu from './components/MoreMenu';
import Header from './components/Header';
import SubHeader from './components/SubHeader';
import VoterStore from './stores/VoterStore';

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.object,
    voter_object: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
        voter_object: {}
    };
  }

  componentDidMount() {
    console.log("Application: About to initialize VoterStore");
    VoterStore.initialize((voter_object) => {
        //console.log(voter_object, 'voter_object is your object')
        this.setState({voter_object});
    });
  }

  render() {
    var { voter_object } = this.state;

    return (
    <div className="app-base">
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
          <div className="col-lg-4">
            {
                voter_object ?
                <div>
                    <MoreMenu {...voter_object} />
                </div>
                :
                <span></span>
            }
          </div>
          <div className="col-lg-8">
            { this.props.children }
          </div>
        </div>
      </div>
        <Navigator />
    </div>
  );
  }
}
