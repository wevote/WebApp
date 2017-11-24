import React from "react";
import { Route, IndexRoute, IndexRedirect } from "react-router";
import cookies from "./utils/cookies";
import Application from "./Application";
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
import Elections from "./routes/More/Elections";
import EmailBallot from "./routes/More/EmailBallot";
import EmptyBallot from "./routes/Ballot/EmptyBallot";
import FacebookSignInProcess from "./routes/Process/FacebookSignInProcess";
import FAQ from "./routes/More/FAQ";
import FacebookInvitableFriends from "./routes/FacebookInvitableFriends";
import Friends from "./routes/Friends";
import GetStarted from "./routes/Intro/GetStarted";
import OrganizationVoterGuide from "./routes/VoterGuide/OrganizationVoterGuide";
import OrganizationVoterGuideEdit from "./routes/VoterGuide/OrganizationVoterGuideEdit";
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
import Office from "./routes/Ballot/Office";
import Opinions from "./routes/Opinions";
import OpinionsFollowed from "./routes/OpinionsFollowed";
import OpinionsIgnored from "./routes/OpinionsIgnored";
import Organization from "./routes/More/Organization";
import Privacy from "./routes/More/Privacy";
import ProcessingDonation from "./routes/More/ProcessingDonation";
import SampleBallot from "./routes/Intro/SampleBallot";
import ScratchPad from "./routes/ScratchPad";
import Settings from "./routes/Settings/Settings";
import SettingsDashboard from "./routes/Settings/SettingsDashboard";
import SignIn from "./routes/SignIn/SignIn";
import FacebookLandingProcess from "./routes/Process/FacebookLandingProcess";
import FacebookRedirectToWeVote from "./routes/More/FacebookRedirectToWeVote";
import SignInEmailProcess from "./routes/Process/SignInEmailProcess";
import Team from "./routes/More/Team";
import TermsOfService from "./routes/More/TermsOfService";
import ToolsToShareOnOtherWebsites from "./routes/More/ToolsToShareOnOtherWebsites";
import TwitterHandleLanding from "./routes/TwitterHandleLanding";
import TwitterSignInProcess from "./routes/Process/TwitterSignInProcess";
import TwitterSignInProcessOld from "./routes/Process/TwitterSignInProcessOld";
import VerifyEmailProcess from "./routes/Process/VerifyEmailProcess";
import FriendInvitationByEmailVerifyProcess from "./routes/Process/FriendInvitationByEmailVerifyProcess";
import VoterGuideGetStarted from "./routes/VoterGuide/VoterGuideGetStarted";
import VerifyThisIsMe from "./routes/VoterGuide/VerifyThisIsMe";
import Vision from "./routes/More/Vision";
import Welcome from "./routes/Welcome";
import YourPage from "./routes/YourPage";


// See /js/components/Navigation/HeaderBar.jsx for show_full_navigation cookie
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
      <Route path="/ballot?wait_until_voter_sign_in_completes=:wait_until_voter_sign_in_completes" component={Ballot} />
      <Route path="/office/:office_we_vote_id" component={Office} />
      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
      <Route path="/measure/:measure_we_vote_id" component={Measure} />
    </Route>
    <Route path="/ballot/empty" component={EmptyBallot} />
    <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
    <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
    <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />

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
    <Route path="/more/elections" component={Elections} />
    <Route path="/more/email_ballot" component={EmailBallot} />
    <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
    <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
    <Route path="/more/faq" component={FAQ} />
    <Route path="/more/howtouse" component={HowToUse} />
    <Route path="/more/network" component={Network} />
    <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
    <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
    <Route path="/more/network/:edit_mode" component={Network} />
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
    <Route path="/voterguide/:organization_we_vote_id/followers" component={props => <OrganizationVoterGuide {...props} active_route="followers" />} />
    <Route path="/voterguide/:organization_we_vote_id/following" component={props => <OrganizationVoterGuide {...props} active_route="following" />} />
    <Route path="/voterguide/:organization_we_vote_id/positions" component={props => <OrganizationVoterGuide {...props} active_route="positions" />} />
    <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
    <Route path="/voterguideedit/:organization_we_vote_id" component={OrganizationVoterGuideEdit} />
    <Route path="/voterguideedit/:organization_we_vote_id/:edit_mode" component={OrganizationVoterGuideEdit} />
    <Route path="/voterguideedit/:organization_we_vote_id/:edit_mode/:active_tab" component={OrganizationVoterGuideEdit} />

    <Route path="/voterguidegetstarted" component={VoterGuideGetStarted} />
    <Route path="/yourpage" component={YourPage} />

    <Route path="/facebook_sign_in" component={FacebookSignInProcess} />

    <Route path="/twittersigninprocess/:sign_in_step/:incoming_twitter_handle" component={TwitterSignInProcessOld} />
    <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcessOld} />
    <Route path="/twitter_sign_in" component={TwitterSignInProcess} />

    <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
    <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />

    {/* Confirming that person owns twitter handle */}
    <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />

    {/* Temporary scratchpad for component testing */}
    <Route path="/testing/scratchpad" component={ScratchPad} />

    {/*
    <Route path=":twitter_handle/ballot/empty" component={EmptyBallot} />
    <Route path=":twitter_handle/ballot/:ballot_location_shortcut" component={Ballot} />
    <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
    <Route path=":twitter_handle/ballot/election/:google_civic_election_id" component={Ballot} />
    */}

    {/* Any route that is not found -> @return TwitterHandleLanding component */}
    <Route path=":twitter_handle" component={TwitterHandleLanding} />
    <Route path=":twitter_handle/followers" component={props => <TwitterHandleLanding {...props} active_route="followers" />} />
    <Route path=":twitter_handle/following" component={props => <TwitterHandleLanding {...props} active_route="following" />} />
    <Route path=":twitter_handle/positions" component={props => <TwitterHandleLanding {...props} active_route="positions" />} />
    <Route path=":twitter_handle/:action_variable" component={TwitterHandleLanding} />

  </Route>;


export default routes;
