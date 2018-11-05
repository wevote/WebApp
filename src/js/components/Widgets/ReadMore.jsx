import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import TextTruncate from "react-text-truncate";

export default class ReadMore extends Component {
  static propTypes = {
    text_to_display: PropTypes.node.isRequired,
    link_text: PropTypes.node,
    collapse_text: PropTypes.node,
    num_of_lines: PropTypes.number,
    className: PropTypes.string,
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
    // this onKeyDown function is for accessibility: both toggle links
    // have a tab index so that users can use tab key to select the link, and then
    // press either space or enter (key codes 32 and 13, respectively) to toggle
    onKeyDown (event) {
      let enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
        this.toggleLines(event);
      }
    }

    render () {
      renderLog(__filename);
        let { text_to_display, link_text, num_of_lines, collapse_text } = this.props;
        // default prop valuess
        if (num_of_lines === undefined) {
          num_of_lines = 3;
        }
        if (link_text === undefined) {
          link_text = "More";
        }
        if (collapse_text === undefined) {
          collapse_text = "Show Less  ";
        }

        // remove extra ascii carriage returns or other control text
        text_to_display = text_to_display.replace(/[\x0D-\x1F]/g, "");
        // convert text into array, splitting on line breaks
        let expanded_text_array = text_to_display.replace(/(?:\r\n|\r|\n){2,}/g, "\r\n\r\n").split(/(?:\r\n|\r|\n)/g);

        // There are cases where we would like to show line breaks when there is a little bit of text
        let not_enough_text_to_truncate = false;
        let all_lines_short = true;
        let max_num_of_lines = num_of_lines;
        // max num of lines shouldn't be greater than the total num of line breaks hard coded
        if (max_num_of_lines > expanded_text_array.length) {
          max_num_of_lines = expanded_text_array.length;
        }
        for ( var i = 0; i < max_num_of_lines; i++) {
          if (expanded_text_array[i].length > 38) {
            all_lines_short = false;
            break;
          }
        }
        if (expanded_text_array.length <= num_of_lines && all_lines_short) {
          not_enough_text_to_truncate = true;
        }
        // wrap text in array in separate spans with html line breaks
        let expanded_text_to_display = expanded_text_array.map(function (item, key){
          if (key === 0) {
            return <span key={key}>
              {item}
              </span>;
          } else if (key >= expanded_text_array.length - 2 && item === "") {
            return <span key={key}>
              {item}
              </span>;
          } else {
            return <span key={key}>
              <br/>
              {item}
              </span>;
          }
        });

        if (not_enough_text_to_truncate) {
          return <span className={this.props.className}>{expanded_text_to_display}</span>;
        }
        if (this.state.readMore) {
          return <span>
            <TextTruncate
                  containerClassName={this.props.className}
                  line={num_of_lines}
                  truncateText="..."
                  text={text_to_display}
                  textTruncateChild={<a tabIndex="0"
                                        href="#"
                                        onClick={this.toggleLines}
                                        onKeyDown={this.onKeyDown.bind(this)}>
                                      {link_text}
                                     </a>
                                    }
              />
          </span>;
        } else {
          return <span tabIndex="0" className={this.props.className}> {expanded_text_to_display}&nbsp;&nbsp;
            <a tabIndex="0"
               href="#"
               onClick={this.toggleLines}
               onKeyDown={this.onKeyDown.bind(this)}>
              {collapse_text}
            </a>
          </span>;
        }
    } //end render
  }
