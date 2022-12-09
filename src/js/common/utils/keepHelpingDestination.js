
export default function keepHelpingDestination (step2Completed = false, payToPromoteStepCompleted = false, payToPromoteStepTurnedOn = false, sharingStepCompleted = false, finalElectionDateInPast = false) {
  if (finalElectionDateInPast) {
    return 'share-campaign';
  } else if (!step2Completed) {
    return 'why-do-you-support';
  } else if (payToPromoteStepTurnedOn && !payToPromoteStepCompleted) {
    return 'pay-to-promote';
  } else if (!sharingStepCompleted) {
    return 'share-campaign';
  } else {
    return 'share-campaign';
  }
}
