import React, { PropTypes, Component } from "react";
import ImageHandler from "../ImageHandler";
import { showToastSuccess } from "../../utils/showToast";

export default class CodeCopier extends Component {
  static propTypes = {
    children: PropTypes.node,
    imageUrl: PropTypes.string,
    title: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      twitter_handle: "",
      view_code: false,
    };

    this.copyCode = this.copyCode.bind(this); // I'd forget my context if it wasn't bound
    this.toggleCode = this.toggleCode.bind(this);
    this.validateTwitterHandle = this.validateTwitterHandle.bind(this);
  }

  copyCode () {
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

  toggleCode () {
    this.setState({
      view_code: !this.state.view_code,
    });
  }

  validateTwitterHandle (event) {
    this.setState({
      twitter_handle: event.target.value,
    });
  }

  render () {
    return (
      <div className="col-xs-12 col-sm-6 col-md-4">
        { this.props.imageUrl && this.props.imageUrl.length ?
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
                        defaultValue={this.props.children} /> :
              <div>
                <ImageHandler className="code-copier__image u-stack--sm"
                              hidePlaceholder
                              imageUrl={this.props.imageUrl}
                              alt={this.props.title} />
                <br />
                <a className="code-copier__link" href={this.props.imageUrl} target="_blank">
                  Click to view full size
                </a>
              </div>
            }
          </div> :
          // Voter Guide Tool
          <div className="code-copier">
            <h3 className="h3">{this.props.title}</h3>
            <input type="text"
                   className="form-control u-stack--sm"
                   name="twitter_handle"
                   placeholder="Enter Twitter Handle"
                   onChange={this.validateTwitterHandle}
                   autoComplete />
            <button className="btn u-stack--sm" onClick={this.copyCode}>Click to copy code</button>
            <br />
            <div className="u-stack--sm">
              <a className="code-copier__link" onClick={this.toggleCode}>
                { this.state.view_code ? "Hide Code" : "Show Code" }
              </a>
            </div>
            { this.state.view_code ?
              <textarea ref={(text) => { this.textareaCode = text; }}
                        className="clipboard textarea-clipboard u-stack--sm"
                        defaultValue={this.props.children} /> :
              null
            }
            {/* <a className="code-copier__link" onClick={this.toggleOptions}>
              More Options
            </a> */}
          </div>
        }
      </div>
    );
  }
}
