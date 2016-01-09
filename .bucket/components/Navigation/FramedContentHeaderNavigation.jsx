"use strict";

import AskOrShareAction from "components/base/AskOrShareAction";
import React from "react";
import { Link } from "react-router";

export default class FramedContentHeaderNavigation extends React.Component {
    render() {
        return (
<div className="row">
    <nav className="navbar navbar-main navbar-fixed-top bottom-separator">
        <div className="container-fluid">
            <div className="left-inner-addon">
              <Link to="about"><span className="glyphicon glyphicon-small glyphicon-remove"></span></Link>
              <ul className="nav nav-pills pull-right">
                <li><AskOrShareAction link_text={'Share'} /></li>
              </ul>
            </div>
        </div>
    </nav>
</div>
        );
    }
}
