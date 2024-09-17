import { $, $$ } from '@wdio/globals';
import Page from './page';


class WRFOPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - WeVote';
  }
  
  get stateCandidateLink() {
  return $('//a[@href="/'+staName+'-candidates/cs/"]');
   //return $('="Alaska candidates"]');
   //return $('a="Alaska"');
   //return $('[href = "/donate"]');
    
  }


  get californiaCandidateLink() {
    //return $('[href="/alaska-candidates/cs/"]');
     //return $('="Alaska candidates"]');
    // return $('a="Alaska"');
     return $('//a[@href="/california-candidates/cs/"]');
      
    }


    get hawaiiCandidateLink() {
      //return $('[href="/alaska-candidates/cs/"]');
       //return $('="Alaska candidates"]');
      // return $('a="Alaska"');
       return $('//a[@href="/hawaii-candidates/cs/"]');
        
      }

  async clickAlaskaCandidateLink()
  {
    await this.alaskaCandidatesLink.click();
  }


  

  async waitAboutLinkAndClick () {
    await this.getAboutLinkElement.waitForDisplayed({ timeout: 15000 });
    // await driver.pause(9000);
    await this.getAboutLinkElement.click();
  }

  async load () {
    await super.open('/ready');
  }

  async signIn () {
    await super.signIn();
  }

  
}

export default new WRFOPage();
