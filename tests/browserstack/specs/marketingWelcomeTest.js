const assert = require('assert');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;

describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    if (isCordova) {
      // switch contexts and click through intro
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
     // await driver.switchContext('WEBVIEW_org.wevote.cordova');
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await firstNextButton.click();
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await secondNextButton.click();
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/');
         }
   

// Go to the For Voters tab
    const VotersButtonSelector = '#footerLinkForVoters' ;
    const VotersButton = await $(VotersButtonSelector);
    await VotersButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

// Go to the For Organizations tab
     const OrganizationsButtonSelector =  '#footerLinkForOrganizations' ;
     const OrganizationsButton =  await $(OrganizationsButtonSelector);
     await OrganizationsButton.click();
     await browser.pause(PAUSE_DURATION_MICROSECONDS);
          
// Go to the For Campaigns tab
      const CampaignsButtonSelector =  '#footerLinkForCampaigns' ;
      const CampaignsButton = await $(CampaignsButtonSelector);
      await CampaignsButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

 // Go to the Pricing tab
 const PricingButtonSelector = '#footerLinkForPricing' ;
 const PricingButton = await $(PricingButtonSelector);
 await PricingButton.click();
 await browser.pause(PAUSE_DURATION_MICROSECONDS);

//Elections
//Go to the Supported Elections tab
	const SupportedElectionsButtonSelector ='#footerLinkSupportedElections' ;
    const SupportedElectionsButton = await $(SupportedElectionsButtonSelector);
    await SupportedElectionsButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

   // Go to the Welcome tab
const WelcomeButtonSelector = '#logoHeaderBar' ;
const WelcomeButton = await $(WelcomeButtonSelector);
await WelcomeButton.click();
await browser.pause(PAUSE_DURATION_MICROSECONDS);

 // Go to the Register to Vote tab
	const RegistertoVoteButtonSelector =  '#footerLinkRegisterToVote' ;
    const RegistertoVoteButton = await $(RegistertoVoteButtonSelector);
    await RegistertoVoteButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Welcome tab
const weVotewelcomeButtonSelector = '#logoHeaderBar' ;
const weVotewelcomeButton = await $(weVotewelcomeButtonSelector);
await weVotewelcomeButton.click();
await browser.pause(PAUSE_DURATION_MICROSECONDS);
		
// Go to the Get Your Absentee Ballot tab
	const AbsenteeBallotButtonSelector =  '#footerLinkGetYourAbsenteeBallot' ;
    const AbsenteeBallotButton = await $(AbsenteeBallotButtonSelector);
    await AbsenteeBallotButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Welcome tab
const wComeButtonSelector = '#logoHeaderBar' ;
const wComeButton = await $(wComeButtonSelector);
await wComeButton.click();
await browser.pause(PAUSE_DURATION_MICROSECONDS);
		
// Go to the See Your Ballot tab
	const SeeurBallotButtonSelector = '#footerLinkSeeYourBallot' ;
    const SeeurBallotButton = await $(SeeurBallotButtonSelector);
    await SeeurBallotButton.click();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Go to the Welcome tab
const logoButtonSelector = '#logoHeaderBar' ;
const logoButton = await $(logoButtonSelector);
await logoButton.click();
await browser.pause(PAUSE_DURATION_MICROSECONDS);

// Go to the Polling Place Locator tab
	const pollingPlaceButtonSelector =  '#footerLinkPollingPlaceLocator' ;
    const pollingPlaceButton =  await $(pollingPlaceButtonSelector);
    await pollingPlaceButton.click();
    await browser.pause(PAUSE_DUR*ATION_MICROSECONDS);

//   // Go to the Welcome tab
// const welcomeLogoButtonSelector = '#logoHeaderBar' ;
// const welcomeLogoButton = await $(welcomeLogoButtonSelector);
// await welcomeLogoButton.click();
// await browser.pause(PAUSE_DURATION_MICROSECONDS);
		
// //Go to the Free Online Tools tab
// 	const onlineToolsButtonSelector = '#footerLinkFreeOnlineTools' ;
//     const onlineToolsButton =  await $(onlineToolsButtonSelector);
//     await onlineToolsButton.click();
//     await browser.pause(PAUSE_DURATION_MICROSECONDS);

//   //Go to the Welcome tab
// const welcomePageButtonSelector = '#logoHeaderBar' ;
// const welcomePageButton = await $(welcomePageButtonSelector);
// await welcomePageButton.click();
// await browser.pause(PAUSE_DURATION_MICROSECONDS);
	
//  //Go to the Premium Online Tools tab
// 	const POnlineToolsButtonSelector = '#footerLinkPremiumOnlineTools' ;
//     const POnlineToolsButton = await $(POnlineToolsButtonSelector);
//     await POnlineToolsButton.click();
//     await browser.pause(PAUSE_DURATION_MICROSECONDS);

//   //  Go to the Welcome tab
// const WelcomeButtonSelector = '#logoHeaderBar' ;
// const WelcomeButton = await $(WelcomeButtonSelector);
// await WelcomeButton.click();
// await browser.pause(PAUSE_DURATION_MICROSECONDS);

 assert(true);

  });
});
