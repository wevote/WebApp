// adjustDistrictNameAndOfficeName.js

export default function adjustDistrictNameAndOfficeName (districtNameIncoming, officeNameIncoming) {
  let districtName = districtNameIncoming;
  let officeName = officeNameIncoming;
  if (officeName && officeName.includes(districtName)) {
    // This removes districtName in cases like 'Governor of California for California'
    districtName = '';
  } else if (districtName && districtName.includes(officeName)) {
    // This removes officeName: 'Alcorn County Supervisor' with districtName: 'Alcorn County Supervisor District 2'
    officeName = '';
  } else if (districtName && districtName.endsWith(' city')) {
    const districtNameWithoutCity = districtName.slice(0, districtName.length - 5);
    if (officeName && officeName.includes(districtNameWithoutCity)) {
      // This removes districtName in cases like officeName: 'Mayor of Los Angeles' with districtName: 'Los Angeles city'
      districtName = '';
    }
  }
  return { districtName, officeName };
}
