import { $, $$ } from '@wdio/globals';
import Page from './page';


class ProfilePage extends Page {
 constructor () {
   //super().title = 'Terms of Service - We Vote';
   super().title = 'Profile Photo - WeVote';
 }

 get getSignOutElement() {
   return $('#signOut_Settings')
 }

}

export default new ProfilePage();







