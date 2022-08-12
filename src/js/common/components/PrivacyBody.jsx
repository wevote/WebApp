import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
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
        <p><strong>Last updated: August 12th, 2022</strong></p>
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
          <span>If you have opted-into the We Vote mailing list, your email address and name may be exchanged with named partners and other organizations with principles and/or missions that overlap with those of We Vote. Subscribers may opt out of such mailing list exchanges at any time. Our purpose is to protect your information while making sure you have what you need to make an informed decision on Election Day.</span>
        </p>
        <p>These are some ways your information is used or shown:</p>
        <HorizontallyScrollingDiv>
          <table style={{ height: 166, width: 631 }} border="1">
            <tbody>
              <tr>
                <TdColumn1><strong>Your Personal Information</strong></TdColumn1>
                <TdColumn2><strong>How We Vote Uses or Displays</strong></TdColumn2>
                <TdColumn3><strong>Public?</strong></TdColumn3>
                <TdColumn4><strong>Can Be Hidden?</strong></TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Your Name</TdColumn1>
                <TdColumn2>Displayed on your profile</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>No</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Your Mailing List Email Address and Name</TdColumn1>
                <TdColumn2>We Vote&apos;s opt-in mailing list uses your email address and name to update you a variety of topic related to voting.</TdColumn2>
                <TdColumn3>No.</TdColumn3>
                <TdColumn4>Is hidden</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Your We Vote Account Email Address(es)</TdColumn1>
                <TdColumn2>Used to contact you for sign in, or notifications which you control. When a friend imports contacts which include your email address, we show your friend that you are already on We Vote so they can request to be connected with you. We will never sell your email address.</TdColumn2>
                <TdColumn3>No. Discoverable by friends importing their contact lists.</TdColumn3>
                <TdColumn4>Is hidden from view. Cannot prevent discoverability by friends.</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Your Phone Number</TdColumn1>
                <TdColumn2>Used to contact you for sign in, or notifications which you control. When a friend imports contacts which include your phone number, we show your friend that you are already on We Vote so they can request to be connected with you. We will never sell your phone number.</TdColumn2>
                <TdColumn3>No. Discoverable by friends importing their contact lists.</TdColumn3>
                <TdColumn4>Is hidden from view. Cannot prevent discoverability by friends.</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Values You Follow</TdColumn1>
                <TdColumn2>Displayed on your profile</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>No</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Your Profile Photos</TdColumn1>
                <TdColumn2>Displayed on your profile</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>No</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Address</TdColumn1>
                <TdColumn2>Used to identify correct ballot for you</TdColumn2>
                <TdColumn3>No</TdColumn3>
                <TdColumn4>Is hidden</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>State Code of Your Ballot</TdColumn1>
                <TdColumn2>Shown to your friends and people connected to your friends, when you appear in lists of &apos;suggested friends&apos;</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>Yes</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Candidates you Support or Oppose</TdColumn1>
                <TdColumn2>If marked &apos;Public&apos; by you, your endorsement is displayed on your profile, or under candidate. Otherwise, your endorsement is only visible to friends you add to We Vote.</TdColumn2>
                <TdColumn3>No by Default</TdColumn3>
                <TdColumn4>Yes</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Measures you Support or Oppose</TdColumn1>
                <TdColumn2>If marked &apos;Public&apos; by you, your endorsement is displayed on your profile, or under measure.&nbsp;Otherwise, your endorsement is only visible to friends you add to We Vote.</TdColumn2>
                <TdColumn3>&nbsp;No by Default</TdColumn3>
                <TdColumn4>Yes&nbsp;</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Organizations, Public Figures, and Private Individuals you Follow on We Vote</TdColumn1>
                <TdColumn2>Displayed on your profile</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>No</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Who you Follow on Twitter</TdColumn1>
                <TdColumn2>When you sign in with Twitter, all of the Twitter accounts you follow on Twitter which have endorsements stored in We Vote, are displayed on your profile</TdColumn2>
                <TdColumn3>Yes</TdColumn3>
                <TdColumn4>No</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Friends you invite to We Vote</TdColumn1>
                <TdColumn2>Not displayed</TdColumn2>
                <TdColumn3>No</TdColumn3>
                <TdColumn4>Is hidden</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>Contacts imported from Google/Gmail</TdColumn1>
                <TdColumn2>
                  Your list of contacts is only shown to you for the purposes of finding friends who are already using We Vote,
                  and inviting friends to connect with you on We Vote. This data is stored in quarantined database tables,
                  and subject to Limited Use requirements (see below). Contacts are not added to the We Vote mailing list.
                  You have 100% control over initiating messages to individuals in your contact list.
                </TdColumn2>
                <TdColumn3>No</TdColumn3>
                <TdColumn4>Is hidden, and can be deleted by you from profile section</TdColumn4>
              </tr>
              <tr>
                <TdColumn1>The fact that you have an account</TdColumn1>
                <TdColumn2>Any We Vote voters who look at the Friends section can see you as a &apos;Suggested Friend&apos; if they are connected to one of your current friends</TdColumn2>
                <TdColumn3>Only to friends of friends</TdColumn3>
                <TdColumn4>Yes, if you don&apos;t add any of your friends</TdColumn4>
              </tr>
            </tbody>
          </table>
        </HorizontallyScrollingDiv>
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
        <p>
          If you have imported your contacts from Google/Gmail, you can delete this data from
          {' '}
          <Link to="/settings/yourdata" className="u-link-color">Your Privacy &amp; Data</Link>
          {' '}
          profile page.
        </p>
        <h2><b>Donations and credit card information</b></h2>
        <p>
          <span>When you give money to We Vote online, we collect credit card information from you. That information is used solely for processing your contribution; it is not maintained by We Vote; and is never disclosed to anyone, for any other purpose other than for processing your contribution.</span>
        </p>
        <h2><b>Security</b></h2>
        <p>
          <span>We Vote uses industry standard security measures to protect the information collected by this Site, but we cannot guarantee complete security.</span>
        </p>
        <h2><b>Limited Use Disclosure</b></h2>
        <p>
          <span>
            We Vote&apos;s use and transfer to any other app of information received from Google APIs adhere to the
            {' '}
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="googleLimitedUse"
                url="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                target="_blank"
                body={<span>Google API Services User Data Policy</span>}
              />
            </Suspense>
            , including the Limited Use requirements.
          </span>
        </p>
        <h2><b>Limited Use additional explanation</b></h2>
        <div>
          While the full description of Google API Services User Data Policy is linked to above, we want to share four elements from the Limited Use requirements from Google:
          <ol>
            <li>
              <strong>Allowed Use:</strong>
              {' '}
              Developers are only allowed to use restricted scope data to provide or improve user-facing features that are prominent from the requesting app&apos;s user interface. It should be clear to your users why and how you use the restricted scope data they&apos;ve chosen to share with you.
            </li>
            <li>
              <strong>Allowed Transfer:</strong>
              {' '}
              Developers are only allowed to transfer restricted scope data to others if that transfer is (a) necessary to provide or improve user-facing features that are prominent from the requesting app&apos;s user interface, (b) to comply with applicable laws, or (c) a part of a merger, acquisition or sale of assets of the developer. All other transfers or sales of user data are completely prohibited.
            </li>
            <li>
              <strong>Prohibited Advertising:</strong>
              {' '}
              Developers are never allowed to use or transfer restricted scope data to serve users advertisements. This includes personalized, re-targeted and interest-based advertising.
            </li>
            <li>
              <strong>Prohibited Human Interaction:</strong>
              {' '}
              Developers cannot allow humans to read restricted scope user data. For example, a developer with access to a user&apos;s data is not allowed to have one of its employees read through a user&apos;s email addresses. There are four limited exceptions to this rule: (a) the developer obtains a user&apos;s consent to read specific email addresses (for example, for tech support), (b) it&apos;s necessary for security purposes (for example, investigating abuse), (c) to comply with applicable laws, and (d) the developer aggregates and anonymizes the data and only uses it for internal operations (for example, reporting aggregate statistics in an internal dashboard).
            </li>
          </ol>
        </div>
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

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  text-align: center !important;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const HorizontallyScrollingDiv = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    border: 3px solid lightgrey;
    overflow-x: auto;
  }
`));

const TdColumn1 = styled('td')`
  padding: 4px;
  width: 170px;
`;

const TdColumn2 = styled('td')`
  padding: 4px;
  width: 349px;
`;

const TdColumn3 = styled('td')`
  padding: 4px;
  width: 106px;
`;

const TdColumn4 = styled('td')`
  padding: 4px;
  width: 106px;
`;
