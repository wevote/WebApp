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
import Donate from "./routes/More/Donate";
import DonateThankYou from "./routes/More/DonateThankYou";
import EmailBallot from "./routes/More/EmailBallot";
import EmptyBallot from "./routes/Ballot/EmptyBallot";
import FacebookSignInProcess from "./routes/Process/FacebookSignInProcess";
import FAQ from "./routes/More/FAQ";
import FacebookInvitableFriends from "./routes/FacebookInvitableFriends";
import Friends from "./routes/Friends";
import GetStarted from "./routes/Intro/GetStarted";
import OrganizationVoterGuide from "./routes/Guide/OrganizationVoterGuide";
import OrganizationVoterGuideEdit from "./routes/Guide/OrganizationVoterGuideEdit";
import HowToUse from "./routes/More/HowToUse";
import Intro from "./routes/Intro/Intro";
import IntroContests from "./routes/Intro/IntroContests";
import IntroOpinions from "./routes/Intro/IntroOpinions";
import IntroStory from "./routes/Intro/IntroStory";
import IssuesToFollow from "./routes/IssuesToFollow";
import IssuesFollowed from "./routes/IssuesFollowed";
import InviteByEmail from "./routes/Friends/InviteByEmail";
import Location from "./routes/Settings/Location";
import Measure from "./routes/Ballot/Measure";
import Network from "./routes/Network";
import NotFound from "./routes/NotFound";
import Office from "./routes/Ballot/Office";
import Opinions from "./routes/Opinions";
import OpinionsFollowed from "./routes/OpinionsFollowed";
import OpinionsIgnored from "./routes/OpinionsIgnored";
import Organization from "./routes/More/Organization";
import Privacy from "./routes/More/Privacy";
import ProcessingDonation from "./routes/More/ProcessingDonation";
import SampleBallot from "./routes/Intro/SampleBallot";
import Settings from "./routes/Settings/Settings";
import SettingsDashboard from "./routes/Settings/SettingsDashboard";
import SignIn from "./routes/More/SignIn";
import FacebookLandingProcess from "./routes/Process/FacebookLandingProcess";
import FacebookRedirectToWeVote from "./routes/More/FacebookRedirectToWeVote";
import SignInEmailProcess from "./routes/Process/SignInEmailProcess";
import Team from "./routes/More/Team";
import TermsOfService from "./routes/More/TermsOfService";
import ToolsToShareOnOtherWebsites from "./routes/More/ToolsToShareOnOtherWebsites";
import TwitterSignInProcess from "./routes/Process/TwitterSignInProcess";
import TwitterSignInProcessOld from "./routes/Process/TwitterSignInProcessOld";
import VerifyEmailProcess from "./routes/Process/VerifyEmailProcess";
import FriendInvitationByEmailVerifyProcess from "./routes/Process/FriendInvitationByEmailVerifyProcess";
import VoterGuideFollowing from "./components/VoterGuide/VoterGuideFollowing";
import VerifyThisIsMe from "./routes/Guide/VerifyThisIsMe";
import Vision from "./routes/More/Vision";
import Welcome from "./routes/Welcome";
import YourPage from "./routes/YourPage";

// See /js/components/Navigation/HeaderBar.jsx for voter_orientation_complete cookie
const firstVisit = !cookies.getItem("voter_device_id");

const routes = () =>
  <Route path="/" component={Application}>
    <Route component={Intro} />
    { firstVisit ?
      <IndexRedirect to="/welcome" /> :
      <IndexRedirect to="/welcome" /> }
    <Route path="/welcome" component={Welcome} />
    <Route path="/activity" component={Activity} />
    <Route path="/ballot" component={BallotIndex}>
      <IndexRoute component={Ballot}/>
      <Route path="/office/:office_we_vote_id" component={Office} />
      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
      <Route path="/measure/:measure_we_vote_id" component={Measure} />
    </Route>
    <Route path="/ballot/empty" component={EmptyBallot} />

    <Route path="bookmarks" component={Bookmarks} />

    <Route path="/intro" component={Intro} />
    <Route path="/intro/contests" component={IntroContests} />
    <Route path="/intro/opinions" component={IntroOpinions} />
    <Route path="/intro/story" component={IntroStory} />
    <Route path="/intro/sample_ballot" component={SampleBallot} />
    <Route path="/intro/get_started" component={GetStarted} />

    {/* Settings go in this structure... */}
    <Route path="/settings" component={SettingsDashboard}>
      <IndexRoute component={Settings} />
      <Route path="/settings/claim" component={ClaimYourPage} />
      <Route path="/settings/location" component={Location} />  /* Complete path on one line for searching */
    </Route>

    {/* Ballot Off-shoot Pages */}
    <Route path="/opinions" component={Opinions} />
    <Route path="/opinions_followed" component={OpinionsFollowed} />
    <Route path="/opinions_ignored" component={OpinionsIgnored} />
    <Route path="/issues_to_follow" component={IssuesToFollow} />
    <Route path="/issues_followed" component={IssuesFollowed} />

    {/* Friend related Pages */}
    <Route path="/friends" >
      <IndexRoute component={Friends} />
      <Route path="add" component={Connect} />
      <Route path="remove" />
    </Route>
    <Route path="/friends/invitebyemail" component={InviteByEmail} />
    <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />

    {/* More Menu Pages */}
    <Route path="/more/about" component={About} />
    <Route path="/more/connect" component={Connect} />
    <Route path="/more/credits" component={Credits} />
    <Route path="/more/donate" component={Donate} />
    <Route path="/more/donate_thank_you" component={DonateThankYou} />
    <Route path="/more/email_ballot" component={EmailBallot} />
    <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
    <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
    <Route path="/more/faq" component={FAQ} />
    <Route path="/more/howtouse" component={HowToUse} />
    <Route path="/more/network" component={Network} />
    <Route path="/more/network/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
    <Route path="/more/network/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
    <Route path="/more/organization" component={Organization} />
    <Route path="/more/privacy" component={Privacy} />
    <Route path="/more/processing_donation" component={ProcessingDonation} />
    <Route path="/more/sign_in" component={SignIn} />
    <Route path="/more/team" component={Team} />
    <Route path="/more/tools" component={ToolsToShareOnOtherWebsites} />
    <Route path="/more/terms" component={TermsOfService} />
    <Route path="/more/vision" component={Vision} />

    {/* Voter Guide Pages */}
    <Route path="/voterguide/:organization_we_vote_id" component={OrganizationVoterGuide} />
    <Route path="/voterguideedit/:organization_we_vote_id" component={OrganizationVoterGuideEdit} />
    <Route path="/voterguideedit/:organization_we_vote_id/:edit_mode" component={OrganizationVoterGuideEdit} />

    <Route path="/yourpage" component={YourPage} />

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
    <Route path=":twitter_handle/following" component={VoterGuideFollowing} />

  </Route>;


export default routes;
