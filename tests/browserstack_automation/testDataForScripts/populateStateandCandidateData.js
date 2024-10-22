

class PopulateData {
  constructor () {
    this.StateAndCandidatesList = [
      { stateName: 'alaska', stateURL: 'alaska-candidates\/cs\/', stateTitle: 'Alaska Candidates - WeVote', stateAbb: 'AK' },
      { stateName: 'alabama', stateURL: 'alabama-candidates\/cs\/', stateTitle: 'Alabama Candidates - WeVote', stateAbb: 'AL' },
      { stateName: 'arkansas', stateURL: 'arkansas-candidates\/cs\/', stateTitle: 'Arkansas Candidates - WeVote', stateAbb: 'AR' },
      { stateName: 'arizona', stateURL: 'arizona-candidates\/cs\/', stateTitle: 'Arizona Candidates - WeVote', stateAbb: 'AZ' },
      { stateName: 'california', stateURL: 'california-candidates\/cs\/', stateTitle: 'California Candidates - WeVote', stateAbb: 'CA' },
      { stateName: 'colorado', stateURL: 'colorado-candidates\/cs\/', stateTitle: 'Colorado Candidates - WeVote', stateAbb: 'CO' },
      { stateName: 'connecticut', stateURL: 'connecticut-candidates\/cs\/', stateTitle: 'Connecticut Candidates - WeVote', stateAbb: 'CT' },
      { stateName: 'district-of-columbia', stateURL: 'district-of-columbia-candidates\/cs\/', stateTitle: 'District of Columbia Candidates - WeVote', stateAbb: 'DC' },
      { stateName: 'delaware', stateURL: 'delaware-candidates\/cs\/', stateTitle: 'Delaware Candidates - WeVote', stateAbb: 'DE' },
      { stateName: 'florida', stateURL: 'florida-candidates/cs/', stateTitle: 'Florida Candidates - WeVote', stateAbb: 'FL' },
      { stateName: 'georgia', stateURL: 'georgia-candidates\/cs\/', stateTitle: 'Georgia Candidates - WeVote', stateAbb: 'GA' },
      { stateName: 'hawaii', stateURL: 'hawaii-candidates\/cs\/', stateTitle: 'Hawaii Candidates - WeVote', stateAbb: 'HI' },
      { stateName: 'iowa', stateURL: 'iowa-candidates\/cs\/', stateTitle: 'Iowa Candidates - WeVote', stateAbb: 'IA' },
      { stateName: 'idaho', stateURL: 'idaho-candidates\/cs\/', stateTitle: 'Idaho Candidates - WeVote', stateAbb: 'ID' },
      { stateName: 'illinois', stateURL: 'illinois-candidates\/cs\/', stateTitle: 'Illinois Candidates - WeVote', stateAbb: 'IL' },
      { stateName: 'indiana', stateURL: 'indiana-candidates\/cs\/', stateTitle: 'Indiana Candidates - WeVote', stateAbb: 'IN' },
      { stateName: 'kansas', stateURL: 'kansas-candidates\/cs\/', stateTitle: 'Kansas Candidates - WeVote', stateAbb: 'KS' },
      { stateName: 'kentucky', stateURL: 'kentucky-candidates\/cs\/', stateTitle: 'Kentucky Candidates - WeVote', stateAbb: 'KY' },
      { stateName: 'louisiana', stateURL: 'louisiana-candidates\/cs\/', stateTitle: 'Louisiana Candidates - WeVote', stateAbb: 'LA' },
      { stateName: 'massachusetts', stateURL: 'massachusetts-candidates\/cs\/', stateTitle: 'Massachusetts Candidates - WeVote', stateAbb: 'MA' },
      { stateName: 'maryland', stateURL: 'maryland-candidates\/cs\/', stateTitle: 'Maryland Candidates - WeVote', stateAbb: 'MD' },
      { stateName: 'maine', stateURL: 'maine-candidates\/cs\/', stateTitle: 'Maine Candidates - WeVote', stateAbb: 'ME' },
      { stateName: 'michigan', stateURL: 'michigan-candidates\/cs\/', stateTitle: 'Michigan Candidates - WeVote', stateAbb: 'MI' },
      { stateName: 'minnesota', stateURL: 'minnesota-candidates\/cs\/', stateTitle: 'Minnesota Candidates - WeVote', stateAbb: 'MN' },
      { stateName: 'montana', stateURL: 'montana-candidates\/cs\/', stateTitle: 'Montana Candidates - WeVote', stateAbb: 'MT' },
      { stateName: 'national', stateURL: 'national-candidates\/cs\/', stateTitle: 'Candidates - WeVote', stateAbb: 'all' },
      { stateName: 'north-carolina', stateURL: 'north-carolina-candidates\/cs\/', stateTitle: 'North Carolina Candidates - WeVote', stateAbb: 'NC' },
      { stateName: 'north-dakota', stateURL: 'north-dakota-candidates\/cs\/', stateTitle: 'North Dakota Candidates - WeVote', stateAbb: 'ND' },
      { stateName: 'nebraska', stateURL: 'nebraska-candidates\/cs\/', stateTitle: 'Nebraska Candidates - WeVote', stateAbb: 'NE' },
      { stateName: 'new-hampshire', stateURL: 'new-hampshire-candidates\/cs\/', stateTitle: 'New Hampshire Candidates - WeVote', stateAbb: 'NH' },
      { stateName: 'new-jersey', stateURL: 'new-jersey-candidates\/cs\/', stateTitle: 'New Jersey Candidates - WeVote', stateAbb: 'NJ' },
      { stateName: 'new-mexico', stateURL: 'new-mexico-candidates\/cs\/', stateTitle: 'New Mexico Candidates - WeVote', stateAbb: 'NM' },
      { stateName: 'nevada', stateURL: 'nevada-candidates\/cs\/', stateTitle: 'Nevada Candidates - WeVote', stateAbb: 'NV' },
      { stateName: 'new-york', stateURL: 'new-york-candidates\/cs\/', stateTitle: 'New York Candidates - WeVote', stateAbb: 'NY' },
      { stateName: 'ohio', stateURL: 'ohio-candidates\/cs\/', stateTitle: 'Ohio Candidates - WeVote', stateAbb: 'OH' },
      { stateName: 'ohio', stateURL: 'ohio-candidates\/cs\/', stateTitle: 'Ohio Candidates - WeVote', stateAbb: 'OH' },
      { stateName: 'oklahoma', stateURL: 'oklahoma-candidates\/cs\/', stateTitle: 'Oklahoma Candidates - WeVote', stateAbb: 'OK' },
      { stateName: 'oregon', stateURL: 'oregon-candidates\/cs\/', stateTitle: 'Oregon Candidates - WeVote', stateAbb: 'OR' },
      { stateName: 'pennsylvania', stateURL: 'pennsylvania-candidates\/cs\/', stateTitle: 'Pennsylvania Candidates - WeVote', stateAbb: 'PA' },
      { stateName: 'rhode-island', stateURL: 'rhode-island-candidates\/cs\/', stateTitle: 'Rhode Island Candidates - WeVote', stateAbb: 'RI' },
      { stateName: 'south-carolina', stateURL: 'south-carolina-candidates\/cs\/', stateTitle: 'South Carolina Candidates - WeVote', stateAbb: 'SC' },
      { stateName: 'south-dakota', stateURL: 'south-dakota-candidates\/cs\/', stateTitle: 'South Dakota Candidates - WeVote', stateAbb: 'SD' },
      { stateName: 'tennessee', stateURL: 'tennessee-candidates\/cs\/', stateTitle: 'Tennessee Candidates - WeVote', stateAbb: 'TN' },
      { stateName: 'texas', stateURL: 'texas-candidates\/cs\/', stateTitle: 'Texas Candidates - WeVote', stateAbb: 'TX' },
      { stateName: 'utah', stateURL: 'utah-candidates\/cs\/', stateTitle: 'Utah Candidates - WeVote', stateAbb: 'UT' },
      { stateName: 'virginia', stateURL: 'virginia-candidates\/cs\/', stateTitle: 'Virginia Candidates - WeVote', stateAbb: 'VA' },
      { stateName: 'vermont', stateURL: 'vermont-candidates\/cs\/', stateTitle: 'Vermont Candidates - WeVote', stateAbb: 'VT' },
      { stateName: 'washington', stateURL: 'washington-candidates\/cs\/', stateTitle: 'Washington Candidates - WeVote', stateAbb: 'WA' },
      { stateName: 'wisconsin', stateURL: 'wisconsin-candidates\/cs\/', stateTitle: 'wisconsin Candidates - WeVote', stateAbb: 'WI' },
      { stateName: 'west-virginia', stateURL: 'west-virginia-candidates\/cs\/', stateTitle: 'West Virginia Candidates - WeVote', stateAbb: 'WV' },
      { stateName: 'wyoming', stateURL: 'wyoming-candidates\/cs\/', stateTitle: 'Wyoming Candidates - WeVote', stateAbb: 'WY' },


    ];
  }


  getStateAndCandidatesList () {
    return this.StateAndCandidatesList;
  }
}



module.exports = PopulateData;
