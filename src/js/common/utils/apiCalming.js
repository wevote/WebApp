import { httpLog } from './logging';

/*
If we were building the app from scratch, every API query would be conditioned by logic
to make certain the query is necessary.

Important: adding new queries "just to be safe" without proactively determining that they are necessary
will damage the hard earned performance of the WebApp.

This function stops identical queries from being fired within the specified duration in milliseconds
*/
export default function apiCalming (name, duration = 1000) {
  const { apiCalmingDict } = window;
  if (!apiCalmingDict) {
    window.apiCalmingDict = {};
  }
  if (!window.apiCalmingDict[name]) {
    window.apiCalmingDict[name] =  {
      duration,
      timeStamp: Date.now(),
    };
    httpLog(`== apiCalming for ${name}, make the API call: true, no dict entry yet for this API`);
    return true;
  }

  const entry =  window.apiCalmingDict[name];
  if (entry.timeStamp + duration < Date.now()) {
    window.apiCalmingDict[name] = {
      duration,
      timeStamp: Date.now(),
    };
    httpLog(`== apiCalming for ${name}, make the API call: true, duration: ${duration}, previous dict entry has expired`);
    return true;
  }
  httpLog(`== apiCalming for ${name}, make the API call: false, duration: ${duration}, previous calming entry still in force`);
  return false;
}
