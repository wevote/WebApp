import { Subject } from 'rxjs';
import CircleEnum from './CircleEnum';

const showChecked = [false, false, false, false];
let displayState = 1;
const subject = new Subject();
export const startedStateMessageService = {
  sendMessage: (message) => subject.next({ text: message }),
  clearMessages: () => subject.next(),
  getMessage: () => subject.asObservable(),
};

export default {
  setIsSignedIn () {  // Takes you to the import button
    showChecked[0] = true;
    // startedState[0] = CircleEnum.checked;
    if (displayState === 1) displayState = 2;
    startedStateMessageService.sendMessage('GetStarted setIsSignedIn');
  },

  setImportButtonPressed () {  // takes you to the contacts table
    showChecked[1] = true;
    // startedState[1] = CircleEnum.checked;
    displayState = 3;
    startedStateMessageService.sendMessage('GetStarted setImportButtonPressed');
  },

  setContinueFromFriendsListPressed () { // takes you to the enable notifications page
    showChecked[2] = true;
    // startedState[2] = CircleEnum.checked;
    displayState = 4;
    startedStateMessageService.sendMessage('GetStarted setContinueFromFriendsListPressed');
  },

  setCheckedState (checked, index) {
    showChecked[index] = checked;
  },

  setAllCheckedStateFalse () {
    for (let i = 0; i < showChecked.length; i++) {
      this.setCheckedState(false, i);
    }
  },


  setDisplayState (index) {
    displayState = index;
    startedStateMessageService.sendMessage('GetStarted setDisplayState');
  },

  getCircleState (index) {
    const arr = this.getStartedStateArray();
    return arr[index];
  },

  getStartedStateArray () {
    const retArray = [];
    for (let i = 0; i < showChecked.length; i++) {
      if (showChecked[i] === true) {
        retArray.push(displayState - 1 === i ? CircleEnum.checkedFilled : CircleEnum.checked);
      } else {
        retArray.push(displayState - 1 === i ? CircleEnum.filled : CircleEnum.bordered);
      }
    }
    return retArray;
  },

  getDisplayState () {
    return displayState;
  },
};
