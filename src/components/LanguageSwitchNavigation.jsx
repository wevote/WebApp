import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { Link } from "react-router";

export default class LanguageSwitchNavigation extends React.Component {
	render() {
        var choose_english_html;
        //if (this.props.language_selected == 'english') {
        choose_english_html = ''; {/* Do not show option */}
        //} else {
        //    choose_english_html = <Link to="home">English</Link>;
        //}

        var choose_chinese_html;
        if (this.props.language_selected == 'chinese') {
            choose_chinese_html = ''; {/* Do not show option */}
        } else {
            choose_chinese_html = <Link to="home">中国</Link>;
        }

        var choose_spanish_html;
        if (this.props.language_selected == 'spanish') {
            choose_spanish_html = ''; {/* Do not show option */}
        } else {
            choose_spanish_html = <Link to="home">Español</Link>;
        }

        var choose_tagalog_html;
        if (this.props.language_selected == 'tagalog') {
            choose_tagalog_html = ''; {/* Do not show option */}
        } else {
            choose_tagalog_html = <Link to="home">Tagalog</Link>;
        }

        var choose_vietnamese_html;
        if (this.props.language_selected == 'vietnamese') {
            choose_vietnamese_html = ''; {/* Do not show option */}
        } else {
            choose_vietnamese_html = <Link to="home">tiếng Việt</Link>;
        }
		return (
<span>
    {choose_chinese_html}&nbsp;&nbsp;&nbsp;
    {choose_english_html}&nbsp;&nbsp;&nbsp;
    {choose_spanish_html}&nbsp;&nbsp;&nbsp;
    {choose_tagalog_html}&nbsp;&nbsp;&nbsp;
    {choose_vietnamese_html}&nbsp;&nbsp;&nbsp;
</span>
        );
	}
}
