import React from 'react';
import {render} from 'enzyme';
import {expect} from 'chai';
import NavigatorInHeader from '../../src/js/components/Navigation/NavigatorInHeader.jsx';


describe('NavigatorInHeader', () => {
  it('Should have appropriate classname', () => {
    const wrapper = render(<NavigatorInHeader />);
    expect(wrapper).to.have.className('header-nav');
  });
});
