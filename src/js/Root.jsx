import React from "react";
import { Route, IndexRoute, IndexRedirect } from "react-router";

// main Application
import Application from "./Application";

/****************************** ROUTE-COMPONENTS ******************************/
/* Intro */
import Intro from "./routes/Intro/Intro";
import IntroContests from "./routes/Intro/IntroContests";
import IntroOpinions from "./routes/Intro/IntroOpinions";

/* Settings */
import SettingsDashboard from "./routes/Settings/SettingsDashboard";
import Settings from "./routes/Settings/Settings";
import Location from "./routes/Settings/Location";

/* Pages that use Ballot Navigation */
import BallotIndex from "./routes/Ballot/BallotIndex";
import Ballot from "./routes/Ballot/Ballot";
import Candidate from "./routes/Ballot/Candidate";
import EmptyBallot from "./routes/Ballot/EmptyBallot";

/* Ballot Off-shoot Pages */
import Opinions from "./routes/Opinions";
import GuidePositionList from './routes/Guide/PositionList'; // A list of all positions from one guide

/* More */
import More from "./routes/More";
import About from "./routes/More/About";
import OpinionsFollowed from "./routes/More/OpinionsFollowed";
import SignIn from "./routes/More/SignIn";
import EmailBallot from "./routes/More/EmailBallot";
import Privacy from "./routes/More/Privacy";

// import Measure                          from "routes/Ballot/Measure";
// import Opinion                          from "routes/Ballot/Opinion";
import Requests from "./routes/Requests";
import Connect from "./routes/Connect";
import Activity from "./routes/Activity";
import NotFound from "./routes/NotFound";
import AddFriends from "./routes/AddFriends";

const routes = (firstVisit, voter) =>
  <Route path="/" component={Application} voter={voter} firstVisit={firstVisit}>
    {
     /*
      * This is the intro section of the application.
      * First time visitors should be directed here.
      */
     }
    <Route path="/intro" component={Intro}>
      <Route path="/intro/opinions" component={IntroOpinions} />
      <Route path="/intro/contests" component={IntroContests} />
    </Route>

    {/* Settings go in this structure... */}
    <Route path="/settings" component={SettingsDashboard}>
      <IndexRoute component={Settings} />
      <Route path="/settings/location" component={Location} />  /* Complete path on one line for searching */
    </Route>

    {/* Ballot Off-shoot Pages */}
    <Route path="/opinions" component={Opinions} />

    <Route path="/friends" >
      <Route path="add" component={AddFriends} />
      <Route path="remove" />
    </Route>

    {/* More Menu Pages */}
    <Route path="/more/sign_in" component={SignIn} />
    <Route path="/more/email_ballot" component={EmailBallot} />
    <Route path="/more/about" component={About} />
    <Route path="/more/opinions/followed" component={OpinionsFollowed} />
    <Route path="/more/privacy" component={Privacy} />

    {/* Voter Guide Pages */}
    <Route path="/guidepositions/:we_vote_id" component={GuidePositionList} />

    { firstVisit ? <IndexRoute component={Intro} /> : <IndexRedirect to="ballot" /> }

    <Route path="ballot" component={BallotIndex}>
      <IndexRoute component={Ballot} />
      <Route path="/candidate/:we_vote_id" component={Candidate} />
    </Route>

    <Route path="ballot/empty" component={EmptyBallot} />
      {/*
          <Route path="org/:id" component={Organization}/>
          <Route path="measure/:id" component={Measure} />
          <Route path="org/:id" component={Organization}/>
          <Route path="opinion" component={Opinion} />
          <Route path="/office/:id" component={Office} />

      */}

    <Route path="requests" component={Requests} />
    <Route path="connect" component={Connect} />

    <Route path="activity" component={Activity} />
    <Route path="more" component={More} />

    // Any route that is not found -> @return NotFound component
    <Route path="*" component={NotFound} />
  </Route>;


export default routes;
