import React from "react";
import Helmet from "react-helmet";
import CodeCopier from "../../components/Widgets/CodeCopier";

export default class ToolsToShareOnOtherWebsites extends React.Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="Free civic engagement tools - We Vote" />
      <div className="container-fluid well">
        <h1 className="h1">Free civic engagement tools</h1>

        <p><strong>WeVote.US wants to give you our technology to use — for FREE — on your website.</strong></p>

        <h2 className="h3">Why use WeVote.US tools?</h2>
        <ul>
          <li>All our of tools work in all 50 states and the District of Columbia.</li>
          <li>They’re fast and mobile-optimized, they’re free to use, and they’re the best tools on the market.</li>
          <li>Battle tested: these are the exact same tools we use at WeVote.US</li>
        </ul>

        <h2 className="h3">Adding the tools to your website takes less than 2 minutes.</h2>
        <ul>
          <li>Copy the code for the tool</li>
          <li>Paste the code on your website where you want the tool to appear</li>
          <li>We recommend putting each tool on its own page so you don’t overwhelm your visitors</li>
        </ul>

        <h4 className="h2">Free voter registration tool from Vote.org</h4>
        {/* enclose html within {` and `} to make them literal string in JSX */}
        <CodeCopier>
          {`<iframe src="https://register.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <br />

        <h4 className="h2">Free absentee ballot tool from Vote.org</h4>
        {/* enclose html within {` and `} to make them literal string in JSX */}
        <CodeCopier>
          {`<iframe src="https://absentee.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame2" scrollable="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <br />

        <h4 className="h2">Free check registration status tool from Vote.org</h4>
        {/* enclose html within {` and `} to make them literal string in JSX */}
        <CodeCopier>
          {`<iframe src="https://verify.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame3" scrollable="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js" ></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <br />

        <h4 className="h2">Election reminders tool from Vote.org</h4>
        {/* enclose html within {` and `} to make them literal string in JSX */}
        <CodeCopier>
          {`<iframe src="https://reminders.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>`}
          {`<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>`}
          {`<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>`}
        </CodeCopier>
        <p>&nbsp;</p>
        <p>If you need access to the data gathered via your instance of the Vote.org toolset, <a href="https://vip.vote.org" target="_blank">check out Vote.org premium tools. </a></p>
        <p>&nbsp;</p>
      </div>
    </div>;
  }
}
