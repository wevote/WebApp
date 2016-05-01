import React from "react";
import ItemSupportOppose from "./ItemSupportOppose";

export default class ItemActionBar2 extends ItemSupportOppose {

  render () {
    if (this.state.supportProps === undefined){
      return <div></div>;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.state.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      return <div></div>;
    }

    return (<div className="item-actionbar2 row">
              { is_support ?
                <span className="col-xs-4"
                      style={{whiteSpace: "nowrap"}}
                      onClick={ this.stopSupportingItem.bind(this) }>
                    <span className="support-emphasis">
                        {support_count} positive
                        <span className="glyphicon glyphicon-small glyphicon-arrow-up"></span>
                    </span>
                </span> :
                <span className="col-xs-4"
                      onClick={ this.supportItem.bind(this) }>
                    {support_count} positive
                    <span className="glyphicon glyphicon-small glyphicon-arrow-up"></span>
                </span>
        }
        {
            is_oppose ?
                <span className="col-xs-4"
                      style={{whiteSpace: "nowrap"}}
                      onClick={ this.stopOpposingItem.bind(this) }>
                    <span className="oppose-emphasis">
                        {oppose_count} negative
                        <span className="glyphicon glyphicon-small glyphicon-arrow-down"></span>
                    </span>
                </span> :
                <span className="col-xs-4" onClick={ this.opposeItem.bind(this) }>
                    <span>
                        {oppose_count} negative
                        <span className="glyphicon glyphicon-small glyphicon-arrow-down"></span>
                    </span>
                </span>
        }
        <span className="col-xs-4" onClick={this.share.bind(this)} >
          <a className="glyphicon glyphicon-small glyphicon-share-alt">
            Share
          </a>
        </span>
        </div>);
  }
}
