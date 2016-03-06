import React, { Component, PropTypes } from "react";
import ItemSupportOppose from "./ItemSupportOppose";

export default class ItemSupportOpposeCounts extends ItemSupportOppose {

  render () {
    if (this.state.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return <div></div>;
    }

    var oppose_emphasis = "oppose-emphasis-small";
    if (oppose_count >= 2) {
      oppose_emphasis = "oppose-emphasis-medium";
    }

    var support_emphasis = "support-emphasis-small";
    if (support_count === 1) {
      support_emphasis = "support-emphasis-medium";
    } else if (support_count > 1) {
      if (support_count - oppose_count > 0) {
        support_emphasis = "support-emphasis-large";
      } else {
        // if there isn"t more support than opposition, then tone down the emphasis to medium
        support_emphasis = "support-emphasis-medium";
      }
    }

    return (
      <ul className="list-style--none">
        <li className="list-inline support">
          <span className={ support_emphasis }>
            <span>{support_count}</span>&nbsp;
            <span>positive</span>
          </span>,
        </li>
        <li className="list-inline oppose">
          <span className={ oppose_emphasis }>
            <span>{oppose_count}</span>&nbsp;
            <span>negative</span>
          </span>
        </li>
      </ul>
    );
  }
}
