"use strict";

import React from "react";
import { Link } from "react-router";

export default class VolunteerFindGuideSearchNavigation extends React.Component {
    render() {
        return (
<div className="row">
    <nav className="navbar navbar-main navbar-fixed-top bottom-separator">
        <div className="container-fluid">
            <div className="left-inner-addon">
              <Link to="volunteer_choose_task"><span className="glyphicon glyphicon-small glyphicon-remove"></span></Link>
            </div>
        </div>
    </nav>
</div>
        );
    }
}
