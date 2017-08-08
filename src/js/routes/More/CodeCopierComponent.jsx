import React from "react";

export default class CodeCopier extends React.Component {
  constructor (props){
    super(props);

    this.copyCode = this.copyCode.bind(this); // I'd forget my context if it wasn't bound
  }

  copyCode () {
    this.textareaCode.select();
    //  const successful = document.execCommand("copy");
    document.execCommand("copy");

    // console.log('copy_status', successful);
    // perhaps a tooltip that fades out after a moment should be created
  }

  render () {
    return (
      <div className="code-copier">
        <textarea ref={(text) => { this.textareaCode = text; }} className="clipboard" defaultValue={this.props.children} />
        <button className="btn-success" onClick={this.copyCode}>Click to copy code</button>
      </div>
    );
  }
}