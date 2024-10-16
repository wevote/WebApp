import { $, $$ } from '@wdio/globals';
import Page from './page';

class ProfilePage extends Page {
  constructor () {
    //super().title = 'Terms of Service - We Vote';
    super().title = 'Profile Photo - WeVote';
  }

  /* 
  async load () {
    await super.open('/settings/profile');
    await super.maximizeWindow();
    await super.rerender();
  }
  */

  get getProfilePhotoIconElement() {
    //return $('[data-testid="AccountCircleIcon"]');
     //return $('.crPwjk'); 
    return $('.bNnPNQ');
  }

  get getSavePhotoButtonElement() {
    return $('#saveEditYourPhotoBottom');
  }

  get getRemovePhotoElement() {
    return $('.kWfAfq');
  }

  get getSignOutElement() {
    return $('=Sign Out')

  }

 
}

export default new ProfilePage();