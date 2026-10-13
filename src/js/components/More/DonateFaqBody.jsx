import { ContentCopy } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import AppObservableStore from '../../common/stores/AppObservableStore';

// Utility function to create safe IDs from question text
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Generate a base slug for IDs
function FaqItem ({ question, children }) {
  const base = slugify(question) || 'faq';
  const summaryId = `faq-summary-${base}`;
  const panelId = `faq-panel-${base}`;

  // Optional: ensure Space always toggles
  const onSummaryKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); e.currentTarget.click(); }
  };

  return (
    <Details>
      <Summary id={summaryId} aria-controls={panelId} onKeyDown={onSummaryKeyDown}>
        <span>{question}</span>
        <Chevron aria-hidden>▾</Chevron>
      </Summary>
      <div id={panelId} className="content" role="region" aria-labelledby={summaryId}>
        {children}
      </div>
    </Details>
  );
}

// Turn a link's href into the text we hand to the clipboard: email addresses without the
// mailto: scheme, and site-relative paths expanded to a full URL someone can paste anywhere.
function textForClipboard (href) {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length);
  if (href.startsWith('/')) return `${AppObservableStore.getWeVoteRootURL()}${href}`;
  return href;
}

// Links in this FAQ copy their destination to the clipboard instead of navigating away,
// so donors can paste an address into email, a brokerage form, or their DAF provider.
// Links that should still navigate (the Contact Form) use StyledLink directly instead.
function CopyLink ({ children, href }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);
  const copyText = textForClipboard(href);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const onCopyClick = (event) => {
    event.preventDefault();
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <CopyStyledLink
      href={href}
      onClick={onCopyClick}
      title={`Copy ${copyText}`}
      aria-label={`Copy to clipboard: ${copyText}`}
    >
      {children}
      <CopyIconWrapper aria-hidden>
        <ContentCopy />
      </CopyIconWrapper>
      <CopiedNote role="status">{copied ? 'Copied!' : ''}</CopiedNote>
    </CopyStyledLink>
  );
}

// The body of the Donation FAQ, shared by the DonateFaq page and DonateFaqModal.
// Pass hideTitle when the surrounding container already shows a title, as the modal does.
function DonateFaqBody ({ compactSpacing, hideTitle }) {
  return (
    <StyledFaq compactSpacing={compactSpacing}>
      {!hideTitle && (
        <h1>WeVote Donation FAQ</h1>
      )}

      <h2>About WeVote</h2>

      <FaqItem question="What is WeVote?">
        <p>
          WeVote is a nonpartisan, nonprofit organization committed to empowering informed participation in democracy. Through innovative technology, trusted data, and collaborative partnerships, we help people vote their values and engage meaningfully in civic life. We Vote is where you view your ballot, see endorsements from your network for all candidates and measures, and collaborate with folks who share your values.
        </p>
        <p>
          We Vote is a volunteer-driven movement. We rely on volunteers across the country who use their engineering, design, and other skills to build WeVote. We are over 800 people who have donated 50,000+ volunteer hours, including 100+ contributors on GitHub.
        </p>
        <p>
          See:
          {' '}
          <CopyLink href="/more/faq">
            FAQ
          </CopyLink>
          {' '}
          and
          {' '}
          <CopyLink href="/hc/en-us">
            Help Center
          </CopyLink>
        </p>
      </FaqItem>

      <FaqItem question="Is WeVote a nonprofit organization?">
        <p>
          Yes. WeVote is a collaboration between two nonprofits
          {' '}
          <CopyLink href="https://www.wevoteeducation.org">
            www.WeVoteEducation.org
          </CopyLink>
          {' '}
          - 501(c)(3) FEIN 47-2691544 and
          {' '}
          <CopyLink href="https://wevoteusa.org">
            WeVoteUSA.org
          </CopyLink>

          {' '}
          - 501(c)(4) FEIN 81-1052585, both based in Oakland, CA. We do not support or oppose any political candidate or party. We are not affiliated with WeVoteProject.org or WeVoteUSA.com. All 501(c)(3) donations made on this site are tax-deductible to the fullest extent allowed by U.S. law.
        </p>
      </FaqItem>

      <FaqItem question="What is the difference between a 501(c)(3) and a 501(c)(4) nonprofit?">
        <p>
          A 501(c)(3) nonprofit is organized for charitable, religious, educational, or scientific purposes. Contributions to 501(c)(3) organizations are tax-deductible, which means donors can generally deduct their gifts on their federal tax returns. These organizations are limited in how much lobbying they can do and are prohibited from supporting or opposing political candidates.
        </p>
        <p>
          A 501(c)(4) nonprofit is organized to promote social welfare or community benefit. Contributions to 501(c)(4) organizations are not tax-deductible. Unlike 501(c)(3)s, they can engage in unlimited lobbying and some political activities, as long as political work is not their primary purpose.
        </p>
        <p>
          In short:
          <br />
          • 501(c)(3): Tax-deductible donations; primarily charitable; limited lobbying; no political campaigns.
          <br />
          • 501(c)(4): Not tax-deductible; primarily social welfare; can lobby freely; may engage in some political activity.
        </p>
      </FaqItem>

      <FaqItem question="Is WeVote affiliated with a political party?">
        <p>No. WeVote is completely nonpartisan. We do not support or oppose any political candidate or party.</p>
      </FaqItem>

      <FaqItem question="How does WeVote work?">
        <p>
          We Vote is a nonprofit technology startup, creating a digital voter guide informed by issues you care about, and people you trust. Through our nonpartisan, open source platform, we&apos;ll help you become a better voter, up and down the ballot.
        </p>
        <p>
          We have a mobile-ready website, as well as
          {' '}
          <CopyLink href="https://apps.apple.com/us/app/we-vote-voter-guide/id1347335726">
            iPhone
          </CopyLink>
          {' '}
          and
          {' '}
          <CopyLink href="https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US">
            Android
          </CopyLink>
          {' '}
          apps. We are free and open source:
          {' '}
          <CopyLink href="https://github.com/WeVote">
            https://github.com/WeVote
          </CopyLink>
          . Through this site, you can follow people and groups you trust to get info on candidates and ballot measures. Ask your friends what they think. Then take WeVote with you to the polls for an easy-to-use cheat sheet.
        </p>
      </FaqItem>

      <h2>Giving to WeVote</h2>

      <FaqItem question="Why should I donate to WeVote?">
        <p>
          Your donation directly supports voter education, access to nonpartisan ballot guides, and technology that supports our work to help millions of voters make informed decisions. We believe democracy works best when everyone can participate with confidence and clarity.
        </p>
      </FaqItem>

      <FaqItem question="What impact does my donation have?">
        <p>Every donation—big or small—makes a difference. For example, with your gift:</p>
        <ul>
          <li>$1 can empower 1 voter with their ballot recommendations, up-and-down the ballot.</li>
          <li>With every $50, we can introduce 500 new voters to WeVote.</li>
          <li>With every $100, we can collect candidate data for 50 candidates.</li>
          <li>Every $250 will power our digital infrastructure for 1 week.</li>
          <li>With every $500, our website remains online for 1 week.</li>
        </ul>
      </FaqItem>

      <FaqItem question="Can I make an anonymous donation?">
        <p>
          Yes. WeVote will not publicly acknowledge your gift without your consent. If you would like your donation to remain anonymous, or withdraw your consent at any time, please email us.
        </p>
      </FaqItem>

      <FaqItem question="How can I make a gift?">
        <ul>
          <li>
            Online: Visit
            {' '}
            <CopyLink href="https://wevote.us/donate">
              wevote.us/donate
            </CopyLink>
          </li>
          <li>P2P Payment Platforms (fees may be collected): Venmo, PayPal, CashApp, Zelle</li>
          <li>
            By Mail: Send a check to:
            <br />
            WeVote, 1440 Broadway Ste 200, #158, Oakland, CA 94612
          </li>
          <li>By Phone: Not available at this time</li>
          <li>
            By Email:
            {' '}
            <CopyLink href="mailto:info@wevote.us">
              info@wevote.us
            </CopyLink>
          </li>
          <li>Other Methods: See below for stock, donor-advised fund, and wire transfer options.</li>
        </ul>
      </FaqItem>

      <FaqItem question="Is there a limit to how much I can donate?">
        <p>
          No, there are no legal limits on how much you can donate to WeVote, since we are a 501(c)(3) nonprofit. However, donations above certain thresholds may have tax reporting implications—please consult your tax advisor for details.
        </p>
      </FaqItem>

      <FaqItem question="Can I make a recurring donation?">
        <p>Yes! You can choose to make your gift monthly or annually when donating online. Recurring donations are especially helpful because they help cover our ongoing costs.</p>
      </FaqItem>

      <FaqItem question="Can I update or cancel my recurring donation?">
        <p>
          Yes! You can update the amount of your donation, payment method, or cancel your recurring donation at any time. Please
          {' '}
          <CopyLink href="https://help.wevote.us/hc/en-us/requests/new">
            use our Contact Us form
          </CopyLink>
          {' '}
          if you have any questions.
        </p>
      </FaqItem>

      <FaqItem question="Is my online donation secure?">
        <p>
          Yes. We use a secure donation platform (Donorbox) that encrypts and protects your payment information. No credit card information is ever stored on Donorbox servers, and no card information is ever shared with third parties other than the payment processors you choose to link. All card and bank account data are tokenized (each number is changed to an indecipherable string, i.e. &apos;tok_fafds23423&apos;) before cards are charged. We do not store any sensitive financial data. See Donorbox Security Statement.
        </p>
      </FaqItem>

      <FaqItem question="Can I donate in honor or in memory of someone?">
        <p>Absolutely. You’ll have the option to dedicate your donation during the online giving process.</p>
      </FaqItem>

      <FaqItem question="Is my donation confidential?">
        <p>
          WeVote complies with all national and state laws regarding donor reporting to tax authorities. If you have specific questions about donor disclosure or tax reporting, we recommend reviewing IRS guidelines or consulting a qualified tax professional.
        </p>
      </FaqItem>

      <FaqItem question="How are my donations acknowledged?">
        <p>
          We provide an acknowledgment for every donation we receive. If you give online, you will receive an email receipt confirming your gift shortly after your transaction is completed. For donations made by check, stock, or other methods, we will mail or email you an acknowledgment letter once your contribution has been processed.
        </p>
        <p>
          Your receipt will include our organization’s tax identification number and the details you need for your records. If you make a recurring donation, you’ll also receive an annual statement summarizing your contributions for tax purposes.
        </p>
        <p>If you ever need a duplicate receipt or have questions about your donation history, please contact us—we’re happy to help!</p>
      </FaqItem>

      <FaqItem question="Are donations close to Election Day still helpful?">
        <p>
          Yes! While early, year-round, and multi-year funding is always best, donations in the months, weeks, and days before Election Day are still enormously impactful. They help us respond to real-time voter needs, update local ballot information, and scale outreach at a critical moment.
        </p>
      </FaqItem>

      <FaqItem question="Can I direct my donation to a specific group, state, or area of focus?">
        <p>
          At this time, donations to WeVote support our national mission and are not restricted to specific regions or causes. However, our tools serve voters in all 50 states, and your gift helps maintain our nationwide platform.
        </p>
      </FaqItem>

      <FaqItem question="Are there fees deducted from my donation?">
        <p>
          It depends on which platform you choose to make your donation. For example: a small processing fee (usually around 2–3%) is deducted by our donation platform to securely handle the transaction.
        </p>
      </FaqItem>

      <h2>Tax & Receipts</h2>

      <FaqItem question="Are donations tax-deductible?">
        <p>
          Yes, all donations to WeVote are directed to the 501(c)(3) nonprofit and are tax-deductible within the limits of U.S. law. Please see below for more details.
        </p>
        <p>
          🟢 Donations to WeVote&apos;s 501(c)(3) fund (
          <CopyLink href="https://www.wevoteeducation.org">
            www.WeVoteEducation.org
          </CopyLink>
          ) are tax-deductible to the extent allowed by U.S. law. These gifts support our nonpartisan voter education, outreach, and research efforts. FEIN: 47-2691544
        </p>
        <p>
          🔵 Donations to WeVote&apos;s 501(c)(4) fund (
          <CopyLink href="https://www.wevoteusa.org">
            WeVoteUSA.org
          </CopyLink>
          ) are not tax-deductible, as they support our non-charitable work. FEIN: 81-1052585
        </p>
      </FaqItem>

      <FaqItem question="Can I make a donation to WeVote&apos;s 501(c)(4)? Will I receive a receipt?">
        <p>
          Yes. You&apos;ll receive a receipt via email for online donations. If you need a duplicate or paper copy, please contact us at
          {' '}
          <CopyLink href="mailto:info@wevote.us">
            info@wevote.us
          </CopyLink>
          .
        </p>
      </FaqItem>

      <FaqItem question="How quickly will my donation be processed?">
        <p>Online donations are processed immediately. Other forms of giving may take up to a week to be confirmed and acknowledged.</p>
      </FaqItem>

      <h2>Employer &amp; Matching Gifts</h2>

      <FaqItem question="Can my company match my donation?">
        <p>
          Many employers offer matching gift programs, which are corporate initiatives that match employee donations to eligible nonprofits, effectively doubling or even tripling your impact at no additional cost to you. These programs are often administered through HR or Benefits departments and may match one-time gifts, recurring donations, or even volunteer hours.
        </p>
        <p>
          To learn more, and find out if your employer participates, you can search directly using this
          {' '}
          <CopyLink href="https://www.charitynavigator.org/donor-basics/giving-101/employee-match-programs/">
            Employee Match Program Lookup Tool from Charity Navigator
          </CopyLink>
          .
        </p>
        <p>
          If your company does participate and needs WeVote&apos;s nonprofit details to process the match, we&apos;re happy to provide that information — just email
          {' '}
          <CopyLink href="mailto:info@wevote.us">
            info@wevote.us
          </CopyLink>
          {' '}
          for more information.
        </p>
      </FaqItem>

      <h2>Other Ways to Give</h2>

      <FaqItem question="Can I donate stock or securities?">
        <p>
          To initiate a stock donation, please email us at
          {' '}
          <CopyLink href="mailto:info@wevote.us">
            info@wevote.us
          </CopyLink>
          {' '}
          for assistance or to request our brokerage information. WeVote will provide a donation receipt based on the number and type of shares received, but please note that the fair market value, and any potential tax deduction, should be determined by the donor in consultation with a financial advisor, stockbroker, or accountant.
        </p>
      </FaqItem>

      <FaqItem question="Can I give through a Donor-Advised Fund (DAF)?">
        <p>
          Yes. We gratefully accept contributions through Fidelity Charitable, Schwab Charitable, BNY Mellon, Vanguard Charitable, and most other DAF providers. You can initiate a disbursement directly from your DAF by designating WeVote as the recipient using our EIN: 47-2691544. If your fund provider requires additional information to process the donation, please feel free to email us at
          {' '}
          <CopyLink href="mailto:info@wevote.us">
            info@wevote.us
          </CopyLink>
          , we’re happy to assist.
        </p>
        <p>
          Please note that donations made through a DAF typically may not carry an associated benefit or fair market value, as per IRS guidelines. While we will provide a written acknowledgment of the gift, the tax deduction is generally claimed at the time you contribute to the DAF, not when the DAF makes the grant to WeVote. For tax receipt purposes, please contact your DAF.
        </p>
      </FaqItem>

      <FaqItem question="Can I make a gift through an IRA charitable rollover?">
        <p>
          If you&apos;re 70½ or older, you may be eligible to make a qualified charitable distribution directly from your IRA. Contact your financial advisor to get started, and let us know so we can properly acknowledge your gift.
        </p>
      </FaqItem>

      <FaqItem question="Can I donate via wire transfer?">
        <p>
          Yes. Please email us at
          {' '}
          <CopyLink href="mailto:info@wevote.us">
            info@wevote.us
          </CopyLink>
          {' '}
          to receive our wire transfer information.
        </p>
      </FaqItem>

      <FaqItem question="I can’t make a financial donation right now. How else can I support WeVote?">
        <p>
          There are many ways to help! Share our tools with your network,
          {' '}
          <CopyLink href="https://wevote.applytojob.com/apply/">
            volunteer
          </CopyLink>
          {' '}
          , or
          {' '}
          <CopyLink href="https://eepurl.com/cx_frP">
            sign up for our newsletter
          </CopyLink>
          {' '}
          to stay engaged.
        </p>
      </FaqItem>

      <h2>Need More Help?</h2>
      <p>
        We’re here to help! Please fill out our
        {' '}
        <StyledLink
          href="https://help.wevote.us/hc/en-us/requests/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Form
        </StyledLink>
        , and a member of our team will get back to you promptly.
      </p>
    </StyledFaq>
  );
}
FaqItem.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
CopyLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};
DonateFaqBody.propTypes = {
  compactSpacing: PropTypes.bool,
  hideTitle: PropTypes.bool,
};

export default DonateFaqBody;

const Chevron = styled.span`
  transform: rotate(0deg);
  transition: transform 150ms ease;
  @media (prefers-reduced-motion: reduce) { transition: none; }
  details[open] & { transform: rotate(180deg); }
`;

const Details = styled.details`
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  margin: 0.75rem 0;
  padding: 0;
  transition: border-color 150ms ease;
  &[open] { border-color: ${DesignTokenColors.neutralUI300}; }
  .content { padding: 0 1rem 1rem 1rem; }
`;

const linkFocus = css`
  &:focus-visible {
    outline: 2px solid ${DesignTokenColors.primary500};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Summary = styled.summary`
  list-style: none;
  cursor: pointer;
  user-select: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: space-between;

  &::-webkit-details-marker { display: none; }
  &:hover { background: ${DesignTokenColors.neutralUI50};  }

  &:focus-visible {
    outline: 2px solid ${DesignTokenColors.primary500};
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const StyledFaq = styled('div', {
  shouldForwardProp: (prop) => !['compactSpacing'].includes(prop),
})(({ compactSpacing }) => (`
  max-width: ${compactSpacing ? '100%' : '900px'};
  margin: 0 auto;
  padding: ${compactSpacing ? '0' : '2rem'};

  h1 { font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700; }
  h2 {
    font-size: ${compactSpacing ? '1.35rem' : '2rem'};
    margin-top: ${compactSpacing ? '1.5rem' : '2.5rem'};
    margin-bottom: 1rem;
    border-bottom: 2px solid ${DesignTokenColors.neutralUI200};
    padding-bottom: 0.3rem;
  }
  h2:first-child { margin-top: 0; }
  p { font-size: ${compactSpacing ? '0.95rem' : '1.05rem'}; line-height: 1.6; margin: 1rem 0 0; }
  ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
  li { margin-bottom: ${compactSpacing ? '0.4rem' : '0.5rem'}; line-height: 1.5; font-size: ${compactSpacing ? '0.95rem' : 'inherit'}; }
  ${compactSpacing ? `${Summary} { font-size: 1rem; padding: 0.75rem; }` : ''}
`));

const StyledLink = styled.a`
  color: ${DesignTokenColors.primary600};
  text-decoration: underline;
  &:hover { text-decoration: none; }
  ${linkFocus}
`;

const CopyStyledLink = styled(StyledLink)`
  cursor: copy;
`;

const CopyIconWrapper = styled.span`
  display: inline-flex;
  vertical-align: middle;
  margin-left: 0.25rem;
  svg { font-size: 0.9em; }
`;

// Kept in the DOM (empty until a copy happens) so screen readers announce the live update.
const CopiedNote = styled.span`
  color: ${DesignTokenColors.neutral600};
  font-size: 0.8em;
  &:not(:empty) { margin-left: 0.25rem; }
`;
