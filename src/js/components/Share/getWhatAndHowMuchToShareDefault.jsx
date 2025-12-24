import VoterStore from '../../stores/VoterStore';
import { getKindOfShareFromURL } from './getKindOfShareFromURL';

// eslint-disable-next-line import/prefer-default-export
export function getWhatAndHowMuchToShareDefault () {
  const kindOfShare = getKindOfShareFromURL();
  const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
  let whatAndHowMuchToShare;
  if (kindOfShare === 'CANDIDATE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'candidateShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'candidateShareOptions';
    }
  } else if (kindOfShare === 'MEASURE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'measureShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'measureShareOptions';
    }
  } else if (kindOfShare === 'OFFICE') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'officeShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'officeShareOptions';
    }
  } else if (kindOfShare === 'ORGANIZATION') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'organizationShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'organizationShareOptions';
    }
  } else if (kindOfShare === 'READY') {
    if (voterIsSignedIn) {
      whatAndHowMuchToShare = 'readyShareOptionsAllOpinions';
    } else {
      whatAndHowMuchToShare = 'readyShareOptions';
    }
    // Default to ballot
  } else if (voterIsSignedIn) {
    whatAndHowMuchToShare = 'ballotShareOptionsAllOpinions';
  } else {
    whatAndHowMuchToShare = 'ballotShareOptions';
  }
  return whatAndHowMuchToShare;
}
