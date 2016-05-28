"use strict";

import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";

class BottomContinueNavigation extends Component {
  static propTypes = {
    cancel_text: PropTypes.string,
    continue_text: PropTypes.string,
    link_route_cancel: PropTypes.string,
    link_route_continue: PropTypes.string,
    params: PropTypes.object.isRequired
  };

    constructor (props) {
        super(props);
    }
    render () {
        var continue_text;
        if (this.props.continue_text) {
            continue_text = this.props.continue_text;
        } else {
            continue_text = "Continue >";
        }
        var link_route_cancel;
        if (this.props.link_route_cancel) {
            link_route_cancel = this.props.link_route_cancel;
        } else {
            link_route_cancel = "ballot";
        }
        var cancel_button;
        if (this.props.cancel_text) {
            cancel_button = <Link to={ link_route_cancel }><Button bsStyle="default">{this.props.cancel_text}</Button></Link>;
        } else {
            cancel_button = "";
        }
        var link_route_continue;
        if (this.props.link_route_continue) {
            link_route_continue = this.props.link_route_continue;
        } else {
            link_route_continue = "ballot";
        }
        var alignCenter = {
            margin: "auto",
            width: "100%"
        };
        return <div className="bs-row">
    <div className="bs-navbar bs-navbar-default bs-navbar-fixed-bottom">
        <div className="bs-container-fluid container-top10 seperator-top">
            <div className="bs-row">
                <div className="bs-col-xs-2 bs-center-block bs-text-center" style={alignCenter}>
                    {cancel_button}
                    <Link to={ link_route_continue } params={ this.props.params }>
                        <Button bsStyle="primary">{continue_text}</Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</div>;
    }
}

export default BottomContinueNavigation;
