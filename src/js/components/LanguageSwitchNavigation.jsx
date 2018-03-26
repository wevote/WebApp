import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../utils/logging";

export default class LanguageSwitchNavigation extends Component {
    static propTypes = {
        language_selected: PropTypes.string
    };
    constructor (props) {
        super(props);
    }

	render () {
    renderLog(__filename);
		return <span>
            {this.props.language_selected === "chinese" ? <span /> : <span><Link to="home">中国</Link><br /></span>}
            {this.props.language_selected === null ? <span /> : <span><Link to="home">English</Link><br /></span>}
            {this.props.language_selected === "spanish" ? <span /> : <span><Link to="home">Español</Link><br /></span>}
            {this.props.language_selected === "tagalog" ? <span /> : <span><Link to="home">Tagalog</Link><br /></span>}
            {this.props.language_selected === "vietnamese" ? <span /> : <span><Link to="home">tiếng Việt</Link><br /></span>}
        </span>;
	}
}
