import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './Widgets/OpenExternalWebSite'));

export default class PrivacyBody extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('PrivacyBody');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <ContentTitle>WeVote.US Privacy Policy</ContentTitle>
        <p><strong>Last updated: November 25th, 2021</strong></p>
        <p>
          <span>We Vote USA has created this privacy policy to explain how We Vote (or “we”) uses information that we collect from you while you visit We Vote, currently located at </span>
          <span>
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="wevote"
                url="https://WeVote.US/"
                target="_blank"
                body={<span>WeVote.US</span>}
              />
            </Suspense>
            ,
            {' '}
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="weVoteCampaigns"
                url="https://campaigns.WeVote.US/"
                target="_blank"
                body={<span>campaigns.WeVote.US</span>}
              />
            </Suspense>
            ,
            {' '}
            other subdomains,
            {' '}
            provided in mobile apps (the “Site”),
            or while you use a portion of We Vote that is embedded on another website (the “Services”).  We Vote may modify this policy from time to time, so we encourage you to check this page when revisiting the Site.  The date of the most recent revision is listed above.
          </span>
        </p>
        <p>
          You can find additional explanations of our Privacy Policy in our
          {' '}
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="wevotePrivacy"
              url="https://help.wevote.us/hc/en-us/sections/115000140987-Security-Technology"
              target="_blank"
              body={<span>Help Center</span>}
            />
          </Suspense>
          .
        </p>
        <h2><b>Why we use your information</b></h2>
        <p>
          <span>
            We use the information we collect about you to help you be better informed about candidates and measures as you fill out your United States ballot, while preparing to cast your vote.
          </span>
        </p>
        <h2><b>What information about you we collect</b></h2>
        <p>
          <span>
            When you request what candidates and measures are on your United States ballot, send messages to friends, donate, join our newsletter, or take any other action on this Site,
            we may ask you to give us your contact information, including your name, address, email address and telephone number.
            We automatically collect the IP address of the device you are using to connect to this Site.
            We may ask you to choose to upload the contact information of your friends, including their names, addresses, email addresses and telephone numbers.
            We may also obtain information about you from outside sources and combine it with the information we collect through this Site.
          </span>
        </p>
        <h2><b>How we use your information</b></h2>
        <p>
          <span>
            We use the information we collect about you to operate this Site,
            which includes finding and showing you what candidates and measures are on your United States ballot,
            showing you possible friends you might want to connect with,
            to send you news and information about We Vote, to measure the effectiveness of our
            programs, and to send you timely election reminders.
            You may opt-out of receiving messages from We Vote by sending any email to
            {' '}
            <a href="mailto:info@WeVote.US" target="_blank" rel="noopener noreferrer">info@WeVote.US</a>
            {' '}
            and asking that you not receive future email messages.
            You may also opt-out by following the unsubscribe link at the bottom of each email.
          </span>
        </p>
        <p>
          <span>Some information on our mailing lists, such as names, email addresses, and addresses, may be exchanged with named partners and other organizations with principles and/or missions that overlap with those of We Vote. Subscribers may opt out of such mailing list exchanges at any time. Our purpose is to protect your information while making sure you have what you need to make an informed decision on Election Day.</span>
        </p>
        <p className="u-show-desktop-tablet">These are some ways your information is used or shown:</p>
        <table className="u-show-desktop-tablet" style={{ height: 166, width: 631 }} border="1">
          <tbody>
            <tr>
              <td style={{ padding: 4, width: 170 }}><strong>Your Personal Information</strong></td>
              <td style={{ padding: 4, width: 349 }}><strong>How We Vote Uses or Displays</strong></td>
              <td style={{ padding: 4, width: 106 }}><strong>Public?</strong></td>
              <td style={{ padding: 4, width: 106 }}><strong>Can Be Hidden?</strong></td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Your Name</td>
              <td style={{ padding: 4, width: 349 }}>Displayed on your profile</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Your Email Address</td>
              <td style={{ padding: 4, width: 349 }}>Used to contact you for sign in, or notifications which you control. We will never sell your email address.</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
              <td style={{ padding: 4, width: 106 }}>Is Hidden</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Values You Follow</td>
              <td style={{ padding: 4, width: 349 }}>Displayed on your profile</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Your Profile Photos</td>
              <td style={{ padding: 4, width: 349 }}>Displayed on your profile</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Address</td>
              <td style={{ padding: 4, width: 349 }}>Used to identify correct ballot for you</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
              <td style={{ padding: 4, width: 106 }}>Is Hidden</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Candidates you Support or Oppose</td>
              <td style={{ padding: 4, width: 349 }}>If marked &apos;Public&apos; by you, your endorsement is displayed on your profile, or under candidate. Otherwise, your endorsement is only visible to friends you add to We Vote.</td>
              <td style={{ padding: 4, width: 106 }}>No by Default</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Measures you Support or Oppose</td>
              <td style={{ padding: 4, width: 349 }}>If marked &apos;Public&apos; by you, your endorsement is displayed on your profile, or under measure.&nbsp;Otherwise, your endorsement is only visible to friends you add to We Vote.</td>
              <td style={{ padding: 4, width: 106 }}>&nbsp;No by Default</td>
              <td style={{ padding: 4, width: 106 }}>Yes&nbsp;</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Organizations, Public Figures, and Private Individuals you Follow on We Vote</td>
              <td style={{ padding: 4, width: 349 }}>Displayed on your profile</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Who you Follow on Twitter</td>
              <td style={{ padding: 4, width: 349 }}>When you sign in with Twitter, all of the Twitter accounts you follow on Twitter which have endorsements stored in We Vote, are displayed on your profile</td>
              <td style={{ padding: 4, width: 106 }}>Yes</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>Friends you invite to We Vote</td>
              <td style={{ padding: 4, width: 349 }}>Not displayed</td>
              <td style={{ padding: 4, width: 106 }}>No</td>
              <td style={{ padding: 4, width: 106 }}>Is Hidden</td>
            </tr>
            <tr>
              <td style={{ padding: 4, width: 170 }}>The fact that you have an account</td>
              <td style={{ padding: 4, width: 349 }}>Any We Vote voters who look at the Friends section can see you as a &apos;Suggested Friend&apos; if they are connected to one of your current friends</td>
              <td style={{ padding: 4, width: 106 }}>Only to friends of friends</td>
              <td style={{ padding: 4, width: 106 }}>Yes, if you don&apos;t add any of your friends</td>
            </tr>
          </tbody>
        </table>
        <p className="u-show-desktop-tablet">&nbsp;</p>
        <h2><b>How to request the deletion of your data</b></h2>
        <p>
          <span>
            You may request the deletion of all of the data we have about you by
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="weVoteContactUsPage"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body=" submitting a request here."
              />
            </Suspense>
          </span>
        </p>
        <h2><b>Donations and credit card information</b></h2>
        <p>
          <span>When you contribute to We Vote online, we collect credit card information from you. That information is used solely for processing your contribution; it is not maintained by We Vote; and is never disclosed to anyone, for any other purpose other than for processing your contribution.</span>
        </p>
        <h2><b>Security</b></h2>
        <p>
          <span>We Vote uses industry standard security measures to protect the information collected by this Site, but we cannot guarantee complete security.</span>
        </p>
        <h2><b>Use of services by minors</b></h2>
        <p>
          <span>We Vote does not knowingly solicit personally identifying information from children under 13 years of age.  We will promptly remove any personal information from children under 13 upon notice to us.</span>
        </p>
        <h2><b>Advertising</b></h2>
        <p>
          <span>We may place online advertising with third-party vendors, including Google, which will be shown on other sites on the internet. In some cases, those third-party vendors may decide which ads to show you based on your prior visits to the Site. At no time will you be personally identified to those third-party vendors, nor will any of the personal information you share with us be shared with those third-party vendors. If you prefer to opt out of the use of these third-party cookies on the Site, you can do so by visiting the Network Advertising Initiative opt out page.</span>
        </p>
        <h2><b>Cookies and data tracking</b></h2>
        <p><span>In order to better serve you, we use cookies and periodically analyze web logs. Some cookies are used to pre-populate forms for you so that on repeat visits to the Site you don&apos;t need to re-enter certain information.  You can set your browser to disable cookies, but then you would not have the advantage of having certain sections of forms being pre-populated for you, and you may not be able to access certain parts of the Site.</span></p>
        <p>
          <span>We also use third-party services such as Google Analytics </span>
          <span>
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="googleAnalytics"
                url="https://policies.google.com/privacy"
                target="_blank"
                body={<span>https://policies.google.com/privacy</span>}
              />
            </Suspense>
          </span>
          <span>
            {' '}
            and Full Story (
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="fullStoryPrivacy"
                url="https://www.fullstory.com/legal/privacy/"
                target="_blank"
                body={<span>https://www.fullstory.com/legal/privacy/</span>}
              />
            </Suspense>
            ).
          </span>
          <span> They help us understand traffic patterns and know if there are problems with our Site. We may also use embedded images in emails to track open rates for our mailings, so that we can tell which mailings appeal most to We Vote subscribers.</span>
        </p>
        <p>
          <span>
            The information generated about your use of our Site (including your IP address) is transmitted to and stored by Google and
            Full Story on servers in the United States. Google and/or Full Story may also transfer this information to third parties where
            Google and/or Full Story are legally required, or where such third parties process the information on Google&apos;s or Full Story&apos;s
            behalf. Google may combine your IP address with any other data held by Google. By using this Site, you consent to the processing of
            data by Google and Full Story in the manner and for the purposes set out above.
          </span>
        </p>
        <p>
          <span>URLs contained in emails may contain an ID that enables us to correctly identify the person who takes an action using a web page. We use these URLs to simplify the process of helping you to prepare to vote. We may occasionally present a shortened URL that references a longer URL which you can see in the browser&apos;s address bar when you access the page.</span>
        </p>
        <h2><b>Links to other sites</b></h2>
        <p>
          <span>This Privacy Policy does not apply to ANY external links or any website not owned and operated by We Vote. Third party sites will have their own policies which may be different from ours and we recommend that you check the privacy policy of each site that you visit.</span>
        </p>
        <h2><b>Disclosure of information</b></h2>
        <p>
          <span>We Vote will challenge any attempt to gain access to the information you give us by government agencies or private organizations. In the unlikely event that we are required by law to disclose any of your information we will do our best to contact you first so that you may have the opportunity to object to the disclosure. We will also independently object to any requests for access to information about users of our Site that we believe to be improper.</span>
        </p>
        <h2><b>Amendments and consent to this privacy policy</b></h2>
        <p>
          <span>By using and/or visiting our Site, you understand and  agree to be bound by this Privacy Policy.  If you do not agree to this Privacy Policy, please do not use the Site or the Services.</span>
        </p>
        <h2><b>How to contact us</b></h2>
        <p>
          <span>
            If you have any questions about this Privacy Policy, you may contact us by sending an e-mail to
            {' '}
            <a href="mailto:info@WeVote.US" target="_blank" rel="noopener noreferrer">info@WeVote.US</a>
            {' '}
          </span>
          <br />
          <span>You can also write to us at the following address:</span>
        </p>
        <p>
          We Vote USA
          <br />
          {' '}
          1423 Broadway PMB 158
          <br />
          {' '}
          Oakland, CA 94612
          <br />
          {' '}
          Attn: Privacy Policy
        </p>
        <p>&nbsp;</p>
      </div>
    );
  }
}

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  text-align: center !important;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;
