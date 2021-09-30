import CordovaPageConstants from '../constants/CordovaPageConstants';
import AppObservableStore from '../stores/AppObservableStore';
import showBallotDecisionsTabs from '../utilsApi/showBallotDecisionsTabs';
import { normalizedHref } from './applicationUtils';
import { stringContains } from './textFormat';


// eslint-disable-next-line import/prefer-default-export
export function pageEnumeration () {
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  const path = normalizedHref();

  // second level paths must be tried first
  if (path.startsWith('/ballot/vote') > 0) {
    return CordovaPageConstants.ballotVote;
  } else if (path.startsWith('/more/about') > 0) {
    return CordovaPageConstants.moreAbout;
  } else if (path.startsWith('/more/privacy') > 0 ||
             path.startsWith('/more/terms') > 0) {
    return CordovaPageConstants.moreTerms;
  } else if (path.startsWith('/more/faq') > 0) {
    return CordovaPageConstants.moreFaq;
  } else if (path.startsWith('/settings/account') > 0) {
    return CordovaPageConstants.settingsAccount;
  } else if (path.startsWith('/settings/hamburger') > 0) {
    return CordovaPageConstants.settingsHamburger;
  } else if (path.startsWith('/settings/tools') > 0) {
    return CordovaPageConstants.moreTools;
  } else if (path.startsWith('/settings/notifications') > 0) {
    return CordovaPageConstants.settingsNotifications;
  } else if (path.startsWith('/settings/profile') > 0) {
    return CordovaPageConstants.settingsProfile;
  } else if (path.startsWith('/settings/share') > 0) {
    return CordovaPageConstants.settingsShare;
  } else if (path.startsWith('/settings/subscription') > 0) {
    return CordovaPageConstants.settingsSubscription;
  } else if (path.startsWith('/settings/voterguidelist') > 0) {
    return CordovaPageConstants.settingsVoterGuideLst;
  } else if (path.startsWith('/ready') > 0 || path === '/') {
    return CordovaPageConstants.ready;
  } else if (path.startsWith('/values/list') > 0) {
    return CordovaPageConstants.valuesList;

  // then wildcarded second level paths
  } else if (path.startsWith('/candidate/') > 0) {
    return CordovaPageConstants.candidateWild;
  } else if (path.startsWith('/office/') > 0) {
    return CordovaPageConstants.officeWild;
  } else if (path.startsWith('/settings/') > 0 || path.includes('facebook_sign_in')) {
    return CordovaPageConstants.settingsWild;
  } else if (path.startsWith('/value/') > 0) {
    return CordovaPageConstants.valueWild;
  } else if (path.startsWith('/vg/') > 0) {
    return CordovaPageConstants.voterGuideCreatorWild;
  } else if (stringContains('/voterguide/') && (
    path.includes('btcand') || path.includes('btmeas') || path.includes('/btdb'))) {
    return CordovaPageConstants.voterGuideWild;
  } else if (path.startsWith('/wevoteintro/') > 0) {
    return CordovaPageConstants.wevoteintroWild;
  } else if (path.startsWith('/ballot') > 0) {
    if (showBallotDecisionsTabs()) {
      return CordovaPageConstants.ballotLgHdrWild;
    } else {
      return CordovaPageConstants.ballotSmHdrWild;
    }
  } else if (path.startsWith('/measure/') > 0) {
    return CordovaPageConstants.measureWild;
  } else if (path.startsWith('/showPublicFiguresFilter') > 0 ||  // /opinions/f/showPublicFiguresFilter
             path.startsWith('/showOrganizationsFilter') > 0) {  // /opinions/f/showOrganizationsFilter
    return CordovaPageConstants.opinionsPubFigs;

  // then specific first level paths
  } if (path.startsWith('/candidate') > 0) {
    return CordovaPageConstants.candidate;
  } else if (path.startsWith('/friends/current') > 0) {
    return CordovaPageConstants.friendsCurrent;
  } else if (path.startsWith('/friends/sent-requests') > 0) {
    return CordovaPageConstants.friendsSentRequest;
  } else if (path.startsWith('/friends') > 0) {
    return CordovaPageConstants.friends;
  } else if (path.startsWith('/opinions') > 0) {
    return CordovaPageConstants.opinions;
  } else if (path.startsWith('/ready') > 0) {
    return CordovaPageConstants.values; // Use /value setting
  } else if (path.startsWith('/values') > 0) {
    return CordovaPageConstants.values;
  } else if (path.startsWith('/welcome') > 0 ||
             path.startsWith('/for-organizations') > 0 ||
             path.startsWith('/for-campaigns') > 0 ||
             path.startsWith('/more/pricing') > 0 ||
             path.startsWith('/how') > 0) {
    return CordovaPageConstants.welcomeWild;
  } else if (path.startsWith('/twitter_sign_in') > 0) {
    return CordovaPageConstants.twitterSignIn;
  } else if (path.startsWith('/news') > 0) {
    return CordovaPageConstants.news;
  } else if (path.startsWith('/m/followers') > 0 || path.startsWith('/m/friends') > 0 || path.startsWith('/m/following') > 0) {
    return CordovaPageConstants.twitterIdMFollowers;
  } else if (path.includes('/') && (
    path.includes('btcand') || path.includes('btmeas') || path.includes('/btdb'))) {
    return CordovaPageConstants.twitterInfoPage;
  } else if (AppObservableStore.getShowTwitterLandingPage()) {
    return CordovaPageConstants.twitterHandleLanding;
  }
  return CordovaPageConstants.defaultVal;
}
