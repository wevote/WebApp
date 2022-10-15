// For functions related to addresses

export const stateCodeMap = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MP: 'Northern Mariana Islands',
  MS: 'Mississippi',
  MT: 'Montana',
  NA: 'National',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

export function convertStateCodeToStateText (stateCode) {
  // console.log('Incoming stateCode:', stateCode);
  if (stateCode) {
    const stateCodeUpper = stateCode.toUpperCase();
    if (stateCodeUpper in stateCodeMap) {
      // console.log('stateCodeMap.stateCode:', stateCodeMap[stateCode]);
      return stateCodeMap[stateCodeUpper];
    }
  }
  return '';
}

export function convertStateTextToStateCode (stateText) {
  if (stateText) {
    const stateTextInArray = Object.keys(stateCodeMap).filter((stateCode) => stateCodeMap[stateCode] === stateText);
    return stateTextInArray[0];
  }
  return '';
}

export function convertStateCodeFilterToStateCode (stateCodeFilter) {
  if (stateCodeFilter) {
    const stateCodeInArray = Object.keys(stateCodeMap).filter((stateCode) => `stateCode${stateCode}` === stateCodeFilter);
    return stateCodeInArray[0];
  }
  return '';
}

export function getAllStateCodeFilters () {
  return Object.keys(stateCodeMap).map((stateCode) => `stateCode${stateCode}`);
}

export function getAllStateCodes () {
  return Object.keys(stateCodeMap);
}

export function getStateCodesFoundInObjectList (incomingObjectList) {
  const allStateCodes = getAllStateCodes() || [];
  // console.log('incomingObjectList:', incomingObjectList);
  const stateCodesFoundInObjectList = [];
  incomingObjectList.forEach((object) => {
    if (object && object.state_code && allStateCodes.includes(object.state_code.toUpperCase())) {
      stateCodesFoundInObjectList.push(object.state_code.toUpperCase());
    }
  });
  stateCodesFoundInObjectList.sort();
  return [...new Set(stateCodesFoundInObjectList)];
}
