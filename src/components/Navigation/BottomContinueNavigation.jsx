"use strict";

import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from "react-bootstrap";
import { Router, Link } from "react-router";

export default class BottomContinueNavigation extends Component {
    static propTypes = {
        continue_text: PropTypes.string,
        link_route_cancel: PropTypes.string,
        cancel_text: PropTypes.string,
        link_route_continue: PropTypes.string
    }
    constructor(props) {
        super(props);
    }
    render() {
        var continue_text;
        if (this.props.continue_text) {
            continue_text = this.props.continue_text;
        } else {
            continue_text = 'Continue >';
        }
        var link_route_cancel;
        if (this.props.link_route_cancel) {
            link_route_cancel = this.props.link_route_cancel;
        } else {
            link_route_cancel = 'ballot';
        }
        var cancel_button;
        if (this.props.cancel_text) {
            cancel_button = <Link to={ link_route_cancel }><Button bsStyle="default">{this.props.cancel_text}</Button></Link>;
        } else {
            cancel_button = '';
        }
        var link_route_continue;
        if (this.props.link_route_continue) {
            link_route_continue = this.props.link_route_continue;
        } else {
            link_route_continue = 'ballot';
        }
        var alignCenter = {
            margin: 'auto',
            width: '100%'
        };
        return (
<div className="row">
    <div className="navbar navbar-default navbar-fixed-bottom">
        <div className="container-fluid container-top10 seperator-top">
            <div className="row">
                <div className="col-xs-2 center-block text-center" style={alignCenter}>
                    {cancel_button}
                    <Link to={ link_route_continue } params={ this.props.params }>
                        <Button bsStyle="primary">{continue_text}</Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</div>
        );
    }
}
