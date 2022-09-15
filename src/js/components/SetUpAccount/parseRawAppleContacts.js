/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

function stateForAreaCode (phoneNumber) {
  // https://www.allareacodes.com/area_code_listings_by_state.htm
  const matches = phoneNumber.match(/[2-9][0-9][0-9]/);
  if (!matches || matches.length === 0)  return '---';
  const areaString = matches[0];
  if (!areaString || areaString.length === 0) return '---';
  const area = parseInt(areaString);
  if (area.isNaN) return '---';
  const short = true;

  if ([205, 251, 256, 334, 938].includes(area)) return short ? 'AL' : 'Alabama';
  if ([907].includes(area)) return short ? 'AK' : 'Alaska';
  if ([480, 520, 602, 623, 928].includes(area)) return short ? 'AZ' : 'Arizona';
  if ([479, 501, 870].includes(area)) return short ? 'AR' : 'Arkansas';
  if ([209, 213, 279, 310, 323, 408, 415, 424, 442, 510, 530, 559, 562, 619, 626, 628, 650, 657, 661, 669, 707, 714, 747, 760, 805, 818, 820, 831, 858, 909, 916, 925, 949, 951].includes(area)) return short ? 'CA' : 'California';
  if ([303, 719, 720, 970].includes(area)) return short ? 'CO' : 'Colorado';
  if ([203, 475, 860, 959].includes(area)) return short ? 'CT' : 'Connecticut';
  if ([302].includes(area)) return short ? 'DE' : 'Delaware';
  if ([239, 305, 321, 352, 386, 407, 561, 727, 754, 772, 786, 813, 850, 863, 904, 941, 954].includes(area)) return short ? 'FL' : 'Florida';
  if ([229, 404, 470, 478, 678, 706, 762, 770, 912].includes(area)) return short ? 'GA' : 'Georgia';
  if ([808].includes(area)) return short ? 'HI' : 'Hawaii';
  if ([208, 986].includes(area)) return short ? 'ID' : 'Idaho';
  if ([217, 224, 309, 312, 331, 618, 630, 708, 773, 779, 815, 847, 872].includes(area)) return short ? 'IL' : 'Illinois';
  if ([219, 260, 317, 463, 574, 765, 812, 930].includes(area)) return short ? 'IN' : 'Indiana';
  if ([319, 515, 563, 641, 712].includes(area)) return short ? 'IA' : 'Iowa';
  if ([316, 620, 785, 913].includes(area)) return short ? 'KS' : 'Kansas';
  if ([270, 364, 502, 606, 859].includes(area)) return short ? 'KY' : 'Kentucky';
  if ([225, 318, 337, 504, 985].includes(area)) return short ? 'LA' : 'Louisiana';
  if ([207].includes(area)) return short ? 'ME' : 'Maine';
  if ([240, 301, 410, 443, 667].includes(area)) return short ? 'MD' : 'Maryland';
  if ([339, 351, 413, 508, 617, 774, 781, 857, 978].includes(area)) return short ? 'MA' : 'Massachusetts';
  if ([231, 248, 269, 313, 517, 586, 616, 734, 810, 906, 947, 989].includes(area)) return short ? 'MI' : 'Michigan';
  if ([218, 320, 507, 612, 651, 763, 952].includes(area)) return short ? 'MN' : 'Minnesota';
  if ([228, 601, 662, 769].includes(area)) return short ? 'MS' : 'Mississippi';
  if ([314, 417, 573, 636, 660, 816].includes(area)) return short ? 'MO' : 'Missouri';
  if ([406].includes(area)) return short ? 'MT' : 'Montana';
  if ([308, 402, 531].includes(area)) return short ? 'NE' : 'Nebraska';
  if ([702, 725, 775].includes(area)) return short ? 'NV' : 'Nevada';
  if ([603].includes(area)) return short ? 'NH' : 'New Hampshire';
  if ([201, 551, 609, 640, 732, 848, 856, 862, 908, 973].includes(area)) return short ? 'NJ' : 'New Jersey';
  if ([505, 575].includes(area)) return short ? 'NM' : 'New Mexico';
  if ([212, 315, 332, 347, 516, 518, 585, 607, 631, 646, 680, 716, 718, 838, 845, 914, 917, 929, 934].includes(area)) return short ? 'NY' : 'New York';
  if ([252, 336, 704, 743, 828, 910, 919, 980, 984].includes(area)) return short ? 'NC' : 'North Carolina';
  if ([701].includes(area)) return short ? 'ND' : 'North Dakota';
  if ([216, 220, 234, 330, 380, 419, 440, 513, 567, 614, 740, 937].includes(area)) return short ? 'OH' : 'Ohio';
  if ([405, 539, 580, 918].includes(area)) return short ? 'OK' : 'Oaklahoma';
  if ([458, 503, 541, 971].includes(area)) return short ? 'OR' : 'Oregon';
  if ([215, 223, 267, 272, 412, 445, 484, 570, 610, 717, 724, 814, 878].includes(area)) return short ? 'PA' : 'Pennsylvania';
  if ([401].includes(area)) return short ? 'RI' : 'Rhode Island';
  if ([803, 843, 854, 864].includes(area)) return short ? 'SC' : 'South Carolina';
  if ([605].includes(area)) return short ? 'SD' : 'South Dakota';
  if ([423, 615, 629, 731, 865, 901, 931].includes(area)) return short ? 'TN' : 'Tennessee';
  if ([210, 214, 254, 281, 325, 346, 361, 409, 430, 432, 469, 512, 682, 713, 726, 737, 806, 817, 830, 832, 903, 915, 936, 940, 956, 972, 979].includes(area)) return short ? 'TX' : 'Texas';
  if ([385, 435, 801].includes(area)) return short ? 'UT' : 'Utah';
  if ([802].includes(area)) return short ? 'VT' : 'Vermont';
  if ([276, 434, 540, 571, 703, 757, 804].includes(area)) return short ? 'VA' : 'Virginia';
  if ([206, 253, 360, 425, 509, 564].includes(area)) return short ? 'WA' : 'Washington';
  if ([202].includes(area)) return short ? 'DC' : 'Washington DC';
  if ([304, 681].includes(area)) return short ? 'WV' : 'West Virginia';
  if ([262, 414, 534, 608, 715, 920].includes(area)) return short ? 'WI' : 'Wisconsin';
  if ([684].includes(area)) return short ? 'AS' : 'Samoa';
  if ([671].includes(area)) return short ? 'GU' : 'Guam';
  if ([670].includes(area)) return short ? 'NI' : 'Northern Mariana Islands';
  if ([787, 939].includes(area)) return short ? 'PR' : 'Puerto Rico';
  if ([340].includes(area)) return short ? 'VI' : 'Virgin Islands';
  return '---';
}


function getBestPhoneNumberOrEmail (chunk) {
  const types = ['home', 'mobile', 'work', 'other'];
  for (let i = 0; i < chunk.length; i++) {
    for (let j = 0; j < types.length; j++) {
      if (chunk[i].type === types[j]) {
        return chunk[i].value;
      }
    }
  }
  return '';  // fail, but we should not get here
}

// eslint-disable-next-line import/prefer-default-export
export function parseRawAppleContacts (contacts) {
  const results = [];
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const { firstName, middleName, familyName, phoneNumbers, emails } = contact;
    if (firstName === '' && familyName === '') continue;
    if (emails.length === 0) continue;
    const voterEmail = getBestPhoneNumberOrEmail(emails);
    if (voterEmail.length === 0) continue;  // No need to proceed with this one, if no email address
    const phoneNumber = getBestPhoneNumberOrEmail(phoneNumbers);
    const stateCode = stateForAreaCode(phoneNumber);
    let displayName = firstName.trim();
    if (middleName.trim().length > 0) {
      displayName += ` ${middleName.trim()}`;
    }
    if (familyName.trim().length > 0) {
      displayName += ` ${familyName.trim()}`;
    }

    results.push({
      display_name: displayName,
      family_name: familyName,
      given_name: firstName,
      email: voterEmail,
      id: voterEmail.replace('@', '-').replace('.', '-'),
      selected: false,
      type: '',
      phone_number: phoneNumber,
      api_type: 'apple',
      update_time: new Date().toISOString(),
      state_code: stateCode,
    });
  }
  return results;
}

