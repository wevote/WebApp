import React from "react";
import ItemSupportOppose from "./ItemSupportOppose";

export default class ItemActionBar extends ItemSupportOppose {

  render () {
    if (this.state.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return <div></div>;
    }

    const removePosition = is_support ? this.stopSupportingItem.bind(this) : this.stopOpposingItem.bind(this);
    const positionText = is_support ? "Supports" : "Opposes";
    const itemActionBar =
      <div className="candidate-card__actions">
      { //Show the position voter has taken
        (is_oppose || is_support ) ?
        <button className="position-btn">{positionText}
          <a onClick={removePosition}>Remove Position</a>
        </button> :
        // Voter hasn't supported or opposed, show both options
        <div>
          <button className="support-btn" onClick={this.supportItem.bind(this)}>Support</button>
          <button className="oppose-btn" onClick={this.opposeItem.bind(this)}>Oppose</button>
        </div>
      }
        <button className="share-btn" onClick={this.share.bind(this)} >Share</button>
      </div>;

    return itemActionBar;
  }
}
