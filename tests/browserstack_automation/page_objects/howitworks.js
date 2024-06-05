import { $ } from '@wdio/globals';
import Page from './page';



class HowItWorks extends Page {
  get FirstModalbutton () {
    return $('(//div[@p = "How WeVote works"])');
  }

  get modalTitle () {
    return $('.3Title-sc-1rpx53i-1 iavXrP');
  }
}

export default new HowItWorks();
