import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function returnShareModalText (whatAndHowMuchToShare) {
  let allOpinionsRadioButtonText;
  let noOpinionsRadioButtonText;
  let allOpinionsRadioButtonDescription = "I want to include all the choices I've have made, my name and my profile photo.";
  let noOpinionsRadioButtonDescription = "I don't want to include any choices I've made, my name, nor my profile photo.";
  let shareModalDescription;
  let shareModalTitle;
  if (whatAndHowMuchToShare.startsWith('ballotShareOptions')) {
    allOpinionsRadioButtonText = 'Ballot with my choices';
    noOpinionsRadioButtonText = 'Ballot only';
    shareModalDescription = <>Share with your friends a link to this list of ballot choices to help them make their own choices.</>;
    shareModalTitle = 'Share ballot';
  } else if (whatAndHowMuchToShare.startsWith('candidateShareOptions')) {
    allOpinionsRadioButtonDescription = '';
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonDescription = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share candidate';
  } else if (whatAndHowMuchToShare.startsWith('measureShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share measure';
  } else if (whatAndHowMuchToShare.startsWith('officeShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share office';
  } else if (whatAndHowMuchToShare.startsWith('organizationShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share this page';
  } else if (whatAndHowMuchToShare.startsWith('readyShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share this page';
  } else {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share';
  }
  return {
    allOpinionsRadioButtonDescription,
    allOpinionsRadioButtonText,
    noOpinionsRadioButtonDescription,
    noOpinionsRadioButtonText,
    shareModalDescription,
    shareModalTitle,
  };
}
