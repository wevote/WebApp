'use strict';

import React { Component } from 'react';
import { RouteHandler } from 'react-router';

import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
import Router from 'react-router';
import reactMixin from 'react-mixin';

@reactMixin.decorate(Router.State)
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var navbar;

        if (this.getPathname() !== '/login') {
            navbar = <Navvar />;
        }

        return (
            <div className="container-fluid">
                {navbar}
                <RouteHandler />
                <Footer />
            </div>
        );
    }
};

export default App;
