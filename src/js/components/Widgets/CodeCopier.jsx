import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import { showToastSuccess } from "../../utils/showToast";

export default class CodeCopier extends Component {
  static propTypes = {
    exampleUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    sourceUrl: PropTypes.string,
    title: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      is_loading: false,
      is_twitter_handle_valid: false,
      status: "",
      twitter_handle: "",
      view_code: false,
    };

    this.copyCode = this.copyCode.bind(this);
    this.resetState = this.resetState.bind(this);
    this.toggleCode = this.toggleCode.bind(this);
    this.validateTwitterHandle = this.validateTwitterHandle.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.timer = null;
  }

  copyCode () {
    if (this.props.sourceUrl || !this.props.sourceUrl && this.state.is_twitter_handle_valid) {
      if (this.state.view_code) {
        this.textareaCode.select();
        //  const successful = document.execCommand("copy");
        document.execCommand("copy");

        showToastSuccess("Code copied to clipboard!");
        // console.log('copy_status', successful);
        // perhaps a tooltip that fades out after a moment should be created
      } else {
        this.setState({
          view_code: true,
        }, () => this.copyCode());
      }
    }
  }

  resetState () {
    this.setState({
      is_loading: false,
      is_twitter_handle_valid: false,
      status: "",
      twitter_handle: "",
      view_code: false,
    });
  }

  toggleCode () {
    this.setState({
      view_code: !this.state.view_code,
    });
  }

  validateTwitterHandle (event) {
    clearTimeout(this.timer);
    if (event.target.value.length) {
      this.validateTwitterHandleAction(event.target.value);
      this.setState({
        is_loading: true,
        status: "Searching...",
        view_code: false,
      });
    } else {
      this.resetState();
    }
  }

  validateTwitterHandleAction (twitter_handle) {
    this.timer = setTimeout(() => OrganizationActions.organizationSearch("", twitter_handle, true), 1200);
  }

  onOrganizationStoreChange () {
    let result = OrganizationStore.getOrganizationSearchResultsTwitterHandle();

    let status = "";
    if (result.length) {
      status += "Voter guide found!";
    } else {
      status += "Voter guide not found.";
    }

    this.setState({
      is_loading: false,
      is_twitter_handle_valid: result.length,
      status: status,
      twitter_handle: result,
    });
  }

  render () {
    renderLog(__filename);
    let source_url = "";
    if (this.props.sourceUrl && this.props.sourceUrl.length) {
      source_url = this.props.sourceUrl;
    } else {
      source_url = "https://wevote.us/" + this.state.twitter_handle;
    }

    let source_code =
    `<iframe src="${source_url}" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>\n<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></script>\n<script type="text/javascript">iFrameResize({ log:true, checkOrigin:false });</script>`;

    switch (this.props.title) {
      case "Interactive Ballot Tool":
        return (
          <div className="col-xs-12 col-sm-6 col-md-4">
            <div className="code-copier">
              <h3 className="h3">{this.props.title}</h3>
              <button className="btn btn-success u-stack--sm" onClick={this.copyCode}>Click to copy code</button>
              <br />
              <div className="u-stack--sm">
                <a className="code-copier__link" onClick={this.toggleCode}>
                  { this.state.view_code ? "Hide Code" : "Show Code" }
                </a>
              </div>
              { this.state.view_code ?
                <textarea ref={(text) => { this.textareaCode = text; }}
                          className="clipboard textarea-clipboard u-stack--sm"
                          value={source_code}
                          readOnly /> :
                <div>
                  <a href={this.props.imageUrl} target="_blank">
                    <ImageHandler className="code-copier__image u-stack--sm"
                                  hidePlaceholder
                                  imageUrl={this.props.imageUrl}
                                  alt={this.props.title} />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.imageUrl} target="_blank">
                    Click to view full size
                  </a>
                </div>
              }
            </div>
          </div>
        );

      case "Voter Guide Tool":
        return (
          <div className="col-xs-12 col-sm-6 col-md-4">
            <div className="code-copier">
              <h3 className="h3">{this.props.title}</h3>
              <input type="text"
                     className={ this.state.status.length ?
                                 "form-control" :
                                 "form-control u-stack--sm" }
                     name="twitter_handle"
                     placeholder="Enter Twitter Handle"
                     onKeyDown={this.resetState}
                     onChange={this.validateTwitterHandle}
                     autoComplete />
              { this.state.status.length ?
                <p className={ !this.state.is_loading ?
                                 this.state.is_twitter_handle_valid ?
                                 "code-copier__status-success" :
                                 "code-copier__status-error" :
                               null }>
                  {this.state.status}
                </p> :
                null
              }
              <button onClick={this.copyCode}
                      disabled={ !this.state.is_twitter_handle_valid }
                      className={ this.state.is_twitter_handle_valid ?
                                  "btn btn-success u-stack--sm" :
                                  "btn u-stack--sm" }>
                Click to copy code
              </button>
              <br />
              { !this.state.is_loading && this.state.is_twitter_handle_valid ?
                <div className="u-stack--sm">
                  <a className="code-copier__link" onClick={this.toggleCode}>
                    { this.state.view_code ? "Hide Code" : "Show Code" }
                  </a>
                </div> :
                null
              }
              { !this.state.is_loading && this.state.is_twitter_handle_valid && this.state.view_code ?
                <textarea ref={(text) => { this.textareaCode = text; }}
                          className="clipboard textarea-clipboard u-stack--sm"
                          value={source_code}
                          readOnly /> :
                <div>
                  <a href={this.props.exampleUrl} target="_blank">
                    <ImageHandler className="code-copier__image u-stack--sm"
                                  hidePlaceholder
                                  imageUrl={this.props.imageUrl}
                                  alt={this.props.title} />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.exampleUrl} target="_blank">
                    Click to view example
                  </a>
                </div>
              }
              {/* <a className="code-copier__link" onClick={this.toggleOptions}>
                More Options
              </a> */}
            </div>
          </div>
        );

      default:
        return (
          <div className="col-xs-12 col-sm-6 col-md-4">
            <div className="code-copier">
              <h3 className="h3">{this.props.title}</h3>
              <button className="btn btn-success u-stack--sm" onClick={this.copyCode}>Click to copy code</button>
              <br />
              <div className="u-stack--sm">
                <a className="code-copier__link" onClick={this.toggleCode}>
                  { this.state.view_code ? "Hide Code" : "Show Code" }
                </a>
              </div>
              { this.state.view_code ?
                <textarea ref={(text) => { this.textareaCode = text; }}
                          className="clipboard textarea-clipboard u-stack--sm"
                          value={source_code}
                          readOnly /> :
                <div>
                  <a href={this.props.exampleUrl} target="_blank">
                    <ImageHandler className="code-copier__image u-stack--sm"
                                  hidePlaceholder
                                  imageUrl={this.props.imageUrl}
                                  alt={this.props.title} />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.exampleUrl} target="_blank">
                    Click to view example
                  </a>
                </div>
              }
            </div>
          </div>
        );
    }
  }
}
