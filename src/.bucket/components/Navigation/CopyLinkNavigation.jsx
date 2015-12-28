"use strict";

import { Button, ButtonToolbar } from "react-bootstrap";
import React from "react";
import { Router, Link } from "react-router";

export default class CopyLinkNavigation extends React.Component {
    render() {
        var button_text;
        if (this.props.button_text) {
            button_text = this.props.button_text;
        } else {
            button_text = 'Copy Link to this Page';
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
                    <Button bsStyle="success">{button_text}</Button>
                </div>
            </div>
        </div>
    </div>
</div>
        );
    }
}
