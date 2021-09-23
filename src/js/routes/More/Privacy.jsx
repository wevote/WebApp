import React from 'react';
import Helmet from 'react-helmet';
import { PageContentContainer } from '../../components/Widgets/ReusableStyles';
import { renderLog } from '../../utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../components/Widgets/OpenExternalWebSite'));

export default class Privacy extends React.Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('Privacy');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet title="Privacy Policy - We Vote" />
        <div className="container-fluid well">
          <h1 className="text-center">WeVote.US Privacy Policy</h1>
          <p><strong>Last updated: August 13, 2020</strong></p>
          <p>
            <span>We Vote USA has created this privacy policy to explain how We Vote (or “we”) uses information that we collect from you while you visit the We Vote websites, currently located at</span>
            <span>
              <OpenExternalWebSite
                linkIdAttribute="wevote"
                url="https://WeVote.US/"
                target="_blank"
                body={<span>WeVote.US</span>}
              />
              {' '}
              (the “Site”), or while you use a portion of We Vote that is embedded on another website (the “Services”).  We Vote may modify this policy from time to time, so we encourage you to check this page when revisiting the Site.  The date of the most recent revision is listed above.
            </span>
          </p>
          <p>
            You can find additional explanations of our Privacy Policy in our
            <OpenExternalWebSite
              linkIdAttribute="wevotePrivacy"
              url="https://help.wevote.us/hc/en-us/sections/115000140987-Security-Technology"
              target="_blank"
              body={<span>Help Center</span>}
            />
            .
          </p>
          <h2><b>How we use your information</b></h2>
          <p>
            <span>
              When you request your ballot, send messages to friends, donate, join our newsletter, or take any other action on this Site,
              we may ask you to give us contact information, including your name, address, email address and telephone number.
              We may also obtain information about you from outside sources and combine it with the information we collect through this Site.
              We use this information to operate this Site, to sends you news and information about We Vote, to measure the effectiveness of our
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
              <OpenExternalWebSite
                linkIdAttribute="googleAnalytics"
                url="https://policies.google.com/privacy"
                target="_blank"
                body={<span>https://policies.google.com/privacy</span>}
              />
            </span>
            <span>
              {' '}
              and Full Story (
              <OpenExternalWebSite
                linkIdAttribute="fullStoryPrivacy"
                url="https://www.fullstory.com/legal/privacy/"
                target="_blank"
                body={<span>https://www.fullstory.com/legal/privacy/</span>}
              />
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
      </PageContentContainer>
    );
  }
}

