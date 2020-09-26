import showBallotDecisionsTabs from './showBallotDecisionsTabs'; // eslint-disable-line import/no-cycle
import { stringContains } from '../utils/textFormat';


export const enums = {
  ballotVote: 1,
  settingsAccount: 2,
  moreAbout: 3,
  settingsHamburger: 4,
  settingsNotifications: 5,
  settingsSubscription: 6,
  settingsVoterGuideLst: 7,
  moreTools: 8,
  moreTerms: 9,
  valuesList: 10,
  officeWild: 100,
  settingsWild: 101,
  wevoteintroWild: 102,
  ballotSmHdrWild: 103,
  ballotLgHdrWild: 104,
  candidateWild: 105,
  measureWild: 106,
  valueWild: 107,
  voterGuideCreatorWild: 109,
  welcomeWild: 108,
  candidate: 200,
  friends: 201,
  opinions: 202,
  values: 203,
  voterGuideWild: 204,
  ready: 205,
  twitterSignIn: 206,
  news: 207,
  twitterIdMFollowers: 208,
  defaultVal: 1000,
};

export function pageEnumeration () {
  const { href } = window.location;
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  // second level paths must be tried first
  if (href.indexOf('/index.html#/ballot/vote') > 0) {
    return enums.ballotVote;
  } else if (href.indexOf('/index.html#/more/about') > 0) {
    return enums.moreAbout;
  } else if (href.indexOf('/index.html#/more/privacy') > 0 ||
             href.indexOf('/index.html#/more/terms') > 0) {
    return enums.moreTerms;
  } else if (href.indexOf('/index.html#/settings/account') > 0) {
    return enums.settingsAccount;
  } else if (href.indexOf('/index.html#/settings/hamburger') > 0) {
    return enums.settingsHamburger;
  } else if (href.indexOf('/index.html#/settings/tools') > 0) {
    return enums.moreTools;
  } else if (href.indexOf('/index.html#/settings/notifications') > 0) {
    return enums.settingsNotifications;
  } else if (href.indexOf('/index.html#/settings/subscription') > 0) {
    return enums.settingsSubscription;
  } else if (href.indexOf('/index.html#/settings/voterguidelist') > 0) {
    return enums.settingsVoterGuideLst;
  } else if (href.indexOf('/index.html#/ready') > 0) {
    return enums.ready;
  } else if (href.indexOf('/index.html#/values/list') > 0) {
    return enums.valuesList;

  // then wildcarded second level paths
  } else if (href.indexOf('/index.html#/candidate/') > 0) {
    return enums.candidateWild;
  } else if (href.indexOf('/index.html#/office/') > 0) {
    return enums.officeWild;
  } else if (href.indexOf('/index.html#/settings/') > 0 ||
             stringContains('facebook_sign_in', href)) {
    return enums.settingsWild;
  } else if (href.indexOf('/index.html#/value/') > 0) {
    return enums.valueWild;
  } else if (href.indexOf('/index.html#/vg/') > 0) {
    return enums.voterGuideCreatorWild;
  } else if (stringContains('btcand', href) ||
             stringContains('btmeas', href) ||
             stringContains('/btdb', href)) { // Added Sept 24, 2020 -- for iPadPro 9.1"
    return enums.voterGuideWild;
  } else if (href.indexOf('/index.html#/wevoteintro/') > 0) {
    return enums.wevoteintroWild;
  } else if (href.indexOf('/index.html#/ballot') > 0) {
    if (showBallotDecisionsTabs()) {
      return enums.ballotLgHdrWild;
    } else {
      return enums.ballotSmHdrWild;
    }
  } else if (href.indexOf('/index.html#/measure/') > 0) {
    return enums.measureWild;

  // then specific first level paths
  } if (href.indexOf('/index.html#/candidate') > 0) {
    return enums.candidate;
  } else if (href.indexOf('/index.html#/friends') > 0) {
    return enums.friends;
  } else if (href.indexOf('/index.html#/opinions') > 0) {
    return enums.opinions;
  } else if (href.indexOf('/index.html#/ready') > 0) {
    return enums.values; // Use /value setting
  } else if (href.indexOf('/index.html#/values') > 0) {
    return enums.values;
  } else if (href.indexOf('/index.html#/welcome') > 0 ||
             href.indexOf('/index.html#/for-organizations') > 0 ||
             href.indexOf('/index.html#/for-campaigns') > 0 ||
             href.indexOf('/index.html#/more/pricing') > 0 ||
             href.indexOf('/index.html#/how') > 0) {
    return enums.welcomeWild;
  } else if (href.indexOf('/index.html#/twitter_sign_in') > 0) {
    return enums.twitterSignIn;
  } else if (href.indexOf('/index.html#/news') > 0) {
    return enums.news;
  } else if (href.indexOf('/m/followers') > 0 || href.indexOf('/m/friends') > 0 || href.indexOf('/m/following') > 0) {
    return enums.twitterIdMFollowers;
  }
  return enums.defaultVal;
}
