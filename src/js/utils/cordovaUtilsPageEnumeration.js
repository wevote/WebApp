import CordovaPageConstants from '../constants/CordovaPageConstants';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs'; // eslint-disable-line import/no-cycle
import { stringContains } from './textFormat';


// eslint-disable-next-line import/prefer-default-export
export function pageEnumeration () {
  const { href } = window.location;
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  // second level paths must be tried first
  if (href.indexOf('/index.html#/ballot/vote') > 0) {
    return CordovaPageConstants.ballotVote;
  } else if (href.indexOf('/index.html#/more/about') > 0) {
    return CordovaPageConstants.moreAbout;
  } else if (href.indexOf('/index.html#/more/privacy') > 0 ||
             href.indexOf('/index.html#/more/terms') > 0) {
    return CordovaPageConstants.moreTerms;
  } else if (href.indexOf('/index.html#/settings/account') > 0) {
    return CordovaPageConstants.settingsAccount;
  } else if (href.indexOf('/index.html#/settings/hamburger') > 0) {
    return CordovaPageConstants.settingsHamburger;
  } else if (href.indexOf('/index.html#/settings/tools') > 0) {
    return CordovaPageConstants.moreTools;
  } else if (href.indexOf('/index.html#/settings/notifications') > 0) {
    return CordovaPageConstants.settingsNotifications;
  } else if (href.indexOf('/index.html#/settings/subscription') > 0) {
    return CordovaPageConstants.settingsSubscription;
  } else if (href.indexOf('/index.html#/settings/voterguidelist') > 0) {
    return CordovaPageConstants.settingsVoterGuideLst;
  } else if (href.indexOf('/index.html#/ready') > 0) {
    return CordovaPageConstants.ready;
  } else if (href.indexOf('/index.html#/values/list') > 0) {
    return CordovaPageConstants.valuesList;

  // then wildcarded second level paths
  } else if (href.indexOf('/index.html#/candidate/') > 0) {
    return CordovaPageConstants.candidateWild;
  } else if (href.indexOf('/index.html#/office/') > 0) {
    return CordovaPageConstants.officeWild;
  } else if (href.indexOf('/index.html#/settings/') > 0 ||
             stringContains('facebook_sign_in', href)) {
    return CordovaPageConstants.settingsWild;
  } else if (href.indexOf('/index.html#/value/') > 0) {
    return CordovaPageConstants.valueWild;
  } else if (href.indexOf('/index.html#/vg/') > 0) {
    return CordovaPageConstants.voterGuideCreatorWild;
  } else if (stringContains('/index.html#/voterguide/') && (
    stringContains('btcand', href) ||
    stringContains('btmeas', href) ||
    stringContains('/btdb', href))) {
    return CordovaPageConstants.voterGuideWild;
  } else if (href.indexOf('/index.html#/wevoteintro/') > 0) {
    return CordovaPageConstants.wevoteintroWild;
  } else if (href.indexOf('/index.html#/ballot') > 0) {
    if (showBallotDecisionsTabs()) {
      return CordovaPageConstants.ballotLgHdrWild;
    } else {
      return CordovaPageConstants.ballotSmHdrWild;
    }
  } else if (href.indexOf('/index.html#/measure/') > 0) {
    return CordovaPageConstants.measureWild;
  } else if (href.indexOf('/showPublicFiguresFilter') > 0 ||  // /opinions/f/showPublicFiguresFilter
             href.indexOf('/showOrganizationsFilter') > 0) {  // /opinions/f/showOrganizationsFilter
    return CordovaPageConstants.opinionsPubFigs;

  // then specific first level paths
  } if (href.indexOf('/index.html#/candidate') > 0) {
    return CordovaPageConstants.candidate;
  } else if (href.indexOf('/index.html#/friends') > 0) {
    return CordovaPageConstants.friends;
  } else if (href.indexOf('/index.html#/opinions') > 0) {
    return CordovaPageConstants.opinions;
  } else if (href.indexOf('/index.html#/ready') > 0) {
    return CordovaPageConstants.values; // Use /value setting
  } else if (href.indexOf('/index.html#/values') > 0) {
    return CordovaPageConstants.values;
  } else if (href.indexOf('/index.html#/welcome') > 0 ||
             href.indexOf('/index.html#/for-organizations') > 0 ||
             href.indexOf('/index.html#/for-campaigns') > 0 ||
             href.indexOf('/index.html#/more/pricing') > 0 ||
             href.indexOf('/index.html#/how') > 0) {
    return CordovaPageConstants.welcomeWild;
  } else if (href.indexOf('/index.html#/twitter_sign_in') > 0) {
    return CordovaPageConstants.twitterSignIn;
  } else if (href.indexOf('/index.html#/news') > 0) {
    return CordovaPageConstants.news;
  } else if (href.indexOf('/m/followers') > 0 || href.indexOf('/m/friends') > 0 || href.indexOf('/m/following') > 0) {
    return CordovaPageConstants.twitterIdMFollowers;
  } else if (stringContains('/index.html#/', href) && (
    stringContains('btcand', href) ||
    stringContains('btmeas', href) ||
    stringContains('/btdb', href))) {
    return CordovaPageConstants.twitterInfoPage;
  }
  return CordovaPageConstants.defaultVal;
}
