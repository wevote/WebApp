
export default function superSharingSuggestedEmailText (campaignTitle, politicianListSentenceString) {
  // We require a message
  let suggestedMessage;
  if (campaignTitle) {
    suggestedMessage = `Hello friends, I'm supporting ${campaignTitle}. Join me!`;
  } else {
    suggestedMessage = 'Hello friends, join me in supporting this campaign!';
  }
  suggestedMessage += '\n\n';
  if (politicianListSentenceString) {
    suggestedMessage += `This campaign isn't asking us for money, only asking us to plan to vote for${politicianListSentenceString}. `;
  } else {
    suggestedMessage += "This campaign isn't asking for money, only asking us to plan to vote for the candidate(s). ";
  }
  suggestedMessage += "Our email addresses are kept private, and you don't have to share your support publicly. ";
  suggestedMessage += '\n\n';
  suggestedMessage += "Click 'View Now' to see the campaign, and see if you want to support it. Thank you!";

  // We require a subject
  let suggestedSubject;
  if (politicianListSentenceString) {
    suggestedSubject = `I'm supporting${politicianListSentenceString}`;
  } else if (campaignTitle) {
    suggestedSubject = `I'm supporting ${campaignTitle}`;
  } else {
    suggestedSubject = "I'm supporting this campaign";
  }
  return {
    suggestedMessage,
    suggestedSubject,
  };
}
