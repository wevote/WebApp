"use strict";

import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { Link } from 'react-router';

export default class MoreInforIconAction extends Component {
    static propTypes = {
        we_vote_id: PropTypes.number
    }
    constructor(props) {
        super(props);
    }
	render() {
        var floatRight = {
            float: 'right'
        };
        {/* TODO We need to add a modal popup with info from Ballotpedia */}
        var link_script;
        if (this.props.we_vote_id) {
            link_script = <Link to="ballot">
                <span className="glyphicon glyphicon-small glyphicon-info-sign"></span>
            </Link>;
        } else {
            link_script = <Link to="ballot">
                <span className="glyphicon glyphicon-small glyphicon-info-sign"></span>
            </Link>;
        }
		return (
            <span>
                <span className="glyphicon glyphicon-small glyphicon-info-sign"></span>
            </span>
        );
	}
}
