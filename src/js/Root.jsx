import React from "react";
import { Route, IndexRoute, IndexRedirect } from "react-router";
import cookies from "./utils/cookies";

// main Application
import Application from "./Application";

/****************************** ROUTE-COMPONENTS ******************************/
import About from "./routes/More/About";
import Activity from "./routes/Activity";
import Ballot from "./routes/Ballot/Ballot";
import BallotIndex from "./routes/Ballot/BallotIndex";
import Bookmarks from "./components/Bookmarks/Bookmarks";
import Candidate from "./routes/Ballot/Candidate";
import ClaimYourPage from "./routes/Settings/ClaimYourPage";
import Connect from "./routes/Connect";
import Credits from "./routes/More/Credits";
import EmailBallot from "./routes/More/EmailBallot";
import EmptyBallot from "./routes/Ballot/EmptyBallot";
import FacebookSignInProcess from "./routes/Process/FacebookSignInProcess";
import FAQ from "./routes/More/FAQ";
import Friends from "./routes/Friends";
import GuidePositionList from "./routes/Guide/GuidePositionList";
import Intro from "./routes/Intro/Intro";
import IntroContests from "./routes/Intro/IntroContests";
import IntroOpinions from "./routes/Intro/IntroOpinions";
import IntroStory from "./routes/Intro/IntroStory";
import Location from "./routes/Settings/Location";
import Measure from "./routes/Ballot/Measure";
import NotFound from "./routes/NotFound";
import Office from "./routes/Ballot/Office";
import Opinions from "./routes/Opinions";
import OpinionsFollowed from "./routes/OpinionsFollowed";
import Privacy from "./routes/More/Privacy";
import Requests from "./routes/Requests";
import SampleBallot from "./routes/Intro/SampleBallot";
import Settings from "./routes/Settings/Settings";
import SettingsDashboard from "./routes/Settings/SettingsDashboard";
import SignIn from "./routes/More/SignIn";
import SignInEmailProcess from "./routes/Process/SignInEmailProcess";
import TermsOfService from "./routes/More/TermsOfService";
import TwitterSignInProcess from "./routes/Process/TwitterSignInProcess";
import TwitterSignInProcessOld from "./routes/Process/TwitterSignInProcessOld";
import VerifyEmailProcess from "./routes/Process/VerifyEmailProcess";
import FriendInvitationByEmailVerifyProcess from "./routes/Process/FriendInvitationByEmailVerifyProcess";
import VerifyThisIsMe from "./routes/Guide/VerifyThisIsMe";
import YourPage from "./routes/YourPage";

const firstVisit = !cookies.getItem("voter_device_id");

const routes = () =>
  <Route path="/" component={Application}>
    <Route component={Intro} />
    { firstVisit ?
      <IndexRedirect to="intro" /> :
      <IndexRedirect to="ballot" /> }

    <Route path="/intro" component={Intro}>
      <Route path="/intro/contests" component={IntroContests} />
      <Route path="/intro/opinions" component={IntroOpinions} />
      <Route path="/intro/story" component={IntroStory} />
      <Route path="/intro/sample_ballot" component={SampleBallot} />
    </Route>

    {/* Settings go in this structure... */}
    <Route path="/settings" component={SettingsDashboard}>
      <IndexRoute component={Settings} />
      <Route path="/settings/claim" component={ClaimYourPage} />
      <Route path="/settings/location" component={Location} />  /* Complete path on one line for searching */
    </Route>

    {/* Ballot Off-shoot Pages */}
    <Route path="/opinions" component={Opinions} />
    <Route path="/opinions_followed" component={OpinionsFollowed} />
    <Route path="/friends" >
      <IndexRoute component={Friends} />
      <Route path="add" component={Connect} />
      <Route path="remove" />
    </Route>

    {/* More Menu Pages */}
    <Route path="/more/sign_in" component={SignIn} />
    <Route path="/more/email_ballot" component={EmailBallot} />
    <Route path="/more/credits" component={Credits} />
    <Route path="/more/about" component={About} />
    <Route path="/more/faq" component={FAQ} />
    <Route path="/more/connect" component={Connect} />
    <Route path="/more/privacy" component={Privacy} />
    <Route path="/more/terms" component={TermsOfService} />

    {/* Voter Guide Pages */}
    <Route path="/voterguide/:organization_we_vote_id" component={GuidePositionList} />
    <Route path="/yourpage" component={YourPage} />

    <Route path="ballot" component={BallotIndex}>
      <IndexRoute component={Ballot}/>
      <Route path="/office/:office_we_vote_id" component={Office} />
      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
      <Route path="/measure/:measure_we_vote_id" component={Measure} />
    </Route>

    <Route path="bookmarks" component={Bookmarks} />

    <Route path="ballot/empty" component={EmptyBallot} />

    <Route path="requests" component={Requests} />
    <Route path="requests/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
    <Route path="requests/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />

    <Route path="activity" component={Activity} />

    <Route path="/facebook_sign_in" component={FacebookSignInProcess} />

    <Route path="/twittersigninprocess/:sign_in_step/:incoming_twitter_handle" component={TwitterSignInProcessOld} />
    <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcessOld} />
    <Route path="/twitter_sign_in" component={TwitterSignInProcess} />

    <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
    <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />

    {/* Confirming that person owns twitter handle */}
    <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />

    {/* Any route that is not found -> @return NotFound component */}
    <Route path=":twitter_handle" component={NotFound} />
  </Route>;


export default routes;
