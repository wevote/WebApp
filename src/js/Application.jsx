import React, { Component, PropTypes } from "react";
import Navigator from './components/Navigator';
import MoreMenu from './components/MoreMenu';
import VoterStore from './stores/VoterStore';
import Header from './components/Header';
import SubHeader from './components/SubHeader';

export default class Application extends Component {
    static propTypes = {
        children: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("About to initialize VoterStore");
        VoterStore.initialize( (voter_list) => this.setState({ voter_list }) );

        // NOTE: This doesn't return voter_photo_url because at the time checked it hasn't finished retrieving yet
        //var voter_photo_url = VoterStore.getVoterPhotoURL();
        //console.log("Application.jsx, voter_photo_url: " + voter_photo_url);
        //var local_voter =  VoterStore.getVoter();
        //this.setProps({ first_name: local_voter.first_name });

        //var local_voter =  VoterStore.getVoter();
        //console.log("local_voter.first_name: " + local_voter.first_name);
        //this.setState({ first_name: local_voter.first_name });
    }

    componentWillUnmount() {
        // TODO
    }

	render() {
        var { voter_list } = this.state;

		return (
        <div className="app-base">
          <div className="row">
            <div className="container-fluid">
              <Header />
            </div>
          </div>
          <div className="row">
            <div className="container-fluid">
              <SubHeader />
            </div>
          </div>
          <div className="row">
            <div className="container-fluid">
              <div className="col-lg-4">
                {
                  voter_list ? voter_list
                    .map( item =>
                      <MoreMenu key={item.we_vote_id} {...item} />
                    ) : (
                      <MoreMenu />
                    )
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
