import React from "react";
import Helmet from "react-helmet";

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
        <h1 className="h2">Free civic engagement tools</h1>

        <p><strong>WeVote.US wants to give you our technology to use — for FREE — on your website.</strong></p>

        <h2 className="h3">Why use WeVote.US tools?</h2>
        <ul>
          <li>All our of tools work in all 50 states.</li>
          <li>Mobile-optimized for sky-high conversion rates</li>
          <li>They’re fast, they’re free to use, and they’re the best tools on the market.</li>
          <li>Battle tested: these are the exact same tools we use at WeVote.US</li>
        </ul>

        <h2 className="h3">Adding the tools to your website takes less than 2 minutes.</h2>
        <ul>
          <li>Copy the code for the tool</li>
          <li>Paste the code on your website where you want the tool to appear</li>
          <li>We recommend putting each tool on its own page so you don’t overwhelm your visitors</li>
        </ul>

        <h3 className="h3">Other tools you might like</h3>
        <h4 className="h4">Free voter registration tool</h4>
        <textarea id="clipboard_textarea1"> {/* TODO Make ReactJS friendly: <iframe src="https://register.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>
        <script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>*/}
        </textarea>
        <button className="btn-success" data-clipboard-target="clipboard_textarea1">Click to copy code</button>

        <h4 className="h4">Free absentee ballot tool</h4>
        <textarea id="clipboard_textarea2"> {/* TODO Make ReactJS friendly: <iframe src="https://absentee.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame2" scrollable="no"></iframe>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>
          <script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>*/}
        </textarea>
        <button className="btn-success" data-clipboard-target="clipboard_textarea2">Click to copy code</button>

        <h4 className="h4">Free check registration status tool</h4>
        <textarea id="clipboard_textarea3"> {/* TODO Make ReactJS friendly: <iframe src="https://verify.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame3" scrollable="no"></iframe>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js" ></script>
          <script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>*/}
        </textarea>
        <button className="btn-success" data-clipboard-target="clipboard_textarea3">Click to copy code</button>

        <h4 className="h4">Election reminders tool</h4>
        <textarea id="clipboard_textarea4"> {/* TODO Make ReactJS friendly: <iframe src="https://reminders.vote.org/?partner=111111&campaign=free-tools" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>
          <script type="text/javascript">iFrameResize({ log:true, checkOrigin:false});</script>*/}
        </textarea>
        <button className="btn-success" data-clipboard-target="clipboard_textarea4">Click to copy code</button>
        <p>&nbsp;</p>
        <p>If you need access to the data gathered via your instance of the Vote.org toolset, <a href="https://vip.vote.org" target="_blank">check out Vote.org premium tools. </a></p>
        <p>&nbsp;</p>
      </div>
    </div>;
  }
}
