import React, { Component, PropTypes } from "react";
import TextTruncate from "react-text-truncate";

export default class ReadMore extends Component {
  static propTypes = {
    text_to_display: PropTypes.node.isRequired,
    link_text: PropTypes.node,
    collapse_text: PropTypes.node,
    num_of_lines: PropTypes.number
  };

    constructor (...args) {
      super(...args);

      this.state = {
        readMore: true
      };
      this.toggleLines = this.toggleLines.bind(this);
    }

    toggleLines (event) {
        event.preventDefault();
        this.setState({
            readMore: !this.state.readMore
        });
    }

    render () {
        let { text_to_display, link_text, num_of_lines, collapse_text } = this.props;
        if (num_of_lines === undefined) {
          num_of_lines = 3;
        }
        if (link_text === undefined) {
          link_text = "More";
        }
        if (collapse_text === undefined) {
          collapse_text = " ...Show Less  ";
        }
        let expanded_text_array = text_to_display.replace(/(?:\r\n|\r|\n){2,}/g, "\r\n\r\n").split(/(?:\r\n|\r|\n)/g);

        let expanded_text_to_display = expanded_text_array.map(function (item, key){
           if (key === 0) {
            return <span key={key}>
              {item}
              </span>;
          } else {
          return <span key={key}>
            <br/>
              {item}
            </span>; }
        });

        if (this.state.readMore) {
          return <span>
            <TextTruncate
                  line={num_of_lines}
                  truncateText="..."
                  text={text_to_display}
                  textTruncateChild={<a href="#" onClick={this.toggleLines}>{link_text}</a>}
              />
          </span>;
        } else {
          return <span>{expanded_text_to_display}<a href="#" onClick={this.toggleLines}>{collapse_text}</a></span>;
        }
    }
}
