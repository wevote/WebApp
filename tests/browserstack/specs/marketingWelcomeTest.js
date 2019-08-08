const assert = require('assert');
const { clearTextInputValue, scrollThroughPage, simpleClick, simpleTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;


async function simpleCloseBootstrapModal () {
  const clickableSelector = 'button[id="profileClosePollingPlaceLocatorModal"]';
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    // const isCordova = !!driver.getContexts;
    const isCordova = true; // Set to True when testing APK or IPA files, and false when testing in mobile browser
    const isMobile = !!driver.getContexts;
    const isDesktop = !isMobile;

    // NOTE FROM Dale: This is commented out so we can test We Vote in a mobile browser
    // I would be curious to see what is in driver.getContexts
    // navigate browser to WeVote QA site
    await browser.url('https://quality.wevote.us/welcome');

    // How it Works
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForVoters'); // Open For Voters Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForOrganizations'); // Open For Organizations Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForCampaigns'); // Open For Campaigns Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkForPricing'); // Open Pricing Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Elections
    await simpleClick('footerLinkSupportedElections'); // Open Supported Elections Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkRegisterToVote'); // Open Register to Vote Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    await simpleClick('logoHeaderBar'); // Open Register to Vote Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkGetYourAbsenteeBallot'); // Open Get Your Absentee Ballot Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Register to Vote Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage();
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkSeeYourBallot'); // Open See Your Ballot Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await simpleClick('footerLinkPollingPlaceLocator'); // Open Polling Place Locator Page
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await simpleCloseBootstrapModal(); // Close Bootstrap Modal
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkFreeOnlineTools'); // Open Free Online Tools Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkPremiumOnlineTools'); // Open Premium Online Tools Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);

=======
    // await scrollThroughPage(); // Scroll to the bottom of the Page // after scrolling page doesnt go back
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkGetYourAbsenteeBallot'); // Open Get Your Absentee Ballot Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
=======
    // await scrollThroughPage(); // Scroll to the bottom of the Page // after scrolling page doesnt go back
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkGetYourAbsenteeBallot'); // Open Get Your Absentee Ballot Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
>>>>>>> Stashed changes
    // await scrollThroughPage(); // Scroll to the bottom of the Page // abstentee page is not working with scroll
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkSeeYourBallot'); // Open See Your Ballot Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await scrollThroughPage(); // Scroll to the bottom of the Page // not able to scroll up
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkPollingPlaceLocator'); // Open Polling Place Locator Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await scrollThroughPage(); // Scroll to the bottom of the Page // not able to scroll 
    await simpleCloseBootstrapModal(); // Close Bootstrap Modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkFreeOnlineTools'); // Open Free Online Tools Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkPremiumOnlineTools'); // Open Premium Online Tools Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    // About We Vote
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkAbout'); // Open About & Team Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkDonate'); // Open Donate Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkBlog'); // Open Blog Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://blog.wevote.us/');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkMediaInquiries'); // Open Media Inquiries Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://help.wevote.us/hc/en-us/requests/new'); // Switch to  Media Inquiries Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkCareers'); // Open Careers Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops'); //Switch to Careers Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkPrivacy'); // Go to  Privacy tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkJoinOurNewsletter'); // Open Join Our Newsletter Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //await browser.switchWindow('https://us8.list-manage.com/subscribe?u=29bec99e46ac46abe32781925&id=5e052cb629'); //Switch to Join Our Newsletter Page in new window
    // await browser.closeWindow(); // window is not closing
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkFacebook'); // Open Facebook Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://www.facebook.com/WeVoteUSA/'); // Switch to Join Our Newsletter Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkTwitter'); // Open Twitter Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await scrollThroughPage(); // Scroll to the bottom of the Page

    // Support
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkWeVoteHelp'); // Go to  We Vote Help tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkPrivacy'); // Go to  Privacy tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    await simpleClick('footerLinkDonate'); // Open Donate Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    await simpleClick('logoHeaderBar');  
    await browser.pause(PAUSE_DURATION_MICROSECONDS);    
    await simpleClick('footerLinkBlog'); // Open Blog Page in new window
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.switchWindow('https://blog.wevote.us/');
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkTermsOfUse'); // Go to Terms of Use tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('footerLinkAttributions'); // Go to  Attributions tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await scrollThroughPage(); // Scroll to the bottom of the Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('footerLinkPremiumOnlineTools'); // Open Premium Online Tools Page
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   

    // // About We Vote
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await simpleClick('footerLinkAbout'); // Open About & Team Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await simpleClick('footerLinkDonate'); // Open Donate Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);    
    // await simpleClick('footerLinkBlog'); // Open Blog Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://blog.wevote.us/');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkMediaInquiries'); // Open Media Inquiries Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://help.wevote.us/hc/en-us/requests/new'); // Switch to  Media Inquiries Page
<<<<<<< Updated upstream
=======
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
>>>>>>> Stashed changes
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkCareers'); // Open Careers Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops'); //Switch to Careers Page 
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // await simpleClick('footerLinkJoinOurNewsletter'); // Open Join Our Newsletter Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // // await browser.switchWindow('https://us8.list-manage.com/subscribe?u=29bec99e46ac46abe32781925&id=5e052cb629'); // Switch to Join Our Newsletter Page
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await simpleClick('.masthead'); 
    // // await browser.closeWindow();
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await browser.switchWindow('https://quality.wevote.us/welcome');  // switch back via url match
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkFacebook'); // Open Facebook Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // // await simpleClick('footerLinkTwitter'); // Open Twitter Page in new window
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await scrollThroughPage(); // Scroll to the bottom of the Page

    // Support
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkWeVoteHelp'); // Go to  We Vote Help tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // console.log(browser.getTitle('.logo'));
    // await browser.newWindow('https://quality.wevote.us/welcome');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkPrivacy'); // Go to  Privacy tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // console.log(browser.getTitle());
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // if (handles.length > 1) {
    // browser.switchToWindow(handles[1]);
    // browser.closeWindow();
    // browser.switchToWindow(handles[0]);
    // }
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // const allGUID = getWindowHandle();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await simpleClick('logoHeaderBar');  
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // browser.switchWindow('https://quality.wevote.us/welcome');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // browser.window('my tab');
    // browser.closeWindow();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // browser.switchToWindow('https://quality.wevote.us/welcome');
    
    // browser.switchToWindow(handles[0]);
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('footerLinkPrivacy'); // Go to  Privacy tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);    
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);  
    // await simpleClick('logoHeaderBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await simpleClick('footerLinkTermsOfUse'); // Go to Terms of Use tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS); 
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await simpleClick('footerLinkAttributions'); // Go to  Attributions tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await simpleClick('logoHeaderBar'); // Open Welcome Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);    
    await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    await simpleClick('footerLinkGetStarted'); // Go to  Get Started tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    await simpleClick('logoHeaderBar'); // Open Welcome Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await simpleClick('footerLinkContactSales'); // Go to Contact Sales tab
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);   
    // await scrollThroughPage(); // Scroll to the bottom of the Page
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);     
    // await simpleClick('footerLinkOpenSource'); // Go to  Open Source tab
    // await scrollThroughPage(); // Scroll to the bottom of the Page

    assert(true);
  });
});
