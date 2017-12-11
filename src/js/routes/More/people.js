const isNative = false;  // True for Native, false for Webapp, everything below this line is identical for both.

const wrapper = (path) => {
  return isNative ? require(path) : path;
};

const weVoteBoard = [ {
    name: "Jenifer Fernandez Ancona",
    image: wrapper("../../../img/global/photos/Jenifer_Fernandez_Ancona-200x200.jpg"),
    title: [
      "Co-Founder & c4 Board Chair",
      "VP, Strategy & Member Engagement at the Women Donors Network."
    ]
  }, {
    name: "Debra Cleaver",
    image: wrapper("../../../img/global/photos/Debra_Cleaver-200x200.jpg"),
    title: [
      "c3 Board Member",
      "Founder & CEO of VOTE.org, the web\"s most heavily trafficked site for accurate voting information."
    ]
  }, {
    name: "Tiana Epps-Johnson",
    image: wrapper("../../../img/global/photos/Tiana_Epps_Johnson-200x200.jpg"),
    title: [
      "Senior Adviser",
      "Exec. Dir. of CTCL, software for election administrators. Former Voting Info Project Harvard Ash Center for Democratic Governance and Innovation."
    ]
  }, {
    name: "Tory Gavito",
    image: wrapper("../../../img/global/photos/Tory_Gavito-200x200.jpg"),
    title: [
      "c4 Board Member",
      "Exec. Dir. at Texas Future Project."
    ]
  }, {
    name: "Lawrence Grodeska",
    image: wrapper("../../../img/global/photos/Lawrence_Grodeska-200x200.jpg"),
    title: [
      "c3 Board Chair",
      "Civic Tech communications and innovation at CivicMakers. Formerly at Change.org."
    ]
  }, {
    name: "Dale John McGrew",
    image: wrapper("../../../img/global/photos/Dale_McGrew-200x200.jpg"),
    title: [
      "Co-Founder / CTO & c3 + c4 Board Member",
      "Managed large software projects for companies like Disney and over 60 nonprofits."
    ]
  }, {
    name: "Barbara Shannon",
    image: wrapper("../../../img/global/photos/Barbara_Shannon-200x200.jpg"),
    title: [
      "Co-Founder / CTO & c3 + c4 Board Member",
      "Adviser to entrepreneurs and C-level Fortune 500 leaders. MBA The Wharton School."
    ]
  }, {
    name: "Anat Shenker-Osorio",
    image: wrapper("../../../img/global/photos/Anat_Shenker_Osario-200x200.jpg"),
    title: [
      "c4 Board Member",
      "Communications expert, researcher and political pundit."
    ]
  }, {
    name: "Betsy Sikma",
    image: wrapper("../../../img/global/photos/Betsy_Sikma-200x200.jpg"),
    title: [
      "c3 Board Member",
      ""
    ]
  }, {
    name: "Billy Wimsatt",
    image: wrapper("../../../img/global/photos/Billy_Wimsatt-200x200.jpg"),
    title: [
      "Senior Adviser",
      "Author and political activist. Founder of Gamechanger Labs, the League of Young Voters & TheBallot.org."
    ]
  }, {
    name: "William Winters",
    image: wrapper("../../../img/global/photos/William_Winters-200x200.jpg"),
    title: [
      "c4 Board Member",
      "Campaign Manager. Courage Campaign, Color Of Change, CEL & Change.org."
    ]
  }
];

const weVoteStaff = [ {
    name: "Alicia Prevost",
    image: wrapper("../../../img/global/photos/Alicia_Prevost-200x200.jpg"),
    title: [
      "Executive Director",
    ]
  }, {
    name: "Dale John McGrew",
    image: wrapper("../../../img/global/photos/Dale_McGrew-200x200.jpg"),
    title: [
      "Co-Founder / CTO"
    ]
  }, {
    name: "Rohan Bhambhoria",
    image: wrapper("../../../img/global/photos/Rohan_Bhambhoria-200x200.jpg"),
    title: [
      "Engineering Intern"
    ]
  }, {
    name: "Yuanhsin Chang",
    image: wrapper("../../../img/global/photos/Yuanhsin_Chang-200x200.jpg"),
    title: [
      "User Experience Design Intern"
    ]
  }, {
    name: "Sarah Clements",
    image: wrapper("../../../img/global/photos/Sarah_Clements-200x200.jpg"),
    title: [
      "Engineering Intern"
    ]
  }, {
    name: "Mansi Desai",
    image: wrapper("../../../img/global/photos/Mansi_Desai-200x200.jpg"),
    title: [
      "Digital Marketing Intern"
    ]
  }, {
    name: "Neil Dullaghan",
    image: wrapper("../../../img/global/photos/Neil_Dullaghan-200x200.jpg"),
    title: [
      "Political Data Manager"
    ]
  }, {
    name: "Irene Florez",
    image: wrapper("../../../img/global/photos/Irene_Florez-200x200.jpg"),
    title: [
      "Engineering Intern"
    ]
  }, {
    name: "Jeff French",
    image: wrapper("../../../img/global/photos/Jeff_French-200x200.jpg"),
    title: [
      "Lead Designer"
    ]
  }, {
    name: "Anisha Jain",
    image: wrapper("../../../img/global/photos/Anisha_Jain-200x200.jpg"),
    title: [
      "Sr. Software Engineer"
    ]
  }, {
    name: "Judy Johnson",
    image: wrapper("../../../img/global/photos/Judy_Johnson-200x200.jpg"),
    title: [
      "Operations"
    ]
  }, {
    name: "Neelam Joshi",
    image: wrapper("../../../img/global/photos/Neelam_Joshi-200x200.jpg"),
    title: [
      "Sr. Software Engineer"
    ]
  }, {
    name: "Ciero Kilpatrick",
    image: wrapper("../../../img/global/photos/Ciero_Kilpatrick-200x200.jpg"),
    title: [
      "User Experience Design Intern"
    ]
  }, {
    name: "Edward Ly",
    image: wrapper("../../../img/global/photos/Edward_Ly-200x200.jpg"),
    title: [
      "Engineering Intern"
    ]
  }, {
    name: "Eric Ogawa",
    image: wrapper("../../../img/global/photos/Eric_Ogawa-200x200.jpg"),
    title: [
      "User Experience Design Intern"
    ]
  }, {
    name: "Steve Podell",
    image: wrapper("../../../img/global/photos/Steve_Podell-200x200.jpg"),
    title: [
      "Volunteer"
    ]
  }, {
    name: "Bharath Reddy",
    image: wrapper("../../../img/global/photos/Bharath_Reddy-200x200.jpg"),
    title: [
      "Software Engineer"
    ]
  }
];

const organizationalDonors = [ {
    name: "Amazon Web Services",
    title: "Servers",
  }, {
    name: "Ballotpedia",
    title: "Data",
  }, {
    name: "Center for Technology and Civic Life",
    title: "Data",
  }, {
    name: "Change.org",
    title: "Data",
  }, {
    name: "CivicMakers",
    title: "Event Collaborations",
  }, {
    name: "Code for San Francisco & Code for America",
    title: "Our Home for Volunteer Work",
  }, {
    name: "DLA Piper",
    title: "Legal",
  }, {
    name: "Facebook",
    title: "Authentication & Data",
  }, {
    name: "Google Civic",
    title: "Data",
  }, {
    name: "Greenberg Traurig, LLP",
    title: "Legal",
  }, {
    name: "League of Women Voters",
    title: "Data",
  }, {
    name: "MapLight",
    title: "Data",
  }, {
    name: "Microsoft",
    title: "For supporting Code for San Francisco",
  }, {
    name: "Sunlight Foundation",
    title: "Data",
  }, {
    name: "TurboVote, Democracy Works",
    title: "Data",
  }, {
    name: "Twitter",
    title: "Authentication & Data",
  }, {
    name: "Vote Smart",
    title: "Data",
  }, {
    name: "Voting Information Project, Pew Charitable Trusts",
    title: "Data",
  }, {
    name: "We Vote Education",
    title: "Data",
  }, {
    name: "Wikipedia",
    title: "Data",
  }
];

const teamOfVolunteers = [ {
    name: "Dale McGrew",
    title: "Oakland, CA"
  }, {
    name: "Jenifer Fernandez Ancona",
    title: "Oakland, CA",
  }, {
    name: "Anisha Jain",
    title: "San Jose, CA",
  }, {
    name: "Rob Simpson",
    title: "Warrenton, VA",
  }, {
    name: "Jeff French",
    title: "Oakland, CA",
  }, {
    name: "Neelam Joshi",
    title: "Columbus, OH",
  }, {
    name: "Alicia Kolar Prevost",
    title: "Washington, DC",
  }, {
    name: "Steve Podell",
    title: "Oakland, CA",
  }, {
    name: "Bharath D N Reddy",
    title: "Mountain View, CA",
  }, {
    name: "Sarah Clements",
    title: "San Francisco, CA",
  }, {
    name: "Zach Monteith",
    title: "San Francisco, CA",
  }, {
    name: "Lisa Cho",
    title: "San Francisco, CA",
  }, {
    name: "Nicolas Fiorini",
    title: "Arlington, VA",
  }, {
    name: "Colette Phair",
    title: "Oakland, CA",
  }, {
    name: "Jennifer Holmes",
    title: "Pacifica, CA",
  }, {
    name: "Joe Evans",
    title: "Santa Cruz, CA",
  }, {
    name: "Andrea Moed",
    title: "San Francisco, CA",
  }, {
    name: "Matt Holford",
    title: "New York, NY",
  }, {
    name: "Edward Ly",
    title: "Gresham, OR",
  }, {
    name: "YuanHsin Chang",
    title: "San Francisco, CA",
  }, {
    name: "Ciero Kilpatrick",
    title: "Washington, DC",
  }, {
    name: "Eric Ogawa",
    title: "San Francisco, CA",
  }, {
    name: "Mary O\"Connor",
    title: "Sebastopol, CA",
  }, {
    name: "Harsha Dronamraju",
    title: "San Francisco, CA",
  }, {
    name: "Rohan Bhambhoria",
    title: "Mississauga, Ontario, Canada",
  }, {
    name: "Josh Southern",
    title: "San Francisco, CA",
  }, {
    name: "Nitin Garg",
    title: "San Francisco, CA",
  }, {
    name: "Niko Barry",
    title: "Berkeley, CA",
  }, {
    name: "Adam Barry",
    title: "San Francisco, CA",
  }, {
    name: "Marissa Luna",
    title: "Lansing, MI",
  }, {
    name: "Aaron Borden",
    title: "San Francisco, CA",
  }, {
    name: "Judy Johnson",
    title: "Oakland, CA",
  }, {
    name: "Irene Florez",
    title: "San Francisco, CA",
  }, {
    name: "Udi Davidovich",
    title: "Walnut Creek, CA",
  }, {
    name: "Chris Arya",
    title: "San Francisco, CA",
  }, {
    name: "Tom Furlong",
    title: "Menlo Park, CA",
  }, {
    name: "Paul A. \"Dash\" McLean",
    title: "E. Palo Alto, CA",
  }, {
    name: "Mansi Desai",
    title: "San Francisco, CA",
  }, {
    name: "Neil Dullaghan",
    title: "San Francisco, CA",
  }, {
    name: "Eric Olivera",
    title: "San Francisco, CA",
  }, {
    name: "Emily Hittle",
    title: "San Francisco, CA",
  }, {
    name: "Mikel Duffy",
    title: "San Francisco, CA",
  }, {
    name: "Robin Braverman",
    title: "Walnut Creek, CA",
  }, {
    name: "Mike McConnell",
    title: "San Francisco, CA",
  }, {
    name: "Niyati Kothari",
    title: "Alpharetta, GA",
  }, {
    name: "Dan Ancona",
    title: "Oakland, CA",
  }, {
    name: "Zak Zaidman",
    title: "Ojai, CA",
  }, {
    name: "Debra Cleaver",
    title: "San Francisco, CA",
  }, {
    name: "William Winters",
    title: "Oakland, CA",
  }, {
    name: "Anat Shenker-Osorio",
    title: "Oakland, CA",
  }, {
    name: "Kad Smith",
    title: "Berkeley, CA",
  }, {
    name: "Courtney Gonzales",
    title: "Benicia, CA",
  }, {
    name: "Jenna Haywood",
    title: "Berkeley, CA",
  }, {
    name: "Jayadev Akkiraju",
    title: "Santa Clara, CA",
  }, {
    name: "Raphael Merx",
    title: "San Francisco, CA",
  }, {
    name: "Susan Clark",
    title: "Oakland, CA",
  }, {
    name: "Kim Anderson",
    title: "San Francisco, CA",
  }, {
    name: "Betsy Neely Sikma",
    title: "Taylors, SC",
  }, {
    name: "Keith Underwood",
    title: "Alameda, CA",
  }, {
    name: "Marlene Flores",
    title: "San Francisco, CA",
  }, {
    name: "Jesse Aldridge",
    title: "San Francisco, CA",
  }, {
    name: "Josh Levinger",
    title: "Oakland, CA",
  }, {
    name: "Leslie Castellanos",
    title: "San Francisco, CA",
  }, {
    name: "Miguel Elasmar",
    title: "Sarasota, FL",
  }, {
    name: "Cindy Cruz",
    title: "Daly City, CA",
  }, {
    name: "Nicole Shanahan",
    title: "Palo Alto, CA",
  }, {
    name: "Steve Whetstone",
    title: "San Francisco, CA",
  }, {
    name: "Brian Bordley",
    title: "Berkeley, CA",
  }, {
    name: "Marcus Busby",
    title: "San Francisco, CA",
  }, {
    name: "lulu",
    title: "New York, NY",
  }, {
    name: "Chris Griffith",
    title: "Santa Cruz, CA",
  }, {
    name: "Nathan Stankowski",
    title: "San Rafael, CA",
  }, {
    name: "Sean McMahon",
    title: "Redwood City, CA",
  }, {
    name: "Scott Wasserman",
    title: "Philadelphia, PA",
  }, {
    name: "Adrienne Yang",
    title: "Oakland, CA",
  }, {
    name: "Mark Rosenthal",
    title: "Oakland, CA",
  }
];


module.exports = {weVoteBoard, weVoteStaff, organizationalDonors, teamOfVolunteers};
