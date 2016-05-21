import React from "react";
import ItemSupportOppose from "./ItemSupportOppose";

export default class ItemSupportOpposeCounts extends ItemSupportOppose {

  percentageMajority (){
    const {support_count, oppose_count} = this.state.supportProps;
    return 100 * Math.max(support_count, oppose_count) / (support_count + oppose_count);
  }

  render () {
    if (this.state.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return <span></span>;
    }

    // Do not show this code if there aren't any opinions you follow
    if (support_count === 0 && oppose_count === 0){
      return <span></span>;
    }

    // var oppose_emphasis = "oppose-emphasis-small";
    // if (oppose_count >= 2) {
    //   oppose_emphasis = "oppose-emphasis-medium";
    // }
    //
    // var support_emphasis = "support-emphasis-small";
    // if (support_count === 1) {
    //   support_emphasis = "support-emphasis-medium";
    // } else if (support_count > 1) {
    //   if (support_count - oppose_count > 0) {
    //     support_emphasis = "support-emphasis-large";
    //   } else {
    //     // if there isn"t more support than opposition, then tone down the emphasis to medium
    //     support_emphasis = "support-emphasis-medium";
    //   }
    // }

    return (
      <div className="network-positions">
        <div className="network-positions__support">
          <div className="network-positions__support-icon">
          </div>
          <div className="network-positions__count">
            {support_count}
            <span> Support</span>
          </div>
        </div>
        <div className="network-positions__bar">
        {
          support_count > oppose_count ?
          <div className="network-positions__bar--majority network-positions__bar--support">
            {this.percentageMajority()} % Supports
          </div> :
          <div className="network-positions__bar--majority network-positions__bar--oppose">
            {this.percentageMajority()} % Opposes
          </div>
        }

        </div>
        <div className="network-positions__oppose">
          <div className="network-positions__oppose-icon">
          </div>
          <div className="network-positions__count">
            {oppose_count}
            <span> Oppose</span>
          </div>
        </div>
      </div>);
  }
}
