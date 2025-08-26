import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

function DonateFaq () {
  return (
    <PageContentContainer>
      <Helmet>
        <title>WeVote Donation FAQ</title>
      </Helmet>
      <StyledFaq>
        <h1>WeVote Donation FAQ</h1>

        <h2>About WeVote</h2>

        <h3>What is WeVote?</h3>
        <p>
          WeVote is a nonpartisan, nonprofit organization committed to empowering
          informed participation in democracy. Through innovative technology, trusted
          data, and collaborative partnerships, we help people vote their values and
          engage meaningfully in civic life. We Vote is where you view your ballot, see
          endorsements from your network for all candidates and measures, and
          collaborate with folks who share your values.
        </p>
        <p>
          We Vote is a volunteer-driven movement. We rely on volunteers across the
          country who use their engineering, design, and other skills to build WeVote.
          We are over 100 people who have donated 12,000+ volunteer hours, including
          90+ contributors on GitHub. We also have a small team of core staff and
          volunteer board members. See:
        </p>
        <p>
          See:
          {' '}
          <a
              href="/more/faq"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: DesignTokenColors.primary600 }}
          >
            FAQ
          </a>
          {' '}
          and
          {' '}
          <a
              href="/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: DesignTokenColors.primary600 }}
          >
            Help Center
          </a>
        </p>

        <h3>Is WeVote a nonprofit organization?</h3>
        <p>
          Yes. WeVote is a collaboration between two nonprofits
          {' '}
          <a
              href="https://www.wevoteeducation.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            www.WeVoteEducation.org
          </a>
          {' '}
          - 501(c)(3) FEIN 47-2691544 and
          {' '}
          <a
              href="https://wevoteusa.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            WeVoteUSA.org
          </a>
          {' '}
          - 501(c)(4) FEIN 81-1052585, both based in Oakland, CA. We do not support or
          oppose any political candidate or party. We are not affiliated with
          WeVoteProject.org or WeVoteUSA.com. All donations are tax-deductible to the
          fullest extent allowed by U.S. law.
        </p>

        <h3>What is the difference between a (c)(3) and a (c)(4) nonprofit?</h3>
        <p>
          A 501(c)(3) nonprofit is organized for charitable, religious, educational, or
          scientific purposes. Contributions to 501(c)(3) organizations are
          tax-deductible, which means donors can generally deduct their gifts on their
          federal tax returns. These organizations are limited in how much lobbying
          they can do and are prohibited from supporting or opposing political
          candidates.
        </p>
        <p>
          A 501(c)(4) nonprofit is organized to promote social welfare or community
          benefit. Contributions to 501(c)(4) organizations are not tax-deductible.
          Unlike 501(c)(3)s, they can engage in unlimited lobbying and some political
          activities, as long as political work is not their primary purpose.
        </p>
        <p>
          In short:
          <br />
          • 501(c)(3): Tax-deductible donations; primarily charitable; limited
          lobbying; no political campaigns.
          <br />
          • 501(c)(4): Not tax-deductible; primarily social welfare; can lobby
          freely; may engage in some political activity.
        </p>

        <h3>Is WeVote affiliated with a political party?</h3>
        <p>
          No. WeVote is completely nonpartisan. We do not support or oppose any
          political candidate or party.
        </p>

        <h3>How does WeVote work?</h3>
        <p>
          We Vote is a nonprofit technology startup, creating a digital voter guide
          informed by issues you care about, and people you trust. Through our
          nonpartisan, open source platform, we&apos;ll help you become a better voter,
          up and down the ballot.
        </p>
        <p>
          We have a mobile-ready website, as well as iPhone and Android apps. We are
          free and open source:
          {' '}
          <a
              href="https://github.com/WeVote"
              target="_blank"
              rel="noopener noreferrer"
          >
            https://github.com/WeVote
          </a>
          . Through this site, you can follow people and groups you trust to get info
          on candidates and ballot measures. Ask your friends what they think. Then
          take WeVote with you to the polls for an easy-to-use cheat sheet.
        </p>

        <h2>Giving to WeVote</h2>

        <h3>Why should I donate to WeVote?</h3>
        <p>
          Your donation directly supports voter education, access to nonpartisan ballot
          guides, and technology that supports our work to help millions of voters make
          informed decisions. We believe democracy works best when everyone can
          participate with confidence and clarity.
        </p>

        <h3>What impact does my donation have?</h3>
        <p>Every donation—big or small—makes a difference. For example, with your gift:</p>
        <ul>
          <li>$1 can empower 1 voter with their ballot recommendations, up-and-down the ballot.</li>
          <li>With every $50, we can introduce 500 new voters to WeVote.</li>
          <li>With every $100, we can collect candidate data for 50 candidates.</li>
          <li>Every $250 will power our digital infrastructure for 1 week.</li>
          <li>With every $500, our website remains online for 1 week.</li>
        </ul>

        <h3>Can I make an anonymous donation?</h3>
        <p>
          Yes. WeVote will not publicly acknowledge your gift without your consent. If
          you would like your donation to remain anonymous, or withdraw your consent at
          any time, please email us.
        </p>
        <p>
          Every donation of $600 or more can help cover expenses including: server
          costs ($600 - $2,500 per month), data fees (~$40,000 per year), collaboration
          tools, and other hard costs. In the future, we might hire some key staff with
          donations, for the smooth operation of WeVote. Your support directly powers
          the tools, outreach, and education needed to strengthen democracy.
        </p>

        <h3>How can I make a gift?</h3>
        <ul>
          <li>
            Online: Visit
            {' '}
            <a
                href="https://wevote.us/donate"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: DesignTokenColors.primary600 }}
            >
              wevote.us/donate
            </a>
          </li>
          <li>P2P Payment Platforms (fees may be collected): Venmo, PayPal, CashApp, Zelle</li>
          <li>
            By Mail: Send a check to:
            <br />
            WeVote, 1423 Broadway PMB 158, Oakland, CA 94612
          </li>
          <li>By Phone: Not available at this time</li>
          <li>
            By Email:
            {' '}
            <a href="mailto:info@wevote.us">info@wevote.us</a>
            {' '}
          </li>
          <li>Other Methods: See below for stock, donor-advised fund, and wire transfer options.</li>
        </ul>

        <h3>Is there a limit to how much I can donate?</h3>
        <p>
          No, there are no legal limits on how much you can donate to WeVote, since we
          are a 501(c)(3) nonprofit. However, donations above certain thresholds may
          have tax reporting implications—please consult your tax advisor for details.
        </p>

        <h3>Can I make a recurring donation?</h3>
        <p>
          Yes! You can choose to make your gift monthly or annually when donating
          online. Recurring donations are especially helpful because they help cover
          our ongoing costs.
        </p>

        <h3>Can I update or cancel my recurring donation?</h3>
        <p>
          Yes! You can update the amount of your donation, payment method, or cancel
          your recurring donation at any time.
        </p>

        <h3>Is my online donation secure?</h3>
        <p>
          Yes. We use a secure donation platform (Donorbox) that encrypts and protects
          your payment information. No credit card information is ever stored on
          Donorbox servers, and no card information is ever shared with third parties
          other than the payment processors you choose to link. All card and bank
          account data are tokenized (each number is changed to an indecipherable
          string, i.e. &apos;tok_fafds23423&apos;) before cards are charged. We do not
          store any sensitive financial data. See Donorbox Security Statement.
        </p>

        <h3>Can I donate in honor or in memory of someone?</h3>
        <p>
          Absolutely. You’ll have the option to dedicate your donation during the
          online giving process.
        </p>

        <h3>Is my donation confidential?</h3>
        <p>
          WeVote complies with all national and state laws regarding donor reporting to
          tax authorities. If you have specific questions about donor disclosure or tax
          reporting, we recommend reviewing IRS guidelines or consulting a qualified
          tax professional.
        </p>

        <h3>How are my donations acknowledged?</h3>
        <p>
          We provide an acknowledgment for every donation we receive. If you give
          online, you will receive an email receipt confirming your gift shortly after
          your transaction is completed. For donations made by check, stock, or other
          methods, we will mail or email you an acknowledgment letter once your
          contribution has been processed.
        </p>
        <p>
          Your receipt will include our organization’s tax identification number and
          the details you need for your records. If you make a recurring donation,
          you’ll also receive an annual statement summarizing your contributions for
          tax purposes.
        </p>
        <p>
          If you ever need a duplicate receipt or have questions about your donation
          history, please contact us—we’re happy to help!
        </p>

        <h3>Are donations close to Election Day still helpful?</h3>
        <p>
          Yes! While early, year-round, and multi-year funding is always best, donations
          in the months, weeks, and days before Election Day are still enormously
          impactful. They help us respond to real-time voter needs, update local ballot
          information, and scale outreach at a critical moment.
        </p>

        <h3>Can I direct my donation to a specific group, state, or area of focus?</h3>
        <p>
          At this time, donations to WeVote support our national mission and are not
          restricted to specific regions or causes. However, our tools serve voters in
          all 50 states, and your gift helps maintain our nationwide platform.
        </p>

        <h3>Are there fees deducted from my donation?</h3>
        <p>
          It depends on which platform you choose to make your donation. For example: a
          small processing fee (usually around 2–3%) is deducted by our donation
          platform to securely handle the transaction.
        </p>

        <h2>Tax & Receipts</h2>

        <h3>Are donations tax-deductible?</h3>
        <p>
          Yes, all donations to WeVote are directed to the (c)3 nonprofit and are
          tax-deductible within the limits of U.S. law. Please see below for more
          details.
        </p>

        <p>
          🟢 Donations to WeVote&apos;s 501(c)(3) fund (
          <a
              href="https://www.wevoteeducation.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            www.WeVoteEducation.org
          </a>
          ) are tax-deductible to the extent allowed by U.S. law. These gifts support
          our nonpartisan voter education, outreach, and research efforts. FEIN:
          47-2691544
        </p>

        <p>
          🔵 Donations to WeVote&apos;s 501(c)(4) fund (
          <a
              href="https://www.wevoteusa.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            WeVoteUSA.org
          </a>
          ) are not tax-deductible, as they support our advocacy and lobbying work.
          FEIN: 81-1052585
        </p>

        <h3>Can I make a donation to WeVote&apos;s 501(c)(4)? Will I receive a receipt?</h3>
        <p>
          Yes. You&apos;ll receive a receipt via email for online donations. If you need a
          duplicate or paper copy, please contact us at
          {' '}
          <a href="mailto:info@wevote.us">info@wevote.us</a>
          .
        </p>

        <h3>How quickly will my donation be processed?</h3>
        <p>
          Online donations are processed immediately. Other forms of giving may take up
          to a week to be confirmed and acknowledged.
        </p>
        <h2>Employer &amp; Matching Gifts</h2>

        <h3>Can my company match my donation?</h3>
        <p>
          Many employers offer matching gift programs, which are corporate initiatives
          that match employee donations to eligible nonprofits, effectively doubling or
          even tripling your impact at no additional cost to you. These programs are
          often administered through HR or Benefits departments and may match one-time
          gifts, recurring donations, or even volunteer hours.
        </p>

        <p>
          To learn more, and find out if your employer participates, you can search
          directly using this
          {' '}
          <a
              href="https://www.charitynavigator.org/donor-basics/giving-101/employee-match-programs/"
              target="_blank"
              rel="noopener noreferrer"
          >
            Employee Match Program Lookup Tool from Charity Navigator
          </a>
          .
        </p>

        <p>
          If your company does participate and needs WeVote&apos;s nonprofit details to
          process the match, we&apos;re happy to provide that information — just email
          {' '}
          <a href="mailto:info@wevote.us">info@wevote.us</a>
          {' '}
          for more information.
        </p>

        <h2>Other Ways to Give</h2>

        <h3>Can I donate stock or securities?</h3>
        <p>
          To initiate a stock donation, please email us at
          {' '}
          <a href="mailto:info@wevote.us">info@wevote.us</a>
          {' '}
          for assistance or to
          request our brokerage information. WeVote will provide a donation receipt
          based on the number and type of shares received, but please note that the fair
          market value, and any potential tax deduction, should be determined by the
          donor in consultation with a financial advisor, stockbroker, or accountant.
        </p>

        <h3>Can I give through a Donor-Advised Fund (DAF)?</h3>
        <p>
          Yes. We gratefully accept contributions through Fidelity Charitable, Schwab
          Charitable, BNY Mellon, Vanguard Charitable, and most other DAF providers.
          You can initiate a disbursement directly from your DAF by designating WeVote
          as the recipient using our EIN: 47-2691544. If your fund provider requires
          additional information to process the donation, please feel free to email us
          at
          {' '}
          <a href="mailto:info@wevote.us">info@wevote.us</a>
          , we’re happy to assist.
        </p>
        <p>
          Please note that donations made through a DAF typically may not carry an
          associated benefit or fair market value, as per IRS guidelines. While we will
          provide a written acknowledgment of the gift, the tax deduction is generally
          claimed at the time you contribute to the DAF, not when the DAF makes the
          grant to WeVote. For tax receipt purposes, please contact your DAF.
        </p>

        <h3>Can I make a gift through an IRA charitable rollover?</h3>
        <p>
          If you&apos;re 70½ or older, you may be eligible to make a qualified charitable
          distribution directly from your IRA. Contact your financial advisor to get
          started, and let us know so we can properly acknowledge your gift.
        </p>

        <h3>Can I donate via wire transfer?</h3>
        <p>
          Yes. Please email us at
          {' '}
          <a href="mailto:info@wevote.us">info@wevote.us</a>
          {' '}
          to receive our wire
          transfer information.
        </p>

        <h3>I can’t make a financial donation right now. How else can I support WeVote?</h3>
        <p>
          There are many ways to help! Share our tools with your network, volunteer, or
          sign up for our newsletter to stay engaged.
        </p>

        <h2>Need More Help?</h2>
        <p>
          We’re here to help! Please fill out our
          {' '}
          <a href="https://help.wevote.us/hc/en-us/requests/new" target="_blank" rel="noopener noreferrer">Contact Form</a>
          {' '}
          , and a member of our team will get back to you promptly.
        </p>
      </StyledFaq>
    </PageContentContainer>
  );
}

export default DonateFaq;

const StyledFaq = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 2rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  a {
    color: ${DesignTokenColors.primary500};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;
