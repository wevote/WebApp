import { stringContains } from './textFormat';
import { isCordova } from '../common/utils/isCordovaOrWebApp';

export default function displayFriendsTabs () {
  if (isCordova() && stringContains('/friends', window.location.href)) {
    return true;
  }

  if (window.innerWidth < 769 && stringContains('/friends', window.location.pathname)) {
    return true;
  }

  return false;
}

// Note that in Cordova via debugger...
// window.location.href: "file:///Users/stevepodell/Library/Developer/CoreSimulator/Devices/CD6665FD-0F3A-4BB1-B90E-CE940767FBCE/data/Containers/Bundle/Application/9C…"
// window.location.href.slice(100): "CE/data/Containers/Bundle/Application/9CF132A2-7AD8-4B64-A301-F715067881B0/We%20Vote.app/www/index.html#/friends"
// window.location.pathname: "/Users/stevepodell/Library/Developer/CoreSimulator/Devices/CD6665FD-0F3A-4BB1-B90E-CE940767FBCE/data/Containers/Bundle/Application/9CF132A2-…"
// window.location.pathname.slice(100): "/Containers/Bundle/Application/9CF132A2-7AD8-4B64-A301-F715067881B0/We%20Vote.app/www/index.html"
