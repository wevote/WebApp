import React, { Component }             from 'react';
import { Router, Route, IndexRoute }    from 'react-router';

// main Application
import Application  		            from 'Application';

/****************************** ROUTE-COMPONENTS ******************************/
import Intro                            from 'route-components/Intro/Intro';
import IntroContests                    from 'route-components/Intro/IntroContests';
import IntroOpinions                    from 'route-components/Intro/IntroOpinions';

import Home                             from 'route-components/Home';

import MyBallot			                from 'route-components/MyBallot/MyBallot';
import Candidate                        from 'route-components/MyBallot/Candidate';
import Measure                          from 'route-components/MyBallot/Measure';
import Opinions                         from 'route-components/MyBallot/Opinions';

import Requests                         from 'route-components/Requests';
import Connect                          from 'route-components/Connect';
import Activity                         from 'route-components/Activity';
import More                             from 'route-components/More';
import NotFound                         from 'route-components/NotFound';

/****************************** Components ************************************/
//import Office                         from 'components/Office/Office';
//import Organization                   from 'components/Organization/Organization';

import AddFriend                        from 'components/AddFriend';

/****************************** Stylesheets ***********************************/
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/css/fonts.css';
import 'assets/css/application.css';
import 'assets/css/layout.css';
import 'assets/css/colors.css';

// polyfill
if (!Object.assign) Object.assign = React.__spread;

export default class Root extends Component {
    static propTypes = {
        history: React.PropTypes.object.isRequired
    };

    render() {
        const {history} = this.props;

        return (
            <Router history={history} >
                {
                    /*
                     * This is the intro section of the application.
                     * First time visitors should be directed here.
                     */
                }
                <Route path="/intro" component={Intro} >
                    <Route path="opinions" component={IntroOpinions} />
                    <Route path="contests" component={IntroContests} />
                </Route>

                <Route path="/location" component={Location} />

                <Route path="/" component={Application} >
                    <IndexRoute component={MyBallot} />
                    <Route path="myballot" component={MyBallot} >
                        <Route path="/candidate/:id" component={Candidate} >
                            {/*<Route path="org/:id" component={Organization}/>*/}
                        </Route>
                        <Route path="/measure/:id" component={Measure} />
                            {/*<Route path="org/:id" component={Organization}/>*/}
                        <Route path="/opinions" component={Opinions} />
                        {/*<Route path="/office/:id" component={Office} />*/}
                    </Route>

                    <Route path="requests" component={Requests} />
                    <Route path="connect" component={Connect} >
                        <Route path="add" component={AddFriend} />
                    </Route>

                    <Route path="activity" component={Activity} />
                    <Route path="more" component={More} />

                    // Any route that is not found -> @return NotFound component
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        );
    }
};
