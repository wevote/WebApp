import React from "react";
import Helmet from "react-helmet";
import CodeCopier from "../../components/Widgets/CodeCopier";

export default function ToolsToShareOnOtherWebsites () {
  return <div>
    <Helmet title="Free civic engagement tools - We Vote" />
    <div className="container-fluid well">
      <h1 className="h1">Free Civic Engagement Tools</h1>

      <p>WeVote.US wants to give you our technology to use — for <strong>FREE</strong><br />on your website.</p>

      <h2 className="h3">Why use WeVote.US tools?</h2>
      <ul>
        <li>All our of tools work in all 50 states and the District of Columbia.</li>
        <li>They’re fast and mobile-optimized, they’re free to use, and they’re the best tools on the market.</li>
        <li>Battle tested: these are the exact same tools we use at WeVote.US.</li>
      </ul>

      <h2 className="h3">Adding the tools to your website takes less than 2 minutes.</h2>
      <ol>
        <li>
          Copy the code for the tool, or click to view the code.<br />
          {/* Image here */}
      </li>
        <li>Paste the code on your website where you want the tool to appear.</li>
        <li>We recommend putting each tool on its own page so you don’t overwhelm your visitors.</li>
      </ol>

      {/* eslint quotes: [1, "double", { "allowTemplateLiterals": true }] */}
      {/* enclose html within {` and `} to make them literal string in JSX */}
      <h2 className="h3">Tools</h2>
      <div className="row">
        <CodeCopier title="Voter Registration Tool">
          {`<iframe src="https://register.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <CodeCopier title="Absentee Ballot Tool">
          {`<iframe src="https://absentee.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame2" scrollable="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <CodeCopier title="Check Registration Status Tool">
          {`<iframe src="https://verify.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame3" scrollable="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js" ></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <CodeCopier title="Election Reminder Tool">
          {`<iframe src="https://reminders.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
      </div>

      <h2 className="h3">Access even more:</h2>
      <ul>
        <li>You can place any page on www.WeVote.US on your organizational website. Learn more about fine-tuning our tools for your website.</li>
        <li>If you need access to the data gathered via your instance of the Vote.org toolset, <a href="https://vip.vote.org" target="_blank">check out Vote.org premium tools.</a></li>
      </ul>
      <p>&nbsp;</p>
    </div>
  </div>;
}
