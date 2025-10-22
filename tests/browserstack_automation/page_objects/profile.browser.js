import { $, $$ } from '@wdio/globals';
import PageBrowser from './page.browser';


class ProfileBrowser extends PageBrowser {
 constructor () {
   //super().title = 'Terms of Service - We Vote';
   super().title = 'Profile Photo - WeVote';
 }

 get getSignOutElement() {
   return $('#signOut_Settings')
 }

}

export default new ProfileBrowser();







