// Demo data for the SupporterLanding "Choose Jane Dough" experience.
// This is placeholder content only, so the page can be previewed without being wired
// up to the API / stores. Swap these values for live data when the feature is built out.
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Confetti palette shared by the Step 3 / Step 4 celebrations.
export const CONFETTI_COLORS = [
  DesignTokenColors.primary600,
  DesignTokenColors.caution800,
  DesignTokenColors.confirmation700,
  DesignTokenColors.accent500,
];

export const SUPPORTER_LANDING_STEPS = [
  {
    stepNumber: 1, label: 'Choose', labelChosen: 'Chosen & following!', footerPrompt: 'I’ll decide later', footerLinkText: 'Go to Step 2',
  },
  {
    stepNumber: 2, label: 'Share opinion', labelChosen: 'Opinion shared!', footerPrompt: 'I’ll share my opinion later', footerLinkText: 'Go to Step 3',
  },
  {
    stepNumber: 3, label: 'Make public', labelChosen: 'Made public!', footerPrompt: 'I’ll make my support public later', footerLinkText: 'Go to Step 4',
  },
  { stepNumber: 4, label: 'Spread the word', labelChosen: 'Word spread!' },
];

export const DEMO_VOTER = {
  firstName: 'David',
};

export const DEMO_CANDIDATE = {
  name: 'Jane Dough',
  firstName: 'Jane',
  party: 'Independent',
  officeDescription: "Candidate for U.S. Representative, California's 11th congressional district",
  learnMoreUrl: '/jane-dough/-/',
  personalMessage: "Hi David, I'm so glad you're here. Having your support means the world to me and this campaign. Together we can make a real difference for our community.",
  personalMessagePreview: "Hi David, I'm so glad you're here. Having your...",
};

export const DEMO_COUNTS = {
  chosenCount: 143,
  followingCount: 2341,
};

// Step 2 — "Share why you're supporting Jane Dough"
export const STEP_TWO = {
  title: 'Share why you’re supporting Jane Dough',
  titleMobile: 'Why you’re supporting Jane Dough',
  why: 'Convinces others',
  placeholder: 'Why I’m voting for Jane...',
};

// Step 3 — "Make your support public"
export const STEP_THREE = {
  title: 'Make your support public',
  titlePublic: 'Your support is public!',
  why: 'Influences more people',
  body: 'By default, your choice and opinion for a candidate are visible to your WeVote Friends only. Making them public will influence more people to vote for Jane Dough.',
  buttonLabel: 'Make support public',
  buttonLabelPublic: 'Support made public',
  nameHeading: 'By the way, we didn’t catch your name!',
  nameText: 'Let others know your name to make your choice and opinion public. This builds trust and shows you’re a real voter.',
  nameError: 'Let us know your name to make your support public!',
  firstNamePlaceholder: 'First name',
  lastNamePlaceholder: 'Last name',
  visibilityLabel: 'Visibility of opinion & choice for Jane Dough',
};

// Demo: the voter has no name on file yet, so Step 3 shows the name-entry form.
export const DEMO_VOTER_HAS_NAME = false;

// Step 4 — "Spread the word about Jane Dough"
export const STEP_FOUR = {
  kickerSuffix: ' – FINAL STEP!',
  title: 'Spread the word about Jane Dough',
  titleComplete: 'Word spread!',
  why: 'Multiplies your impact',
  body: 'Invite your friends to WeVote to help Jane Dough get elected.',
  previewEditLabel: 'Preview/Edit invitation',
  completeHeading: 'Thanks for helping Jane Dough get elected!',
  whatElseHeading: 'What else you can do:',
};

// Share options, grouped into cards. `flex` weights each card's width on desktop so the
// longer labels get enough room to wrap to at most 2 lines.
export const SHARE_OPTION_GROUPS = [
  { key: 'contacts', flex: 1, options: [{ key: 'contacts', label: 'Share with contacts', icon: 'people' }]},
  {
    key: 'copy',
    flex: 2.6,
    options: [
      { key: 'copyInvite', label: 'Copy invitation & link', icon: 'copy' },
      { key: 'copyLink', label: 'Copy link', icon: 'link' },
    ],
  },
  { key: 'qr', flex: 1, options: [{ key: 'qr', label: 'Share with QR code', icon: 'qr' }]},
  {
    key: 'social',
    flex: 1.7,
    options: [
      { key: 'facebook', label: 'Facebook', icon: 'facebook', brand: 'facebook' },
      { key: 'x', label: 'X', icon: 'x', brand: 'x' },
    ],
  },
];

// "What else you can do" list shown once Step 4 is complete.
export const WHAT_ELSE_ITEMS = [
  {
    key: 'profile',
    text: 'Complete your profile - to build trust and show you’re a real voter:',
    links: [{ label: 'Add your name and photo', to: '/settings/profile' }],
  },
  {
    key: 'explore',
    text: 'Check out more of WeVote:',
    links: [
      { label: 'WeVote Home', to: '/ready' },
      { label: 'How WeVote works', to: '/how-it-works' },
      { label: 'Your ballot', to: '/ballot' },
      { label: 'Candidates', to: '/candidates' },
    ],
  },
];

export const DEMO_COMMENTS = [
  {
    id: 'comment-1',
    authorName: 'John Dough',
    likeCount: 149,
    text: 'We are proud to endorse this group of proven leaders and advocates for reelection this year.',
    meta: 'Endorsed a year ago (visible to public)',
  },
  {
    id: 'comment-2',
    authorName: 'John Dough',
    likeCount: 149,
    text: 'We are proud to endorse this group of proven leaders and advocates for reelection this year.',
    meta: 'Endorsed a year ago (visible to public)',
  },
];
