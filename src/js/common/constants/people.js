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
  link: 'https://aws.amazon.com/',
  logo: `${logoPath}aws-logo.png`,
}, {
  alt: 'Atlassian',
  name: '',
  title: 'Agile Project Management',
  link: 'https://www.atlassian.com/software/jira',
  logo: `${logoPath}atlassian-logo.png`,
}, {
  alt: 'Ballotpedia',
  name: '',
  title: 'Ballot Data',
  link: 'https://ballotpedia.org/API-documentation/faq',
  logo: `${logoPath}ballotpedia-logo.png`,
}, {
  alt: 'BrowserStack',
  name: '',
  title: 'Cross-Platform Testing',
  link: 'https://www.browserstack.com/',
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
  link: 'https://codeforamerica.org/',
  logo: `${logoPath}cfa-logo.png`,
}, {
  alt: 'DLA Piper',
  name: '',
  title: 'Legal',
  link: 'https://www.dlapiper.com/en-us',
  logo: `${logoPath}dla-piper-logo.png`,
}, {
  alt: 'Facebook',
  name: '',
  title: 'Authentication & Data',
  link: 'https://www.facebook.com/',
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
  link: 'https://developers.google.com/civic-information',
  logo: `${logoPath}google-logo.svg`,
}, {
  alt: 'Greenberg Traurig, LLP',
  name: '',
  title: 'Legal',
  link: 'https://www.gtlaw.com/',
  logo: `${logoPath}gt-logo.png`,
}, {
  alt: 'League of Women Voters',
  name: '',
  title: 'Data',
  link: 'https://www.lwv.org/',
  logo: `${logoPath}league-of-women-logo.png`,
}, {
  alt: 'MapLight',
  name: '',
  title: 'Data',
  link: 'https://www.maplight.org/',
  logo: `${logoPath}maplight-logo.png`,
}, {
  alt: 'Microsoft',
  name: '',
  title: 'For supporting Code for San Francisco',
  link: 'https://www.microsoft.com/',
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
  link: 'https://www.democracy.works/turbovote',
  logo: `${logoPath}turbovote-logo.png`,
}, {
  alt: 'Twilio',
  name: '',
  title: 'Mobile Tech & for supporting nonprofit tech',
  link: 'https://twilio.com',
  logo: `${logoPath}twilio-logo.png`,
}, {
  alt: 'X (Twitter)',
  name: 'X (Twitter)',
  title: 'Authentication & Data',
  link: 'https://twitter.com/',
  logo: `${logoPath}twitter-x-logo.png`,
}, {
  alt: 'Vote Smart',
  name: '',
  title: 'Data',
  link: 'https://justfacts.votesmart.org/',
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
  link: 'https://www.pewtrusts.org/en/',
  logo: `${logoPath}pew-logo.jpeg`,
}, {
  alt: 'We Vote Education',
  name: 'We Vote Education',
  title: 'Data',
  link: 'https://www.wevoteeducation.org/',
  logo: `${logoPath}we-vote-logo.png`,
}, {
  alt: 'Wikipedia',
  name: '',
  title: 'Data',
  link: 'https://en.wikipedia.org/wiki/Elections_in_the_United_States',
  logo: `${logoPath}wikipedia-logo.png`,
},
];

export const teamOfVolunteers = [
  { name: 'Dale McGrew', title: 'Oakland, CA', linkedin: 'https://www.linkedin.com/in/dalemcgrew/' },
  { name: 'Jenifer Fernandez Ancona', title: 'Oakland, CA', linkedin: 'https://www.linkedin.com/in/jenifer-fernandez-ancona-558937b2/' },
  { name: 'Joe Evans', title: 'Santa Cruz, CA', linkedin: '' },
  { name: 'Lawrence Grodeska', title: 'San Rafael, CA', linkedin: 'https://www.linkedin.com/in/grodeska/' },
  { name: 'Steve Podell', title: 'Piedmont, CA', linkedin: 'https://www.linkedin.com/in/spodell/' },
  { name: 'Hannah Capone', title: 'Oakland, CA', linkedin: '' },
  { name: 'Domonic Spaccarotelli', title: 'Emeryville, CA', linkedin: '' },
  { name: 'Uyen (Ashley) Huynh', title: 'San Francisco, CA', linkedin: 'https://www.linkedin.com/in/uyenhuynh99/' },
  { name: 'Amelia Brazil', title: 'CA', linkedin: 'https://www.linkedin.com/in/amelia-brazil-a79b3ab0/' },
  { name: 'Ziwei Yi', title: 'St Louis, MO', linkedin: 'https://www.linkedin.com/in/ziweiyi/' },
  { name: 'Antoinette (Nette) Lee', title: 'Queens, NY', linkedin: 'https://www.linkedin.com/in/antoinettelee/' },
  { name: 'Stanislav Livadnyi', title: 'Brooklyn, NY', linkedin: '' },
  { name: 'Andrea Ortu', title: 'New York, NY', linkedin: '' },
  { name: 'Theodora Wicks', title: 'Berkeley, CA', linkedin: '' },
  { name: 'Trúc Trần', title: 'Garden Grove, CA', linkedin: '' },
  { name: 'Greg Buechler', title: 'San Ramon, CA', linkedin: 'https://www.linkedin.com/in/gbuechler/' },
  { name: 'Sephra Kolker', title: 'Oklahoma City, OK', linkedin: 'https://www.linkedin.com/in/sephra-kolker/' },
  { name: 'Danielle Murphy', title: 'Windham, NH', linkedin: 'http://www.linkedin.com/in/danielle-murphy-9b9728216/' },
  { name: 'Katherine (Kate) Hollingshead', title: 'San Francisco, CA', linkedin: 'https://www.linkedin.com/in/k-hollingshead/' },
  { name: 'Meli Miller', title: 'Evanston, IL', linkedin: 'http://www.linkedin.com/in/meli-miller' },
  { name: 'Kierra Benning', title: 'Appling, GA', linkedin: '' },
  { name: 'R. Scott Vivilecchia', title: 'Bourne, MA', linkedin: '' },
  { name: 'Daniel Cowells', title: 'San Francisco, CA', linkedin: 'https://www.linkedin.com/in/danielcowells/' },
  { name: 'Kiara Tompkins', title: 'Atlanta, GA', linkedin: 'https://www.linkedin.com/in/kntompkins/' },
  { name: 'James Connor', title: 'Bay Area, CA', linkedin: '' },
  { name: 'Eric Chuk', title: 'Oakland, CA', linkedin: 'https://www.linkedin.com/in/eschuk/' },
  { name: 'Ellie Armstrong', title: 'Nashville, TN', linkedin: 'http://www.linkedin.com/in/%20ellie-armstrong-66a6a6268' },
  { name: 'Paul Steketee', title: 'New York, NY', linkedin: 'https://www.linkedin.com/in/paulsteketee/' },
  { name: 'Mara Ramsden', title: 'Pittsburgh, PA', linkedin: 'http://www.linkedin.com/in/mararamsden' },
  { name: 'Kari Kiyono', title: 'San Francisco, CA', linkedin: 'http://www.linkedin.com/in/kari-kiyono-587083b0/' },
  { name: 'Erika De La Rosa', title: 'Los Angeles, CA', linkedin: '' },
  { name: 'Ayumu Ueda', title: 'Santa Clara, CA', linkedin: 'http://www.linkedin.com/in/ayumu-ueda-ab1879224/' },
  { name: 'Tiffany Yeh', title: 'Seattle, WA', linkedin: 'http://www.linkedin.com/in/chihtingyeh/' },
  { name: 'Jaskaran (Dhillon) Dhillon', title: 'Cypress, TX', linkedin: 'http://www.linkedin.com/in/jaskaran-dhillon-534165174' },
  { name: 'Aakriti Sharma', title: 'Wilsonville, OR', linkedin: 'https://www.linkedin.com/in/aakriti-sharma-86b851b/' },
  { name: 'Amelia Badamjav', title: 'Alameda, CA', linkedin: '' },
  { name: 'Deanna "Yvette" Smith', title: 'Benicia, CA', linkedin: 'http://www.linkedin.com/in/d-yvette-smith-shrm-cp-phr-cpsp-60a70575' },
  { name: 'Tarana Verma', title: 'West Windsor, NJ', linkedin: 'https://www.linkedin.com/in/taranaverma/' },
  { name: 'Qi He', title: 'Los Angeles, CA', linkedin: 'NONE' },
  { name: 'Randy Wurster', title: 'Boston, MA', linkedin: 'http://www.linkedin.com/in/randy-wurster-video' },
  { name: 'Richard Wang', title: 'Cupertino, CA', linkedin: 'http://www.linkedin.com/in/richard-wang-10890225a' },
  { name: 'Alexis Scott', title: 'Tulsa, OK', linkedin: '' },
  { name: 'Victoria Dvorak', title: 'Richmond, CA', linkedin: 'https://www.linkedin.com/in/victoria-dvorak-86b4406b/' },
  { name: 'Shayan Budhwani', title: 'Birmingham, AL', linkedin: 'https://www.linkedin.com/in/shayanbudhwani/' },
  { name: 'Nicole Albanese', title: 'Valley Stream, NY', linkedin: 'https://www.linkedin.com/in/nmalbanese1/' },
  { name: 'Sapna Bindra', title: 'Blacksburg, VA', linkedin: 'http://www.linkedin.com/in/sapna-bindra-a61631a2' },
  { name: 'Michael Gutterman', title: 'NJ', linkedin: 'http://www.linkedin.com/in/michael-gutterman-3272051a2' },
  { name: 'Amanda Marciano Crossen', title: 'Jupiter, FL', linkedin: 'https://www.linkedin.com/in/amanda-marciano-crossen-33ab6921/' },
  { name: 'Matt Stilwell', title: 'Iowa City, IA', linkedin: 'http://www.linkedin.com/in/matt-stilwell-2954902' },
  { name: 'Nikolina Djogova', title: 'Lapeer, MI', linkedin: '' },
  { name: 'Yash Niranjan Hemmady', title: 'Chicago, IL', linkedin: 'http://www.linkedin.com/in/yash-hemmady' },
  { name: 'Deborah ("Debb") Lample', title: 'Gurnee, IL', linkedin: 'https://www.linkedin.com/in/debblample/' },
  { name: 'Mary Stanton', title: 'Chicago, IL', linkedin: 'http://www.linkedin.com/in/marystantondesign' },
  { name: 'Jade Campos', title: 'Anaheim, CA', linkedin: 'https://www.linkedin.com/in/jadekrystlec/' },
  { name: 'Aileen Blomdal', title: 'Belmont, CA', linkedin: 'http://www.linkedin.com/in/arblom/' },
  { name: 'Ama Ayeh', title: 'NJ', linkedin: 'http://www.linkedin.com/in/ama-a-ayeh/' },
  { name: 'Bryan Craver', title: 'San Diego, CA', linkedin: 'http://www.linkedin.com/in/craver' },
  { name: 'Spencer Tang', title: 'Los Altos, CA', linkedin: 'https://www.linkedin.com/in/spencer-tang-886a0b157/' },
  { name: 'Praveen Rao', title: 'San Francisco, CA', linkedin: 'http://www.linkedin.com/in/raopraveen' },
  { name: 'Ayaana Fatima Syeda', title: 'Hempstead, NY', linkedin: 'http://www.linkedin.com/in/%20ayaana-syeda-369552274' },
  { name: 'Andrea Ortu', title: 'New York, NY', linkedin: 'https://www.linkedin.com/in/aortu/' },
  { name: 'Jeanne Dansereau', title: 'Bronx, NY', linkedin: 'https://www.linkedin.com/in/jeannedansereau/' },
  { name: 'James Schmidt', title: 'Wayne County, MI', linkedin: 'http://www.linkedin.com/in/schmidtta' },
  { name: 'Ivan Kordonets', title: 'Dayton, OH', linkedin: 'http://www.linkedin.com/in/ivanko22' },
  { name: 'Karen Bazzle', title: 'Mesa, AZ', linkedin: '' },
  { name: 'Amairani Roman', title: 'Novato, CA', linkedin: 'http://www.linkedin.com/in/amairani-roman' },
  { name: 'Bianca Rogen', title: 'Tampa, FL', linkedin: 'https://linkedin.com/in/biancarogen' },
  { name: 'Christina Hall', title: 'Grovetown, GA', linkedin: 'https://www.linkedin.com/in/christina-h-05361b25b/' },
  { name: 'Carson Barnes', title: 'Athens, GA', linkedin: 'https://www.linkedin.com/in/cb019803/' },
  { name: 'Alex Brandt', title: 'Charlotte, NC', linkedin: 'http://www.linkedin.com/in/alex-brandt-a12a39277/' },
  { name: 'Gary Tessler', title: 'San Ramon, CA', linkedin: 'https://www.linkedin.com/in/garytessler/' },
  { name: 'Andy Kleindienst', title: 'Durham, NC', linkedin: 'http://www.linkedin.com/in/andy-kleindienst' },
  { name: 'April Lewis', title: 'GA', linkedin: 'https://www.linkedin.com/in/alewisga/' },
  { name: 'Yasamin "Yasi" Rokni', title: 'Irvine, CA', linkedin: 'https://www.linkedin.com/in/yasamin-roknifard-342671a0/' },
  { name: 'Anu Priya Govindarajan', title: 'Cary, NC', linkedin: 'https://www.linkedin.com/in/anu-priya-govindarajan-29506877/' },
  { name: 'Shefali Kumar', title: 'Pickerington, OH', linkedin: 'https://www.linkedin.com/in/shefali-kumar-a77806187/' },
  { name: 'Eyal Tal', title: 'Carmichael, CA', linkedin: 'http://www.linkedin.com/in/eyal-tal' },
  { name: 'Uriel Olguin', title: 'Houston, TX', linkedin: 'http://www.linkedin.com/in/urielolguin' },
  { name: 'Suniul (Sunny) Karim', title: 'Irvine, CA', linkedin: 'https://www.linkedin.com/in/suniul/' },
  { name: 'Gary Tessler', title: 'San Ramon, CA', linkedin: 'https://www.linkedin.com/in/garytessler/' },
  { name: 'Taylor Pedley', title: 'Phoenix, AZ', linkedin: 'https://www.linkedin.com/in/taylor-pedley/' },
  { name: 'Yumna Malik Usmani', title: 'Roseville, CA', linkedin: 'https://www.linkedin.com/in/yumna-m-usmani-78054b29/' },
  { name: 'Sam Toles', title: 'Ft. Lauderdale, FL', linkedin: 'https://www.linkedin.com/in/samtoles1' },
  { name: 'Zandra Drysdale', title: 'Los Angeles, CA', linkedin: 'https://www.linkedin.com/in/zandradrysdale/' },
  { name: 'Michiko Pesulima', title: 'Santa Rosa, CA', linkedin: 'http://www.linkedin.com/in/michiko-pesulima-9a17a5249/' },
  { name: 'Salina Temesghen', title: 'Lorton, VA', linkedin: 'https://www.linkedin.com/in/salina-temesghen-066825122/' },
  { name: 'Fadwah Majid', title: 'Stockton, CA', linkedin: 'https://www.linkedin.com/in/fadwahmajid/' },
  { name: 'Patrick Gorham', title: 'Fremont, CA', linkedin: 'http://www.linkedin.com/in/patrick-gorham/' },
  { name: 'Eugenia Matkhur', title: 'Spring, TX', linkedin: 'https://www.linkedin.com/in/eugenia-matkhur/' },
  { name: 'Renee Lin', title: 'Seattle, WA', linkedin: 'https://www.linkedin.com/in/renee-lin/' },
  { name: 'Troy Johnson', title: 'Concord, CA', linkedin: 'https://www.linkedin.com/in/garthjohnson' },
  { name: 'Jeffrey "Jeff" Loibl', title: 'Chicago, IL', linkedin: 'https://www.linkedin.com/in/jeffloibl/' }];
