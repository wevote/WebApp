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
      isLoading: false,
      isTwitterHandleValid: false,
      status: "",
      twitterHandle: "",
      viewCode: false,
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

  onOrganizationStoreChange () {
    const result = OrganizationStore.getOrganizationSearchResultsTwitterHandle();

    let status = "";
    if (result.length) {
      status += "Voter guide found!";
    } else {
      status += "Voter guide not found.";
    }

    this.setState({
      isLoading: false,
      isTwitterHandleValid: result.length,
      status,
      twitterHandle: result,
    });
  }

  copyCode () {
    if (this.props.sourceUrl || (!this.props.sourceUrl && this.state.isTwitterHandleValid)) {
      if (this.state.viewCode) {
        this.textareaCode.select();
        //  const successful = document.execCommand("copy");
        document.execCommand("copy");

        showToastSuccess("Code copied to clipboard!");
        // console.log('copy_status', successful);
        // perhaps a tooltip that fades out after a moment should be created
      } else {
        this.setState({
          viewCode: true,
        }, () => this.copyCode());
      }
    }
  }

  resetState () {
    this.setState({
      isLoading: false,
      isTwitterHandleValid: false,
      status: "",
      twitterHandle: "",
      viewCode: false,
    });
  }

  toggleCode () {
    const { viewCode } = this.state;
    this.setState({
      viewCode: !viewCode,
    });
  }

  validateTwitterHandle (event) {
    clearTimeout(this.timer);
    if (event.target.value.length) {
      this.validateTwitterHandleAction(event.target.value);
      this.setState({
        isLoading: true,
        status: "Searching...",
        viewCode: false,
      });
    } else {
      this.resetState();
    }
  }

  validateTwitterHandleAction (twitterHandle) {
    this.timer = setTimeout(() => OrganizationActions.organizationSearch("", twitterHandle, true), 1200);
  }

  render () {
    let { sourceUrl } = this.props;
    renderLog(__filename);
    if (!sourceUrl) sourceUrl = `https://wevote.us/${this.state.twitterHandle}`;

    const sourceCode =
      `<iframe src="${sourceUrl}?we_vote_branding_off=1" width="100%" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>\n<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.3/iframeResizer.min.js"></script>\n<script type="text/javascript">iFrameResize({ checkOrigin:false, heightCalculationMethod: 'max' });</script>`;

    switch (this.props.title) {
      case "Interactive Ballot Tool":
        return (
          <div className="col-xs-12 col-sm-6 col-md-4">
            <div className="code-copier">
              <h3 className="h3">{this.props.title}</h3>
              <button className="btn btn-success u-stack--sm" onClick={this.copyCode} type="button">Click to copy code</button>
              <br />
              <div className="u-stack--sm">
                <a className="code-copier__link" onClick={this.toggleCode}>
                  { this.state.viewCode ? "Hide Code" : "Show Code" }
                </a>
              </div>
              { this.state.viewCode ? (
                <textarea
                  ref={(text) => { this.textareaCode = text; }}
                  className="clipboard textarea-clipboard u-stack--sm"
                  value={sourceCode}
                  readOnly
                />
              ) : (
                <div>
                  <a href={this.props.imageUrl} target="_blank" rel="noopener noreferrer">
                    <ImageHandler
                      className="code-copier__image u-stack--sm"
                      hidePlaceholder
                      imageUrl={this.props.imageUrl}
                      alt={this.props.title}
                    />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.exampleUrl} target="_blank" rel="noopener noreferrer">
                    Click to view example
                  </a>
                </div>
              )}
            </div>
          </div>
        );

      case "Voter Guide Tool":
        return (
          <div className="col-xs-12 col-sm-6 col-md-4">
            <div className="code-copier">
              <h3 className="h3">{this.props.title}</h3>
              <input
                type="text"
                className={this.state.status.length ?
                  "form-control" :
                  "form-control u-stack--sm"}
                name="twitterHandle"
                placeholder="Enter Twitter Handle"
                onKeyDown={this.resetState}
                onChange={this.validateTwitterHandle}
                autoComplete
              />
              { this.state.status.length ? (
                <p className={!this.state.isLoading ?      // eslint-disable-line no-nested-ternary
                  this.state.isTwitterHandleValid ?
                    "code-copier__status-success" :
                    "code-copier__status-error" :
                  null}
                >
                  {this.state.status}
                </p>
              ) : null
              }
              <button
                onClick={this.copyCode}
                disabled={!this.state.isTwitterHandleValid}
                className={this.state.isTwitterHandleValid ?
                  "btn btn-success u-stack--sm" :
                  "btn u-stack--sm"}
                type="button"
              >
                Click to copy code
              </button>
              <br />
              { !this.state.isLoading && this.state.isTwitterHandleValid ? (
                <div className="u-stack--sm">
                  <a className="code-copier__link" onClick={this.toggleCode}>
                    { this.state.viewCode ? "Hide Code" : "Show Code" }
                  </a>
                </div>
              ) : null
              }
              { !this.state.isLoading && this.state.isTwitterHandleValid && this.state.viewCode ? (
                <textarea
                  ref={(text) => { this.textareaCode = text; }}
                  className="clipboard textarea-clipboard u-stack--sm"
                  value={sourceCode}
                  readOnly
                />
              ) : (
                <div>
                  <a href={this.props.exampleUrl} target="_blank" rel="noopener noreferrer">
                    <ImageHandler
                      className="code-copier__image u-stack--sm"
                      hidePlaceholder
                      imageUrl={this.props.imageUrl}
                      alt={this.props.title}
                    />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.exampleUrl} target="_blank" rel="noopener noreferrer">
                    Click to view example
                  </a>
                </div>
              )}
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
              <button className="btn btn-success u-stack--sm" onClick={this.copyCode} type="button">Click to copy code</button>
              <br />
              <div className="u-stack--sm">
                <a className="code-copier__link" onClick={this.toggleCode}>
                  { this.state.viewCode ? "Hide Code" : "Show Code" }
                </a>
              </div>
              { this.state.viewCode ? (
                <textarea
                  ref={(text) => { this.textareaCode = text; }}
                  className="clipboard textarea-clipboard u-stack--sm"
                  value={sourceCode}
                  readOnly
                />
              ) : (
                <div>
                  <a href={this.props.exampleUrl} target="_blank" rel="noopener noreferrer">
                    <ImageHandler
                      className="code-copier__image u-stack--sm"
                      hidePlaceholder
                      imageUrl={this.props.imageUrl}
                      alt={this.props.title}
                    />
                  </a>
                  <br />
                  <a className="code-copier__link" href={this.props.exampleUrl} target="_blank" rel="noopener noreferrer">
                    Click to view example
                  </a>
                </div>
              )}
            </div>
          </div>
        );
    }
  }
}
