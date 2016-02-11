import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class LanguageSwitchNavigation extends Component {
    static propTypes = {
        language_selected: PropTypes.string
    };
    constructor(props) {
        super(props);
    }

	render() {
		return (
<span>
    {(this.props.language_selected == "chinese") ? <span></span> : <span><Link to="home">中国</Link><br /></span>}
    {(this.props.language_selected == null) ? <span></span> : <span><Link to="home">English</Link><br /></span>}
    {(this.props.language_selected == "spanish") ? <span></span> : <span><Link to="home">Español</Link><br /></span>}
    {(this.props.language_selected == "tagalog") ? <span></span> : <span><Link to="home">Tagalog</Link><br /></span>}
    {(this.props.language_selected == "vietnamese") ? <span></span> : <span><Link to="home">tiếng Việt</Link><br /></span>}
</span>
        );
	}
}
