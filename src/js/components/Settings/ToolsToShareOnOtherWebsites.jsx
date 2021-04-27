import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import cordovaScrollablePaneTopPadding from '../../utils/cordovaScrollablePaneTopPadding';

const CodeCopier = React.lazy(() => import('../Widgets/CodeCopier'));
const OpenExternalWebSite = React.lazy(() => import('../Widgets/OpenExternalWebSite'));


export default function ToolsToShareOnOtherWebsites (props) {
  return (
    <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
      <Helmet title="Free civic engagement tools - We Vote" />
      <div className="card container-fluid well">
        <div className="card-main">
          <h1 className="h2">Tools For Your Website</h1>
          <p>
            WeVote.US wants to give you our technology to use, for
            <strong> FREE</strong>
            , on your website.
          </p>

          <div className="u-show-desktop-tablet">
            <SectionTitle>Why use WeVote.US tools?</SectionTitle>
            <ul>
              <li>All our of tools work in all 50 states and the District of Columbia.</li>
              <li>They&apos;re fast and mobile-optimized, they&apos;re free to use, and they&apos;re the best tools available.</li>
            </ul>

            <SectionTitle>Adding the tools to your website takes less than 2 minutes.</SectionTitle>
            <ol>
              <li>Copy the HTML code for the tool, or view the code.</li>
              <li>Paste the code on your website where you want the tool to appear.</li>
              <li>We recommend putting each tool on its own page so you don&apos;t overwhelm your visitors.</li>
            </ol>
          </div>

          <div className="row">
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Interactive Ballot Tool"
              sourceUrl="https://wevote.us/ballot"
              codeCopierButtonId="codeCopierInteractiveBallotTool"
              imageUrl="/img/tools/We-Vote-Example-Ballot.png"
              exampleUrl="https://wevote.us/more/myballot"
            />
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Voter Guide Tool"
              exampleUrl="https://wevote.us/lwv_oakland"
              codeCopierButtonId="codeCopierVoterGuideTool"
              imageUrl="/img/tools/guide.png"
            />
          </div>

          <SectionTitle>Notes:</SectionTitle>
          <ul>
            <li>You can place any page on www.WeVote.US on your organizational website.</li>
          </ul>
          <p>&nbsp;</p>

          <h1 className="h2">From Our Partner, Vote.org</h1>
          <div className="row">
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Voter Registration Tool"
              sourceUrl="https://register.vote.org/?partner=111111&campaign=free-tools"
              exampleUrl="https://wevote.us/more/register"
              codeCopierButtonId="codeCopierVoterRegistrationTool"
              imageUrl="/img/tools/register.png"
            />
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Absentee Ballot Tool"
              sourceUrl="https://absentee.vote.org/?partner=111111&campaign=free-tools"
              exampleUrl="https://wevote.us/more/absentee"
              codeCopierButtonId="codeCopierAbsenteeBallotTool"
              imageUrl="/img/tools/absentee.png"
            />
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Check Registration Status Tool"
              sourceUrl="https://verify.vote.org/?partner=111111&campaign=free-tools"
              exampleUrl="https://wevote.us/more/verify"
              codeCopierButtonId="codeCopierCheckRegistrationStatusTool"
              imageUrl="/img/tools/verify.png"
            />
            <CodeCopier
              externalUniqueId={props.externalUniqueId}
              title="Election Reminder Tool"
              sourceUrl="https://reminders.vote.org/?partner=111111&campaign=free-tools"
              exampleUrl="https://wevote.us/more/alerts"
              codeCopierButtonId="codeCopierElectionReminderTool"
              imageUrl="/img/tools/reminders.png"
            />
          </div>

          <SectionTitle>Vote.org Notes:</SectionTitle>
          <ul>
            <li>
              If you need access to the data gathered via your instance of the Vote.org toolset,
              <OpenExternalWebSite
                linkIdAttribute="voteOrg"
                url="https://vip.vote.org"
                target="_blank"
                body="check out the Vote.org premium tools."
              />
            </li>
          </ul>
          <p>&nbsp;</p>
        </div>
      </div>
    </Wrapper>
  );
}

ToolsToShareOnOtherWebsites.propTypes = {
  externalUniqueId: PropTypes.string,
};

const Wrapper = styled.div`
  padding-top: ${({ padTop }) => padTop};
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  width: fit-content;
  color: #333;
`;
