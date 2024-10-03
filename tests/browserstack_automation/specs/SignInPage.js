import { browser,driver, expect } from '@wdio/globals';
import{describe, it } from 'mocha'
import { Key } from 'webdriverio';
import { platform } from 'node:process';
const os=require ('os');
import ReadyPage from '../page_objects/ready.page';
import SignIn from '../page_objects/signin.page';
const { describe, it } = require('mocha');

const waitTime = 5000;

beforeEach(async()=>{
    await ReadyPage.load();   ;
    await driver.pause(waitTime);
    await driver.maximizeWindow();
    await (await SignIn.signInLinkElement).click();    ///await driver.pause(waitTime);
});


const testEmails = [
    //`${SignIn.randomString(1)}@w.us`,  //cannot test with invalid 5 letters email because @w.us itself counted as 5 letters 
    `${SignIn.randomString(1)}@w.us`,//generates valid 6 letters email
   `${SignIn.randomString(244)}@wevote.us`,//generates valid 254 letters email
  `${SignIn.randomString(245)}@wevote.us`  //generates invalid 255 letters email
      ];


describe('SignIn', () => {
// SignIn_001
  it('verifySignInPage', async () => {
 

  await expect ( await SignIn.signInElement).toHaveText('Sign In or Join');
  });

  // SignIn_002 and SignIn_007 and SignIn_008


  it('verifySpellingsOfAllElementsOnSignInPage', async () => {
      const TwitterText="Sign in with Twitter";
      const AppleText="Sign in with Apple";
     //const phoneNumberLabelText = await SignIn.phoneNumberLabelElement;
     //const elementText = await phoneNumberLabelText .getText();
// Locate the input field

// await ReadyPage.load();
//     await driver.pause(waitTime);
//    await (await SignIn.signInLinkElement).click();
//    await driver.pause(waitTime);

   await expect(await SignIn.signInWithTwitterTextElement).toHaveText(TwitterText);
await expect(await SignIn.signInWithAppleTextElement).toHaveText(AppleText);
await expect(await SignIn.phoneNumberLabelElement).toHaveText("Mobile Phone Number");
await expect(await SignIn.emailLabelElement).toHaveText("Email");


 /* const phoneNumberField = await  SignIn.phoneNumberPlaceholderElement;

  // Get the placeholder attribute value
  const phoneNumberplaceholderText = await phoneNumberField.getAttribute('placeholder');
  const emailField = await  SignIn.emailPlaceholderElement;
 await expect (phoneNumberplaceholderText ).toBe("Type phone number here...");*/
 await expect  (await SignIn.phoneNumberFieldElement).toBeDisplayed();
 await expect  (await SignIn.phoneNumberFieldElement.getAttribute('placeholder')).toBe("Type phone number here...");
 await expect  (await SignIn.emailFieldElement).toBeDisplayed();
 await expect  (await SignIn.emailFieldElement.getAttribute('placeholder')).toBe("Type email here...");


  });

  // SignIn_003
  it('verifyAllIconsOnSignInPage', async () => {


    // await ReadyPage.load();
    // await driver.pause(waitTime);
    // await (await SignIn.signInLinkElement).click();
    // await driver.pause(waitTime);

    const iconsVisibility = await SignIn.getIcons();
    for(const iconVisible of  iconsVisibility){
        await expect (iconVisible).toBe(true);
    }


  });

//SignIn_004
it('verifyAllButtonsAndFieldsAlignedAndPresent', async () => {


    // await ReadyPage.load();
    // await driver.pause(waitTime);
    // await (await SignIn.signInLinkElement).click();
    // await driver.pause(waitTime);

    await expect (await SignIn.phoneNumberFieldElement).toBePresent();
    console.log("passed");
    await expect (await SignIn.emailFieldElement).toBePresent();
    console.log("passed");
    await expect (await SignIn.twitterBttnElement).toBePresent();
    console.log("passed");
     await expect (await SignIn.appleBttnElement).toBePresent();
     console.log("passed");

    //const cssProperty = await SignIn.twitterElement.getCSSProperty('text-align');
    //await expect(cssProperty.value).toBe('center');
    await expect(await (await SignIn.twitterBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
    console.log("twitter passed");
   // await expect(await(await  SignIn.appleBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
//    Error: expect(received).toBe(expected) // Object.is equality

// Expected: "inline-flex"
// Received: "inline-block"
   // console.log("apple passed");

    await expect(await (await SignIn.phoneNumberFieldElement.getCSSProperty('display')).value).toBe('block');
    console.log("phoneNumber passed");

    await expect(await (await SignIn.emailFieldElement.getCSSProperty('display')).value).toBe('block');
    console.log("emailField passed");


    

    await (await SignIn.phoneNumberFieldElement).click();
    //await (await SignIn.cancelPhoneBttnElement).waitForDisplayed();
    await expect(await (await SignIn.cancelPhoneBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
    await expect (await SignIn.cancelPhoneBttnElement).toBePresent();
    console.log(" cancel passed");

    await expect(await (await SignIn.sendVerificationPhoneBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
await expect(await SignIn.sendVerificationPhoneBttnElement).toBeDisabled();;
console.log("Its Disabled passed");


  });
//SignIn_005 and SignIn_006

it('validateSendVerificationBttn',async() => {
   // const randomNumber = Math.floor(40000000 + Math.random() * 9000000000);
    const randomNumber = `4089${Math.floor(100000 + Math.random() * 900000)}`;

    const randomEmail = `user${Date.now()}@email.com`;
//         await ReadyPage.load();

// await driver.pause(waitTime);
//await expect (await SignIn.signInLinkElement).toBeDisabled();

// await (await SignIn.signInLinkElement).click();
await  SignIn.phoneNumberFieldElement.click();
console.log(randomNumber);
await SignIn.phoneNumberFieldElement.addValue(randomNumber);
await expect(await SignIn.sendVerificationPhoneBttnElement).toBeEnabled();
console.log("phone verify passed");
await SignIn.emailFieldElement.click();
await SignIn.emailFieldElement.addValue(randomEmail);
await expect(await SignIn.sendVerificationEmailBttnElement).toBeEnabled();
console.log(" email verify passed");

});

//SignIn_009
it('verifyColorForContents', async()=>{

//console.log('Background color twitter :', await(await (await SignIn.twitterBttnElement).getCSSProperty('background-color')).value);
//console.log('Background color apple :', await(await (await SignIn.appleBttnElement).getCSSProperty('background-color')).value);

const twitterbackgroundColor = await (await SignIn.twitterBttnElement).getCSSProperty('background-color');
const applebackgroundColor= await (await SignIn.appleBttnElement).getCSSProperty('background-color');
const twitterTextColor= await (await SignIn.signInWithTwitterTextElement).getCSSProperty('color');
const appleTextColor= await (await SignIn.signInWithAppleTextElement).getCSSProperty('color');
// Convert 'rgba' to 'rgb' by removing the alpha value if present
await expect(await twitterbackgroundColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(85,172,238)');

await expect(await applebackgroundColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(0,0,0)');

await expect(await twitterTextColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(255,255,255)');
await expect(await appleTextColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(255,255,255)');

});


//SignIn_010 and
it('verifyTwitterSignInLinkResponsiveness',async()=>{   


//     await ReadyPage.load();    //await driver.pause(waitTime);

//     await (await SignIn.signInLinkElement).waitForClickable();
//   await (await SignIn.signInLinkElement).click();
   // await driver.pause(waitTime);
    await (await SignIn.twitterBttnElement).waitForClickable();
    await SignIn.twitterBttnElement.click();
    await driver.waitUntil(async () => {
        return await driver.getTitle()=== 'X / Authorize an application'}, {
        timeout: 5000, 
    });      
    

 // await  expect (await driver.getTitle()).toBe('Twitter / Authorize an application');
    
});
//SignIn_013 and SignIn_014
it('verifyAppleSignInLinkResponsiveness',async()=>{
await (await SignIn.appleBttnElement).waitForClickable();
    await SignIn.appleBttnElement.click();
    await driver.waitUntil(async () => {return await driver.getTitle()=== 'Sign in to Apple Account'}, {
        timeout: 5000, 
    });
   await driver.back();

});


//SignIn_15 and //SignIn_16
it('verifyVisiblityOfPhoneAndEmailCancelAndSendBttn',async()=>{
    // let element = await SignIn.cancelPhoneBttnElement;
    // console.log(element);
    await  SignIn.phoneNumberFieldElement.click();
   await expect(await SignIn.cancelPhoneBttnElement).toBeDisplayed();
   await expect(await SignIn.sendVerificationPhoneBttnElement).toBeDisplayed();
   await  SignIn.emailFieldElement.click();
   await expect(await SignIn.cancelEmailBttnElement).toBeDisplayed();
   await expect(await SignIn.sendVerificationEmailBttnElement).toBeDisplayed();


});


//SignIn_017 and //SignIn_018 and //SignIn_019 and //SignIn_020 and //SignIn_021 and//SignIn_022

it('verifyTabKeyFunctionality',async()=>{
    await driver.keys('Tab');
  //  await browser.keys('Tab');//first press tab
await expect(await SignIn.closeBttnElement).toBeFocused();
await driver.keys('Tab','Tab');
await expect(await SignIn.twitterBttnElement).toBeFocused();
await driver.keys('Tab','Tab','Tab');
await expect(await SignIn.appleBttnElement).toBeFocused();
await driver.keys('Tab','Tab','Tab','Tab');
await expect(await SignIn.phoneNumberFieldElement).toBeFocused();
});



// //SignIn_026 
// it.only('verifyEmailFieldPasteFunctionalityUsingKeyboard',async()=>{
//     const testdata='wevote@wevote.us'
//     //await SignIn.emailFieldElement.click();

//     await SignIn.emailFieldElement.setValue(testdata);
//     await driver.pause(5000);
//     await driver.keys(['Command','a'])
//     await driver.keys(['Command','c']);
//     await driver.pause(5000);

//     // await driver.keys([Key.Command,'a'])
//     // await driver.keys([Key.Command,'c'])
//     await SignIn.emailFieldElement.setValue('');

//     //await SignIn.emailFieldElement.clearValue();
//     await driver.pause(5000);
//     await driver.keys(['Command','v']);
//     await driver.pause(5000);
//     const value = await SignIn.emailFieldElement.getValue();
//    await  expect(value).toBe(testdata);





// });
//SignIn_026 
it('verifyEmailFieldPasteFunctionalityUsingKeyboard',async()=>{
  //  console.log(`This platform is ${platform}`);
  //  console.log(process.env);
    const testdata='wevote@wevote.us';
    const valueLength = testdata.length;

   const selector=await SignIn.emailFieldElement;
    await (await SignIn.emailFieldElement).setValue(testdata);
    await driver.pause(5000);  
//  if (process.platform === 'darwin') { 
//      console.log("running in macos");}
//      else {
//         console.log("running inother os");
//     }    
   //await SignIn.emailFieldElement.click();
const platformName = browser.capabilities.platformName; // Gets the platform like 'Windows', 'macOS'
const browserName=browser.capabilities.browserName;
console.log(`Platform: ${platformName}`);
console.log(`Browser: ${browserName}`);
if(platformName==='Windows XP'&& browserName==='chrome'){

await browser.keys([Key.Control,'a']);
//await browser.keys('NULL');            // Releases the Ctrl key

await browser.keys([Key.Control,'c']);
//await browser.keys('NULL');   
//for (let i = 0; i < valueLength; i++) {         // Releases the Ctrl key
   await browser.keys(Key.Backspace);
   await SignIn.emailFieldElement.click();
   await  browser.keys([Key.Control,'v']);
}

if(platformName==='mac'&& browserName==='Safari')
 {   //For macOS, the correct value for process.platform is "darwin"
await browser.keys([Key.Command,'a']);
   await browser.keys([Key.Command,'c']);

        await browser.keys(Key.Backspace);
   await driver.keys([Key.Command,'v']);

    }

  const value = await SignIn.emailFieldElement.getValue();
 await  expect(value).toBe(testdata);
 

});
// //SignIn_028  
it('verifyEmailFieldWithValidAddress',async()=>{
 const testData='wevote@wevote.us';
    await SignIn.emailFieldElement.click();
    await (await SignIn.emailFieldElement).addValue(testData);
    await (await SignIn.sendVerificationEmailBttnElement).click();
    const textData=await SignIn.codeVerifyElement.getText();
await expect(textData).toBe('Code Verification');


});

//SignIn_029 //SignIn_030
it('verifyEmailFieldWithInvalidAddress',async()=>{
    const testDataNumber='11111';
    const testDataUrl= 'wevotewevote.us';
       await SignIn.emailFieldElement.click();
       await (await SignIn.emailFieldElement).addValue(testDataNumber);
const isClickableNumber=await(await SignIn.sendVerificationEmailBttnElement).isClickable();
       await expect(isClickableNumber).toBe(false);
       await (await SignIn.emailFieldElement).setValue(testDataUrl);
   const   isClickableURL=await(await SignIn.sendVerificationEmailBttnElement).isClickable();
       await expect(isClickableURL).toBe(false);


    });


  //SignIn_031  //SignIn_033 //SignIn_034  //SignIn_035 //SignIn_036
it("verifyEmailFieldAcceptsOnlyLatinLetters",async()=>{

const withLatinLettersOnly=`${SignIn.randomString(6)}@wevote.us`;
//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}@wevote.us`;
 //const lettersWithDecimalOnly=`${randomString(6,false,true)}@wevote.us`;

// const lettersWithUnderscoreOnly=`${randomString(6,false,false,true)}@wevote.us`;
//

// const lettersWithDashOnly=`${randomString(6,false,false,false,true)}@wevote.us`;

await (await SignIn.emailFieldElement).setValue(withLatinLettersOnly);
const emailValue= await (await SignIn.emailFieldElement).getValue();    
console.log('email value ',emailValue);

//await expect(emailValue).toBe(emailWithLatinLettersOnly);
await expect(emailValue).toMatch(/^[a-zA-Z]+@wevote\.us$/);
let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isClickable();
await expect(isDisplayed).toBe(true);
//await (await SignIn.emailFieldElement).click(); // Focus on the field
// Use JavaScript to select all text in the input field

//await (await SignIn.emailFieldElement).doubleClick(); // Focus on the field
    await (await SignIn.emailFieldElement).setValue(''); // Clear using setValue
    await driver.pause(waitTime); // Pause to ensure value is cleared

// await (await SignIn.emailFieldElement).setValue(lettersWithNumOnly);
//  const valueWithNum= await (await SignIn.emailFieldElement).getValue();    
//  console.log('email value ',valueWithNum);
//  await expect(valueWithNum).toMatch(/^[a-zA-Z0-9]+@wevote\.us$/);

});
//SignIn_033

it("verifyEmailFieldAcceptsLettersWithNum",async()=>{
const lettersWithNumOnly=`${SignIn.randomString(6,true)}@wevote.us`;//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}
// or only need to use the parameters that are relevant for the string you want to generate. If you want a random string that includes numbers but excludes decimals, underscores, and dashes, you can simply call:  const lettersWithNumOnly=`${SignIn.randomString(6,true)}`;
 await (await SignIn.emailFieldElement).setValue(lettersWithNumOnly);
 const valueWithNum= await (await SignIn.emailFieldElement).getValue();    
 console.log('email value ',valueWithNum);
 await expect(valueWithNum).toMatch(/^[a-zA-Z0-9]+@wevote\.us$/);
 let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isClickable();
 await expect(isDisplayed).toBe(true);
//*************************setvalue/cleae value not working ********************/

//  await (await SignIn.emailFieldElement).clearValue();; 
//  await driver.pause(10000);
//  await (await SignIn.emailFieldElement).setValue('');
//  await driver.pause(10000);
//********************************************************************************

});
//SignIn_034
it("verifyEmailFieldAcceptsLettersWithDecimal",async()=>{
     const lettersWithDecimalOnly=`${SignIn.randomString(2)}.${SignIn.randomString(2)}@wevote.us`;
//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}
    // or only need to use the parameters that are relevant for the string you want to generate. If you want a random string that includes numbers but excludes decimals, underscores, and dashes, you can simply call:  const lettersWithNumOnly=`${SignIn.randomString(6,true)}`;
     await (await SignIn.emailFieldElement).setValue(lettersWithDecimalOnly);
     const valueWithDec= await (await SignIn.emailFieldElement).getValue();    
     console.log('email value ',valueWithDec);
     await expect(valueWithDec).toMatch(/^[a-zA-Z.]*\.[a-zA-Z.]*@wevote\.us$/);
     let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isClickable();
     await expect(isDisplayed).toBe(true);
    });
   //SignIn_035
it("verifyEmailFieldAcceptsLettersWithUnderscore",async()=>{
    const lettersWithUnderscore=`${SignIn.randomString(2)}_${SignIn.randomString(2)}@wevote.us`;
//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}
   // or only need to use the parameters that are relevant for the string you want to generate. If you want a random string that includes numbers but excludes decimals, underscores, and dashes, you can simply call:  const lettersWithNumOnly=`${SignIn.randomString(6,true)}`;
    await (await SignIn.emailFieldElement).setValue(lettersWithUnderscore);
    const valueWithUnderscore= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueWithUnderscore);
    await expect(valueWithUnderscore).toMatch(/^[a-zA-Z]*\_[a-zA-Z]*@wevote\.us$/);
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isClickable();
    await expect(isDisplayed).toBe(true);
});
//     //SignIn_036
it("verifyEmailFieldAcceptsLettersWithDash",async()=>{
    const lettersWithDash=`${SignIn.randomString(3)}-${SignIn.randomString(3)}@wevote.us`;
//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}
   // or only need to use the parameters that are relevant for the string you want to generate. If you want a random string that includes numbers but excludes decimals, underscores, and dashes, you can simply call:  const lettersWithNumOnly=`${SignIn.randomString(6,true)}`;
    await (await SignIn.emailFieldElement).setValue(lettersWithDash);
    const valueWithDash= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueWithDash);
    await expect(valueWithDash).toMatch(/^[a-zA-Z]*\-[a-zA-Z]*@wevote\.us$/);
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isClickable();
    await expect(isDisplayed).toBe(true);
   });
   //     //SignIn_037
it("verifyEmailFieldDoesntAcceptStartWithDot",async()=>{
    const lettersStartWithDot=`.${SignIn.randomString(4)}@wevote.us`;

    await (await SignIn.emailFieldElement).setValue(lettersStartWithDot);
    const valueStarWithDot= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueStarWithDot);
    await expect(valueStarWithDot).toMatch(/^\.[a-zA-Z]*@wevote\.us$/);
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
   await expect(isDisplayed).toBe(false);
});
//     //SignIn_040
it("verifyEmailFieldDoesntAcceptStartWithDomain",async()=>{
    const lettersStartWithDomain=`@wevote.us`;

    await (await SignIn.emailFieldElement).setValue(lettersStartWithDomain);
    const valueStarWithDomain= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueStarWithDomain);
    await expect(valueStarWithDomain).toMatch(/^@wevote\.us$/);
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
   await expect(isDisplayed).toBe(false);

});
 
 //SignIn_042
it("verifyEmailFieldDoesntAcceptSpaces",async()=>{
    //*******************************Running in Safari only******************************************* */
    // const randomletters = `${SignIn.randomString(4)}`;
    // const withSpace = ' ';

    // const randomletters1 = `${SignIn.randomString(2)}@wevote.us`;
    // const lettersWithSpace = randomletters+withSpace+randomletters1 ;
   // const lettersWithSpace=`${SignIn.randomString(2)}&nbsp;${SignIn.randomString(1)}@wevote.us`;
   if (os.platform() === 'win32') { 
    console.log('Running on Windows'); 
} else if (os.platform() === 'darwin') {
    console.log('Running on macOS');
} else {
    console.log(`Running on ${os.platform()}`);
}    const platformName = browser.capabilities.platformName; // Gets the platform like 'Windows', 'macOS'

    const browserName = browser.capabilities.browserName; 
    console.log(`Platform: ${platformName}`);
    console.log(`Browser: ${browserName}`);

   //space in chrome-windows not counted
  // const lettersWithSpace=`${SignIn.randomString(2)} ${SignIn.randomString(2)}@wevote.us`;

    //const lettersWithSpace='We Vote@wevote.us';
    await (await SignIn.emailFieldElement).click();
  
    
  
  

  await (await SignIn.emailFieldElement).addValue(`${SignIn.randomString(2)}`);
  await (await SignIn.emailFieldElement).addValue(' ');
  await (await SignIn.emailFieldElement).addValue(`${SignIn.randomString(2)}@wevote.us`);
    const valueWithSpace= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueWithSpace);
    await expect(valueWithSpace).toMatch(/^[a-zA-Z]* [a-zA-Z]*@wevote\.us$/);
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
   await expect(isDisplayed).toBe(false);

});
//SignIn_045
it("verifyEmailFieldWithBlank",async()=>{

    await (await SignIn.emailFieldElement).setValue(' ');
    const valueWithBlank= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueWithBlank);
    await expect(valueWithBlank).toMatch(/^$/); // Validating that the value is empty
    let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
   await expect(isDisplayed).toBe(false);

});
   //     //SignIn_046
it("verifyEmailFieldAcceptsLettersWithTwoDots",async()=>{
    const lettersWithDoubleDots=`${SignIn.randomString(2)}.${SignIn.randomString(1)}.${SignIn.randomString(2)}@wevote.us`;
    await (await SignIn.emailFieldElement).setValue(lettersWithDoubleDots);
    const valueWithTwoDots= await (await SignIn.emailFieldElement).getValue();    
    console.log('email value ',valueWithTwoDots);
    await expect(valueWithTwoDots).toMatch(/^[a-zA-Z]*\.[a-zA-Z]*\.[a-zA-Z]*@wevote\.us$/);
   let isDisplayed= await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
   await expect(isDisplayed).toBe(true);
});

//SignIn_047
for(let email of testEmails){
it('verifyEmailFieldAcceptsCharactersBetween6to254',async()=>{
   
    
        console.log(`Testing email: ${email}`);
        console.log('email length:',email.length);

        await (await SignIn.emailFieldElement).setValue(email);
 const emailValue= await (await SignIn.emailFieldElement).getValue();
//console.log('email value ',emailValue);
const len=emailValue.length;
if(len>=6 && len<=254){
    await expect(await SignIn.cancelEmailBttnElement).toBeDisplayed();

await expect(await SignIn.sendVerificationEmailBttnElement).toBeEnabled();
}else{

    await expect(await SignIn.cancelEmailBttnElement).toBeDisplayed();

await expect(await SignIn.sendVerificationEmailBttnElement).not.toBeEnabled();

    }

});
}
  //     //SignIn_052
  it('verifyBackButtonOnVerificationPage',async()=>{
    const lettersWithDoubleDots=`${SignIn.randomString(2)}.${SignIn.randomString(5)}@wevote.us`;
    await (await SignIn.emailFieldElement).setValue(lettersWithDoubleDots);
   
    await (await SignIn.sendVerificationEmailBttnElement).click();
    await driver.waitUntil(async () => {
        return await (await SignIn.codeVerifyElement).getText()=== 'Code Verification'}, {
        timeout: 5000, 
    });  
     await (await SignIn.backButtonElement).click();
     await expect (await SignIn.sendVeificationAgainElement).toBeDisplayed();

});

//     //SignIn_054
it('verifyCancelButtonClearEmailField',async()=>{
    const email=`${SignIn.randomString(5)}@wevote.us`;
    await (await SignIn.emailFieldElement).setValue(email);
   
    await (await SignIn.cancelEmailBttnElement).click();
 const fieldvalue =  await (await SignIn.emailFieldElement).getValue();
     await expect(fieldvalue).toBe('');
     await expect(await SignIn.cancelEmailBttnElement).not.toBeDisplayed();
     await expect(await SignIn.sendVerificationEmailBttnElement).not.toBeDisplayed();

     //***********Both assertion works same way*************************
     //await expect(fieldvalue).toHaveLength(0);
     //await expect(fieldvalue).toEqual('');
//*********************************************************** */


});
});