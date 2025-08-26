import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../utils/logging';


export default class ChildSafetyBody extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('ChildSafetyBody');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <ContentTitle>Standards Against Child Sexual Abuse and Exploitation (CSAE)</ContentTitle>
        <p><strong>Last updated: August 8th, 2025</strong></p>

        <h2>Introduction</h2>
        <p>WeVote is committed to maintaining a safe and secure platform that protects children from exploitation, abuse, and harm. We strictly prohibit any form of Child Sexual Abuse and Exploitation (CSAE) and take all necessary steps to prevent, detect, and report such content and activity on our platform.</p>

        <h2>Zero-Tolerance Policy on Child Sexual Abuse Material (CSAM)</h2>
        <p>WeVote enforces a zero-tolerance policy against Child Sexual Abuse Material (CSAM). This includes but is not limited to:</p>
        <ul>
          <li>Any content that depicts, encourages, or facilitates child sexual abuse or exploitation.</li>
          <li>Any attempt to groom, solicit, or engage minors in inappropriate conversations or activities.</li>
          <li>The sharing, storage, or transmission of CSAM in any form.</li>
          <li>The use of the platform for the recruitment or facilitation of child trafficking or exploitation.</li>
        </ul>

        <h2>Proactive Detection and Reporting</h2>
        <p>To ensure compliance and prevent CSAE, WeVote implements the following measures:</p>
        <ul>
          <li>Scanning & Moderation: We use manual review processes to detect and remove any content that violates child safety policies.</li>
          <li>User Reporting Mechanisms: Users can report any suspected CSAE content directly within the app, which will be reviewed and actioned promptly.</li>
          <li>Collaboration with Law Enforcement: We cooperate with global law enforcement agencies and organizations like the National Center for Missing and Exploited Children (NCMEC) to report and act on any CSAM-related incidents.</li>
          <li>Strict Content Moderation: All user-generated content (UGC) is subject to review by our trust and safety team to identify and remove any harmful material.</li>
        </ul>

        <h2>Compliance with Child Safety Laws</h2>
        <p>WeVote adheres to all relevant local and international child protection laws, including:</p>
        <ul>
          <li>Canada’s proposed Online Harms Act (Bill C-63)</li>
          <li>Canada’s proposed Protecting Young Persons from Exposure to Pornography Act (Bill S-210)</li>
          <li>The U.S. Children’s Online Privacy Protection Act (COPPA)</li>
          <li>The U.K. Online Safety Act</li>
          <li>The EU General Data Protection Regulation (GDPR) for children</li>
          <li>Other applicable laws that mandate the protection of children online</li>
        </ul>

        <h2>User Guidelines & Enforcement</h2>
        <p>To ensure the safety of minors, the following user guidelines are enforced:</p>
        <ul>
          <li>Age Restrictions: WeVote is not intended for users under the age of 13. Users found to be underage will have their accounts suspended.</li>
          <li>Strict Community Standards: Any content involving minors must comply with our safety policies and will be subject to moderation.</li>
          <li>Account Suspension & Reporting: Users engaging in CSAE-related activities will be permanently banned and reported to authorities.</li>
        </ul>

        <h2>Ongoing Commitment to Safety</h2>
        <p>WeVote continuously updates and strengthens its child protection measures in alignment with best practices and regulatory requirements. We work with child safety experts and advocacy groups to improve our policies and detection mechanisms.</p>

        <h2>Dedicated Child Safety Contact, and How to Contact Us</h2>
        <p>
          <span>
            For any child safety concerns, authorities, parents, or users can contact our dedicated Child Safety Team at
            {' '}
            <a href="mailto:info@WeVote.US" id="childSafetyWeVoteEmailLink" className="u-link-color" target="_blank" rel="noopener noreferrer">info@WeVote.US</a>
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
          Attn: Child Safety Team
        </p>
        <p>&nbsp;</p>
        <p>
          Please also see our
          {' '}
          <Link className="u-link-color" to="/more/terms" id="termsOfService">Terms of Service</Link>
          .
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
