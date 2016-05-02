import React from "react";
import ItemSupportOppose from "./ItemSupportOppose";

export default class ItemActionBar extends ItemSupportOppose {

  render () {
    const bold = { fontWeight: "bold" };
    if (this.state.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return <div></div>;
    }

    // support toggle functions
    const supportOn = this.supportItem.bind(this);
    const supportOff = this.stopSupportingItem.bind(this);

    // oppose toggle functions
    const opposeOn = this.opposeItem.bind(this);
    const opposeOff = this.stopOpposingItem.bind(this);

    const itemActionBar =
        <div className="item-actionbar row">
          <span className="col-xs-4"
                style={{whiteSpace: "nowrap"}}
                onClick={ is_support ? supportOff : supportOn }>
          <span className={ is_support ? "inline-phone support-emphasis" : "inline-phone" }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-up">
            </span>
            <span style={ is_support ? bold : {} }> Support</span>
          </span>
        </span>
          <span className="col-xs-4"
                style={{whiteSpace: "nowrap"}}
                onClick={ is_oppose ? opposeOff : opposeOn }>
          <span className={ is_oppose ? "inline-phone oppose-emphasis" : "inline-phone" }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-down">
            </span>
            <span style={ is_oppose ? bold : {} }> Oppose</span>
          </span>
        </span>
        <span className="col-xs-4" onClick={this.share.bind(this)} >
          <a className="glyphicon glyphicon-small glyphicon-share-alt">
            Share
          </a>
        </span>
      </div>;

    return itemActionBar;
  }
}
