import React from "react";
import Helmet from "react-helmet";
import CodeCopier from "../../components/Widgets/CodeCopier";
import ImageHandler from "../../components/ImageHandler";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";

export default function ToolsToShareOnOtherWebsites () {
  return (
    <div>
      <Helmet title="Free civic engagement tools - We Vote" />
      <div className="container-fluid well">
        <h1 className="h1">Tools For Your Website</h1>

        <p>
WeVote.US wants to give you our technology to use, for
          <strong>FREE</strong>
, on your website.
        </p>

        <h2 className="h3">Why use WeVote.US tools?</h2>
        <ul>
          <li>All our of tools work in all 50 states and the District of Columbia.</li>
          <li>They’re fast and mobile-optimized, they’re free to use, and they’re the best tools available.</li>
        </ul>

        <h2 className="h3">Adding the tools to your website takes less than 2 minutes.</h2>
        <ol>
          <li>
            <p>Copy the code for the tool, or click to view the code.</p>
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4">
                <ImageHandler imageUrl="/img/tools/example.png" hidePlaceholder />
              </div>
            </div>
            <p>&nbsp;</p>
          </li>
          <li>Paste the code on your website where you want the tool to appear.</li>
          <li>We recommend putting each tool on its own page so you don’t overwhelm your visitors.</li>
        </ol>

        <h2 className="h3">Tools</h2>
        <div className="row">
          <CodeCopier
            title="Interactive Ballot Tool"
            sourceUrl="https://wevote.us/ballot"
            imageUrl="/img/tools/We-Vote-Example-Ballot.png"
            exampleUrl="https://wevote.us/more/myballot"
          />
          <CodeCopier
            title="Voter Guide Tool"
            exampleUrl="https://wevote.us/lwv_oakland"
            imageUrl="/img/tools/guide.png"
          />
          <CodeCopier
            title="Voter Registration Tool"
            sourceUrl="https://register.vote.org/?partner=111111&campaign=free-tools"
            exampleUrl="https://wevote.us/more/register"
            imageUrl="/img/tools/register.png"
          />
          <CodeCopier
            title="Absentee Ballot Tool"
            sourceUrl="https://absentee.vote.org/?partner=111111&campaign=free-tools"
            exampleUrl="https://wevote.us/more/absentee"
            imageUrl="/img/tools/absentee.png"
          />
          <CodeCopier
            title="Check Registration Status Tool"
            sourceUrl="https://verify.vote.org/?partner=111111&campaign=free-tools"
            exampleUrl="https://wevote.us/more/verify"
            imageUrl="/img/tools/verify.png"
          />
          <CodeCopier
            title="Election Reminder Tool"
            sourceUrl="https://reminders.vote.org/?partner=111111&campaign=free-tools"
            exampleUrl="https://wevote.us/more/alerts"
            imageUrl="/img/tools/reminders.png"
          />
        </div>

        <h2 className="h3">Notes:</h2>
        <ul>
          <li>You can place any page on www.WeVote.US on your organizational website.</li>
          <li>
            If you need access to the data gathered via your instance of the Vote.org toolset,
            <OpenExternalWebSite
              url="https://vip.vote.org"
              target="_blank"
              body="check out the Vote.org premium tools."
            />
          </li>
        </ul>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}
