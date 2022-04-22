import webAppConfig from '../../config';
import normalizedImagePath from '../utils/normalizedImagePath';

if (window.cordova) { // Static constants are initialized before the app starts
  webAppConfig.IS_CORDOVA = true;
  window.isCordovaGlobal = true;
}

const photoPath = normalizedImagePath('/img/global/photos/');
const logoPath = normalizedImagePath('/img/global/logos/');

export const weVoteFounders = [{
  name: 'Dale John McGrew',
  image: `${photoPath}Dale_McGrew-256x256.jpg`,
  title: [
    'Co-Founder / CTO & c3 + c4 Board Member',
    'Prior to running We Vote, Dale successfully co-founded, built and sold two high tech startups (Gravity.com and GoLightly.com). Dale has managed large software projects for companies like Disney, IBM and Crayola and over 60 nonprofits.',
  ],
},
{
  name: 'Jenifer Fernandez Ancona',
  image: `${photoPath}Jenifer_Fernandez_Ancona-256x256.jpg`,
  title: [
    'Co-Founder & c4 Board Chair',
    'Jenifer helps to run Way to Win, a national community of progressive women donors.',
  ],
}];

export const weVoteBoard = [{
  name: 'Debra Cleaver',
  image: `${photoPath}Debra_Cleaver-200x200.jpg`,
  title: [
    'c3 Board Member',
    "Founder of VOTE.org, the web's most heavily trafficked site for accurate voting information.",
  ],
}, {
  name: 'Tiana Epps-Johnson',
  image: `${photoPath}Tiana_Epps_Johnson-256x256.jpg`,
  title: [
    'Senior Adviser',
    'Executive Director of CTCL, software for election administrators. Former Voting Info Project Harvard Ash Center for Democratic Governance and Innovation.',
  ],
}, {
  name: 'Lawrence Grodeska',
  image: `${photoPath}Lawrence_Grodeska-200x200.jpg`,
  title: [
    'c3 Board Chair',
    'Civic Tech communications and innovation at CivicMakers. Formerly at Change.org.',
  ],
}, {
  name: 'Matt Holford',
  image: `${photoPath}Matt_Holford-256x256.jpg`,
  title: [
    'Senior Adviser',
    'As Chief Technology Officer at DoSomething.org, Matt oversees engineering at the largest tech company exclusively for young people and social change.',
  ],
}, {
  name: 'Alicia Kolar Prevost',
  image: `${photoPath}Alicia_Prevost-200x200.jpg`,
  title: [
    'Senior Adviser',
    'Led Defend Our Future (Environmental Defense Fund), mobilizing young people around climate action. PhD in political science, American University.',
  ],
}, {
  name: 'Barbara Shannon',
  image: `${photoPath}Barbara_Shannon-200x200.jpg`,
  title: [
    'c3 Board Member',
    'Adviser to entrepreneurs and C-level Fortune 500 leaders. MBA The Wharton School.',
  ],
}, {
  name: 'Anat Shenker-Osorio',
  image: `${photoPath}Anat_Shenker_Osario-200x200.jpg`,
  title: [
    'c4 Board Member',
    'Communications expert, researcher and political pundit.',
  ],
}, {
  name: 'Betsy Sikma',
  image: `${photoPath}Betsy_Sikma-256x256.jpg`,
  title: [
    'c3 Board Member',
    'Betsy Sikma is Director, Corporate PR at Milliken & Co. She holds degrees from Furman University and Vanderbilt University, and a certificate in Nonprofit Finance from Kellogg School of Management.',
  ],
}, {
  name: 'Jessica St. John',
  image: `${photoPath}Jessica_St.John-201905-256x256.png`,
  title: [
    'Director',
    'Advisor to businesses and nonprofits. Believes in the power of the polis. Lover of nature.',
  ],
}, {
  name: 'Billy Wimsatt',
  image: `${photoPath}Billy_Wimsatt-200x200.jpg`,
  title: [
    'Senior Adviser',
    'Author and political activist. Founder of Gamechanger Labs, the League of Young Voters & TheBallot.org.',
  ],
}, {
  name: 'William Winters',
  image: `${photoPath}William_Winters-200x200.jpg`,
  title: [
    'c4 Board Member',
    'Campaign Manager. Courage Campaign, Color Of Change, CEL & Change.org.',
  ],
},
];

export const weVoteStaff = [{
  name: 'Ahmed Elgamal',
  image: `${photoPath}Ahmed_Elgamal-200x200.jpg`,
  title: [
    'UI/UX Designer',
    'Digital Product Designer with 2 years of experience in Graphic Design, User Interface Design, User Experience Design, and User Experience Research.',
  ],
}, {
  name: 'Irene Florez',
  image: `${photoPath}Irene_Florez-200x200.jpg`,
  title: [
    'Marketing',
  ],
}, {
  name: 'Jeff French',
  image: `${photoPath}Jeff_French-256x256.png`,
  title: [
    'Senior Designer',
    'Digital product designer focused on creating engaging experiences and contributing to the systems that hold them together. Jeff designed the We Vote logo and has been critical to establishing We Vote\'s design systems.',
  ],
}, {
  name: 'Ashwini Gawande',
  image: `${photoPath}Ashwini_Gawande-251x251.jpg`,
  title: [
    'Quality Assurance',
  ],
}, {
  name: 'Anisha Jain',
  image: `${photoPath}Anisha_Jain-200x200.jpg`,
  title: [
    'Sr. Software Engineer',
  ],
}, {
  name: 'Elizabeth Janeczko',
  image: `${photoPath}Elizabeth_Janeczko-200x200.jpg`,
  title: [
    'Sr. Writer & Content Marketing Manager',
  ],
}, {
  name: 'Judy Johnson',
  image: `${photoPath}Judy_Johnson-256x256.jpg`,
  title: [
    'Operations',
    'Joined We Vote in 2015 with over 20 years of financial and office administration experience both in the private and public sector. Truly believes every vote counts!',
  ],
}, {
  name: 'Thomas Lawson',
  image: `${photoPath}Thomas_Lawson-200x200.jpg`,
  title: [
    'VP Marketing',
  ],
}, {
  name: 'Josh Levinger',
  image: `${photoPath}Josh_Levinger-256x256.jpg`,
  title: [
    'User Experience Designer',
  ],
}, {
  name: 'Edward Ly',
  image: `${photoPath}Edward_Ly-200x200.jpg`,
  title: [
    'Engineering Intern',
  ],
}, {
  name: 'Phil Marshall',
  image: `${photoPath}Phil_Marshall-256x256.jpg`,
  title: [
    'Engineering Volunteer',
  ],
}, {
  name: 'Valerie Patel',
  image: `${photoPath}Valerie_Patel-256x256.jpg`,
  title: [
    'Political Data Manager',
  ],
}, {
  name: 'Jarod Peachey',
  image: `${photoPath}Jarod_Peachey-256x256.png`,
  title: [
    'Engineering Intern',
    'Jarod is a senior in high school, and has been coding since 2018. He is on We Vote\'s React and Javascript team. He enjoys playing guitar in his spare time.',
  ],
}, {
  name: 'Steve Podell',
  image: `${photoPath}Steve_Podell-256x256.jpg`,
  title: [
    'Director of Mobile Development',
    'Steve has been volunteering with We Vote since 2017, and single-handedly launched our iOS and Android apps, as well as contributing to all of We Vote\'s code repositories.',
  ],
}, {
  name: 'Utsab Saha',
  image: `${photoPath}Utsab_Saha-256x256.png`,
  title: [
    'Volunteer',
  ],
}, {
  name: 'Urosh Stojkovikj',
  image: `${photoPath}Urosh_Stojkovikj-256x256.jpg`,
  title: [
    'Engineering Intern',
  ],
}, {
  name: 'Aaron Travis',
  image: `${photoPath}Aaron_Travis-200x200.jpg`,
  title: [
    'Experience Director',
  ],
},
];
//

export const organizationalDonors = [{
  alt: 'Amazon Web Services',
  name: '',
  title: 'Servers',
  logo: `${logoPath}aws-logo.png`,
}, {
  alt: 'Ballotpedia',
  name: '',
  title: 'Ballot Data',
  logo: `${logoPath}ballotpedia-logo.png`,
}, {
  alt: 'BrowserStack',
  name: '',
  title: 'Cross-Platform Testing',
  logo: `${logoPath}browserstack-logo-600x158.png`,
}, {
  alt: 'Center for Technology and Civic Life',
  name: '',
  title: 'Ballot Data & Love',
  link: 'https://techandciviclife.org',
  logo: `${logoPath}ctcl_logo-600x230.jpg`,
}, {
  alt: 'CivicMakers',
  name: '',
  title: 'Event Collaborations',
  link: 'https://civicmakers.com',
  logo: `${logoPath}civicmakers-logo.png`,
}, {
  alt: 'Code for San Francisco & Code for America',
  name: '',
  title: 'Our Home for Volunteer Work',
  logo: `${logoPath}cfa-logo.png`,
}, {
  alt: 'DLA Piper',
  name: '',
  title: 'Legal',
  logo: `${logoPath}dla-piper-logo.png`,
}, {
  alt: 'Facebook',
  name: '',
  title: 'Authentication & Data',
  logo: `${logoPath}facebook-logo.png`,
}, {
  alt: 'Fast Forward',
  name: '',
  title: 'Most Amazing Nonprofit Technology Accelerator Ever',
  link: 'https://ffwd.org',
  logo: `${logoPath}ffwd-logo.png`,
}, {
  alt: 'Fastly.com',
  name: '',
  title: 'Scalable Content Delivery (CDN)',
  link: 'https://fastly.com',
  logo: `${logoPath}fastly-logo.png`,
}, {
  alt: 'Google Civic',
  name: '',
  title: 'Ballot Data',
  logo: `${logoPath}google-logo.svg`,
}, {
  alt: 'Greenberg Traurig, LLP',
  name: '',
  title: 'Legal',
  logo: `${logoPath}gt-logo.png`,
}, {
  alt: 'League of Women Voters',
  name: '',
  title: 'Data',
  logo: `${logoPath}league-of-women-logo.png`,
}, {
  alt: 'MapLight',
  name: '',
  title: 'Data',
  logo: `${logoPath}maplight-logo.png`,
}, {
  alt: 'Microsoft',
  name: '',
  title: 'For supporting Code for San Francisco',
  logo: `${logoPath}microsoft-logo.png`,
}, {
  alt: 'Open People Search',
  name: '',
  title: 'Contact Data Augmentation',
  link: 'https://www.openpeoplesearch.com/',
  logo: `${logoPath}open-people-search-logo.png`,
}, {
  alt: 'TurboVote, Democracy Works',
  name: '',
  title: 'Data',
  logo: `${logoPath}turbovote-logo.png`,
}, {
  alt: 'Twilio',
  name: '',
  title: 'Mobile Tech & for supporting nonprofit tech',
  link: 'https://twilio.com',
  logo: `${logoPath}twilio-logo.png`,
}, {
  alt: 'Twitter',
  name: '',
  title: 'Authentication & Data',
  logo: `${logoPath}twitter-logo.png`,
}, {
  alt: 'Vote Smart',
  name: '',
  title: 'Data',
  logo: `${logoPath}vote-smart-logo.jpeg`,
}, {
  alt: 'Vote USA',
  name: '',
  title: 'Ballot Data',
  link: 'https://www.vote-usa.org/',
  logo: `${logoPath}vote-usa-logo.png`,
}, {
  alt: 'Voting Information Project, Pew Charitable Trusts',
  name: 'Voting Information Project',
  title: 'Data',
  logo: `${logoPath}pew-logo.jpeg`,
}, {
  alt: 'We Vote Education',
  name: 'We Vote Education',
  title: 'Data',
  logo: `${logoPath}we-vote-logo.png`,
}, {
  alt: 'Wikipedia',
  name: '',
  title: 'Data',
  logo: `${logoPath}wikipedia-logo.png`,
},
];

export const teamOfVolunteers = [{
  name: 'Dale John McGrew',
  title: 'Oakland, CA',
}, {
  name: 'Steve Podell',
  title: 'Oakland, CA',
}, {
  name: 'Jarod Peachey',
  title: '',
}, {
  name: 'Anisha Jain',
  title: 'San Jose, CA',
}, {
  name: 'Joe Evans',
  title: 'Santa Cruz, CA',
}, {
  name: 'Ahmed Elgamal',
  title: 'Berkeley, CA',
}, {
  name: 'Valerie Patel',
  title: 'Oklahoma City, OK',
}, {
  name: 'Christine Pascual',
  title: 'San Diego, CA',
}, {
  name: 'Leon Li',
  title: 'Livermore, CA',
}, {
  name: 'Rob Simpson',
  title: 'Warrenton, VA',
}, {
  name: 'Jeff French',
  title: 'Oakland, CA',
}, {
  name: 'Paige Saez',
  title: 'Richmond, CA',
}, {
  name: 'Neelam Joshi',
  title: 'Columbus, OH',
}, {
  name: 'Alicia Kolar Prevost',
  title: 'Washington, DC',
}, {
  name: 'Edward Ly',
  title: 'Gresham, OR',
}, {
  name: 'Irene Florez',
  title: 'San Francisco, CA',
}, {
  name: 'Neil Dullaghan',
  title: 'San Francisco, CA',
}, {
  name: 'Daniel Bellerose',
  title: 'Harrisonberg, VA',
}, {
  name: 'Yuanhsin Chang',
  title: 'San Francisco, CA',
}, {
  name: 'Mansi Desai',
  title: 'San Francisco, CA',
}, {
  name: 'Bharath D N Reddy',
  title: 'Mountain View, CA',
}, {
  name: 'Sarah Clements',
  title: 'San Francisco, CA',
}, {
  name: 'Zach Monteith',
  title: 'San Francisco, CA',
}, {
  name: 'Lisa Cho',
  title: 'San Francisco, CA',
}, {
  name: 'Nicolay Kreidler',
  title: 'Mill Valley, CA',
}, {
  name: 'Nicolas Fiorini',
  title: 'Arlington, VA',
}, {
  name: 'Colette Phair',
  title: 'Oakland, CA',
}, {
  name: 'Jessica St. John',
  title: 'Portland, OR',
}, {
  name: 'Jennifer Holmes',
  title: 'Pacifica, CA',
}, {
  name: 'Andrea Moed',
  title: 'San Francisco, CA',
}, {
  name: 'Matt Holford',
  title: 'New York, NY',
}, {
  name: 'Michael Kushman',
  title: 'San Francisco, CA',
}, {
  name: 'Kathryn Lindquist',
  title: 'San Francisco, CA',
}, {
  name: 'Ciero Kilpatrick',
  title: 'Washington, DC',
}, {
  name: 'Elizabeth Janeczko',
  title: 'Madison, WI',
}, {
  name: 'Aaron Travis',
  title: 'New York, NY',
}, {
  name: 'Jehan Azad',
  title: 'Greenville, SC',
}, {
  name: 'Eric Ogawa',
  title: 'San Francisco, CA',
}, {
  name: 'Mary O\'Connor',
  title: 'Asheville, NC',
}, {
  name: 'Harsha Dronamraju',
  title: 'San Francisco, CA',
}, {
  name: 'Rohan Bhambhoria',
  title: 'Mississauga, Ontario, Canada',
}, {
  name: 'Josh Southern',
  title: 'San Francisco, CA',
}, {
  name: 'Nitin Garg',
  title: 'San Francisco, CA',
}, {
  name: 'Niko Barry',
  title: 'Berkeley, CA',
}, {
  name: 'Eva Konigsberg',
  title: 'Oakland, CA',
}, {
  name: 'Adam Barry',
  title: 'San Francisco, CA',
}, {
  name: 'Marissa Luna',
  title: 'Lansing, MI',
}, {
  name: 'Aaron Borden',
  title: 'San Francisco, CA',
}, {
  name: 'Judy Johnson',
  title: 'Oakland, CA',
}, {
  name: 'Udi Davidovich',
  title: 'Walnut Creek, CA',
}, {
  name: 'Chris Arya',
  title: 'San Francisco, CA',
}, {
  name: 'Tom Furlong',
  title: 'Menlo Park, CA',
}, {
  name: 'Paul A. "Dash" McLean',
  title: 'E. Palo Alto, CA',
}, {
  name: 'Tamara Suden',
  title: 'E. Palo Alto, CA',
}, {
  name: 'Fernando Mendoza',
  title: 'San Francisco, CA',
}, {
  name: 'Filip Francetic',
  title: 'San Francisco, CA',
}, {
  name: 'Andrew Roy Chen',
  title: 'San Francisco, CA',
}, {
  name: 'Alex Gaensler',
  title: 'New York, NY',
}, {
  name: 'Eric Olivera',
  title: 'San Francisco, CA',
}, {
  name: 'Emily Hittle',
  title: 'San Francisco, CA',
}, {
  name: 'Mikel Duffy',
  title: 'San Francisco, CA',
}, {
  name: 'Robin Braverman',
  title: 'Walnut Creek, CA',
}, {
  name: 'Grant Michael Palmer',
  title: 'Oakland, CA',
}, {
  name: 'Alexandra Deas',
  title: 'San Mateo, CA',
}, {
  name: 'Mario A. Rodríguez Jaén',
  title: 'Alexandria, VA',
}, {
  name: 'Mike McConnell',
  title: 'San Francisco, CA',
}, {
  name: 'Niyati Kothari',
  title: 'Alpharetta, GA',
}, {
  name: 'Zak Zaidman',
  title: 'Ojai, CA',
}, {
  name: 'Debra Cleaver',
  title: 'San Francisco, CA',
}, {
  name: 'William Winters',
  title: 'Oakland, CA',
}, {
  name: 'Anat Shenker-Osorio',
  title: 'Oakland, CA',
}, {
  name: 'Olivia Drummond',
  title: 'Washington, DC',
}, {
  name: 'Steve Cohen',
  title: 'Berkeley, CA',
}, {
  name: 'Kad Smith',
  title: 'Berkeley, CA',
}, {
  name: 'Courtney Gonzales',
  title: 'Benicia, CA',
}, {
  name: 'Jenna Haywood',
  title: 'Berkeley, CA',
}, {
  name: 'Jayadev Akkiraju',
  title: 'Santa Clara, CA',
}, {
  name: 'Raphael Merx',
  title: 'San Francisco, CA',
}, {
  name: 'Susan Clark',
  title: 'Oakland, CA',
}, {
  name: 'Kim Anderson',
  title: 'San Francisco, CA',
}, {
  name: 'Betsy Neely Sikma',
  title: 'Taylors, SC',
}, {
  name: 'Keith Underwood',
  title: 'Alameda, CA',
}, {
  name: 'Marlene Flores',
  title: 'San Francisco, CA',
}, {
  name: 'Jesse Aldridge',
  title: 'San Francisco, CA',
}, {
  name: 'Josh Levinger',
  title: 'Oakland, CA',
}, {
  name: 'Chi Lu',
  title: 'San Francisco, CA',
}, {
  name: 'Leslie Castellanos',
  title: 'San Francisco, CA',
}, {
  name: 'Miguel Elasmar',
  title: 'Sarasota, FL',
}, {
  name: 'Cindy Cruz',
  title: 'Daly City, CA',
}, {
  name: 'Nicole Shanahan',
  title: 'Palo Alto, CA',
}, {
  name: 'Steve Whetstone',
  title: 'San Francisco, CA',
}, {
  name: 'Brian Bordley',
  title: 'Berkeley, CA',
}, {
  name: 'Marcus Busby',
  title: 'San Francisco, CA',
}, {
  name: 'lulu',
  title: 'New York, NY',
}, {
  name: 'Chris Griffith',
  title: 'Santa Cruz, CA',
}, {
  name: 'Nathan Stankowski',
  title: 'San Rafael, CA',
}, {
  name: 'Sean McMahon',
  title: 'Redwood City, CA',
}, {
  name: 'Scott Wasserman',
  title: 'Philadelphia, PA',
}, {
  name: 'Adrienne Yang',
  title: 'Oakland, CA',
}, {
  name: 'Mark Rosenthal',
  title: 'Oakland, CA',
},
];
