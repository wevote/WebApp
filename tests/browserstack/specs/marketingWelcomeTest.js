const assert = require('assert');
describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    if (isCordova) {
      // switch contexts and click through intro
      await driver.switchContext('WEBVIEW_org.wevote.cordova');
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await firstNextButton.click();
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await secondNextButton.click();
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await browser.pause(1000);
      await thirdNextButton.click();
      await browser.pause(1000);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/Ballot');
    }

    
    // Go to the Welcome tab
	const OrganizationsButtonSelector = (isCordova) ? 'a[id="welcomePageLink"]' : 'id="footerLinkForOrganizations"' ;
    const OrganizationsButton =
      await $(OrganizationsButtonSelector);
    await OrganizationsButton.click();
    await browser.pause(1000);
    
	// Go to the For Organizations tab
	const OrganizationsButtonSelector = (isCordova) ? 'button[id="footerLinkForOrganizations"]' : 'id="footerLinkForOrganizations"' ;
    const OrganizationsButton =
      await $(OrganizationsButtonSelector);
    await OrganizationsButton.click();
    await browser.pause(1000);
    
    	
// Go to the For Campaigns tab
const CampaignsButtonSelector = (isCordova) ? 'button[id="footerLinkForCampaigns"]' : 'button[id="footerLinkForCampaigns"]' ;
const CampaignsButton =
  await $(CampaignsButtonSelector);
await CampaignsButton.click();
await browser.pause(1000);

// Go to the For Voters tab
const VotersButtonSelector = (isCordova) ? 'button[id="footerLinkForVoters"]' : 'button[id="footerLinkForVoters"]' ;
const VotersButton =
  await $(VotersButtonSelector);
await VotersButton.click();
await browser.pause(1000);
	 assert(true);
	
  });
});