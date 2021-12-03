import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../utils/logging';

export default class TermsOfServiceBody extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('TermsOfServiceBody');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <ContentTitle>Terms of Service</ContentTitle>
        <p><strong>Last updated: November 25th, 2021</strong></p>

        <h2>Overview</h2>
        <p>This website (also packaged in mobile apps) is operated by We Vote USA. Throughout the site, the terms “We Vote”, “we”, “us” and “our” refer to We Vote USA. We Vote USA offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
        <p>By visiting our site and/or using our tools, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are contributors of content.</p>
        <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.</p>
        <p>Any new features or tools which are added to the current site shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to this website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.</p>
        <h2>Website Terms</h2>
        <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p>
        <p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
        <p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
        <p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
        <h2>General Conditions</h2>
        <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
        <p>We Vote grants permission to copy the software that powers this website, made available at https://github.com/WeVote, under the MIT License.</p>
        <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
        <h2>Accuracy, Completeness and Timeliness of Information</h2>
        <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
        <p>This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.</p>
        <h2>Modifications to the Service</h2>
        <p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
        <p>We shall not be liable to you or to any third-party for any modification, suspension or discontinuance of the Service.</p>
        <h2>Optional Tools</h2>
        <p>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p>
        <p>You acknowledge and agree that we provide access to such tools “as is” and “as available” without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
        <p>Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p>
        <p>We may also, in the future, offer new services and/or features through the website (including, the release of new tools and resources). Such new features and/or services shall also be subject to these Terms of Service.</p>
        <h2>Third-Party Links</h2>
        <p>Certain content, products and services available via our Service may include materials from third-parties.</p>
        <p>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.</p>
        <p>We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party&#8217;s policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</p>
        <h2>Personal Information</h2>
        <p>
          Your submission of personal information is governed by our
          {' '}
          <Link className="u-link-color" to="/privacy" id="privacyPolicy">Privacy Policy</Link>
          .
        </p>
        <h2>Errors, Inaccuracies and Omissions</h2>
        <p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information if any information in the Service or on any related website is inaccurate at any time without prior notice.</p>
        <p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.</p>
        <h2>Prohibited Uses</h2>
        <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
        <h2>Disclaimer of Warranties; Limitation of Liability</h2>
        <p>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.</p>
        <p>We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable.</p>
        <p>You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you.</p>
        <p>You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all services delivered to you through the service are (except as expressly stated by us) provided &#8216;as is&#8217; and &#8216;as available&#8217; for your use, without any representation, warranties or conditions of any kind, either express or implied.</p>
        <p>In no case shall We Vote USA, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content posted, transmitted, or otherwise made available via the service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.</p>
        <h2>Indemnification</h2>
        <p>You agree to indemnify, defend and hold harmless We Vote USA and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys&apos; fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>
        <h2>Severability</h2>
        <p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
        <h2>Termination</h2>
        <p>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</p>
        <p>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.</p>
        <p>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).</p>
        <h2>Entire Agreement</h2>
        <p>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
        <p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p>
        <p>Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
        <h2>Governing Law</h2>
        <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the state of California.</p>
        <h2>Changes to Terms of Service</h2>
        <p>You can review the most current version of the Terms of Service at any time at this page.</p>
        <p>We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>


        <h2><b>How to contact us</b></h2>
        <p>
          <span>
            If you have any questions about the Terms of Service, you may contact us by sending an e-mail to
            {' '}
            <a href="mailto:info@WeVote.US" className="u-link-color" target="_blank" rel="noopener noreferrer">info@WeVote.US</a>
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
          Attn: Terms of Service
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
