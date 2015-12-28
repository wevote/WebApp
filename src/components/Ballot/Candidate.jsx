import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import StarAction from 'components/StarAction';

export default class Candidate extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    }

    render() {
        let {
            we_vote_id,
            ballot_item_display_name
        }
        = this.props.data;

        console.log(this.props.data);

        return (
            <li className="list-group-item">
                <StarAction we_vote_id={we_vote_id}/>
                <div className="row">
                    <div className="pull-left col-xs-4 col-md-4">
                        <i className="iconXlarge icon-icon-person-placeholder-6-1 icon-light"/>
                    </div>
                    <div className="pull-right col-xs-8 col-md-8">
                        <h4 className="bufferNone">
                            <Link
                                className="linkLight"
                                to="candidate/{we_vote_id}"
                                onlyActiveOnIndex={false}>
                                { ballot_item_display_name }
                            </Link>
                        </h4>
                        <p className="typeXLarge">
                            (NUMBER) support
                            <span className="small"> (more) </span>
                        </p>
                        <p className="bufferNone">
                            (NUMBER) oppose
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="container-fluid">
                        <div className="left-inner-addon">
                            <Link
                                to="ballot"
                                onlyActiveOnIndex={false}
                                className=""
                                >
                                <span
                                    className="glyphicon glyphicon-small glyphicon-arrow-up">
                                </span>
                                Support
                            </Link>
                            <Link
                                to="ballot"
                                onlyActiveOnIndex={false}
                                className=""
                                >
                                <span
                                    className="glyphicon glyphicon-small glyphicon-arrow-down">
                                </span>
                                Oppose
                            </Link>
                            <Link
                                to="ballot"
                                onlyActiveOnIndex={false}
                                className=""
                                >
                                <span
                                    className="glyphicon glyphicon-small glyphicon-comment">
                                </span>
                                Comment
                            </Link>
                            <Link
                                to="ballot"
                                onlyActiveOnIndex={false}
                                className=""
                                >
                                <span
                                    className="glyphicon glyphicon-small glyphicon-share-alt">
                                </span>
                                Ask or Share
                            </Link>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}
