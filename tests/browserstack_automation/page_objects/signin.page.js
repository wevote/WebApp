import { cardHeaderClasses } from '@mui/material';
import {$,$$} from '@wdio/globals';
import Page from './page';

class SignIn extends Page{
  /*  constructor(){
        super().title= 'Ready to Vote? - WeVote';
    }*/
    
    get signInLinkElement(){
        return $('.StyledButton-sc-1hu720d-1');
    }
    get signInElement(){
        return $('.u-f3');
    }

    get signInWithTwitterTextElement(){
        return $('//span[text()="Sign in with Twitter"]');
    }
    get signInWithAppleTextElement(){
        return $('//span[text()="Sign in with Apple"]');  // #appleSignInText
    }
    get twitterBttnElement(){
        return $('#twitterSignIn-splitIconButton');
    }
    get appleBttnElement(){
        return $('.AppleSignInButton-sc-1tt5cpk-2');
    }
    
    

    get phoneNumberLabelElement(){
        return $('#enterVoterPhone-label');
    }

    get phoneNumberFieldElement(){
        return $('#enterVoterPhone');
    }

    get emailLabelElement(){
        return $('#enterVoterEmailAddress-label');
    }

    get emailFieldElement(){
        return $('#enterVoterEmailAddress');
    }
get iconElements(){
        return $$('#SignInOptionsMain-undefined svg');
    }
    get cancelPhoneBttnElement(){
        return $('#cancelVoterPhoneSendSMS');
    }
   get cancelEmailBttnElement(){
        return $('#cancelEmailButton');
    } 

    get sendVerificationPhoneBttnElement(){
        return $('#voterPhoneSendSMS');
    }
    get sendVerificationEmailBttnElement(){
        return $('#voterEmailAddressEntrySendCode');
    }
    get closeBttnElement(){
        return $('#signInModalSimpleCloseIcon');
    }
    get codeVerifyElement(){
        return $('.Title-sc-27qyt7-4');
    }
    get backButtonElement(){
    return $('#emailVerificationBackButton');
}
get sendVeificationAgainElement(){
    return $('//*[text()="Send verification again"]');
}
    async getIcons(){
        const iconList= await this.iconElements;
              const visibilityList = [];   
        for(const icon of iconList){
        const  isIconVisible =await icon.isDisplayed()// call isDisplayed
        visibilityList.push(isIconVisible);
        }
        return visibilityList;
    }

    
    async getText1(element) {
        try {
            const text = await element.getText();
            console.log(`Element extracted text is: ${text}`);
            return text;
        } catch (error) {
            console.error('Error extracting text:', error);
            return '';
        }
    }

 randomString(length,withNum=false,withDecimal=false,withUnderscore=false,withDash=false){

    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result='';
    let genresult='0123456789';
    if (withNum==true) {
        chars = chars+'0123456789';
    }
    
//     if (withDecimal==true) {
//         chars =chars+ '.';
//     }   

//     if (withUnderscore==true) {
//         chars = chars+'_';
//     }
//     if(withDash==true){
// chars=chars+'-'
//     }
    //console.log('Available characters:', chars);
    for(let i=0;i<length;i++)
    {
     
    result=result+chars.charAt(Math.floor(Math.random() * chars.length));
   // console.log('Generated string:', result);

}
if(withNum){
   if (!result.split('').some(char => '0123456789'.includes(char ))) {
    // const randomIndex = Math.floor(Math.random() * chars.length); // Use parentheses for Math.random
    // result = result + chars.charAt(randomIndex);
    //for(let i=0;i<2;i++)
    //{
        result=result+genresult.charAt(Math.floor(Math.random() * genresult.length)); 
    //}
   }}
  
    return  result; 

   


 }



}
export default new SignIn();
