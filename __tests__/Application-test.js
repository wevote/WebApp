jest.dontMock('../src/js/Application');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Application = require('../src/js/Application');
const MoreMenu = require('../src/js/components/MoreMenu');

describe('Application ', () => {

    var div = TestUtils.renderIntoDocument(<MoreMenu/>);
    var list = TestUtils.scryRenderedDOMComponentsWithTag(div);

    it('should have a list for sign in', () => {

    });

});


