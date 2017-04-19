import React from 'react';
import {render} from 'enzyme';
import {expect} from 'chai';
import HeaderBar from '../../src/js/components/Navigation/HeaderBar.jsx';


describe('HeaderBar', () => {
  it('Should have appropriate classname', () => {
    const wrapper = render(<HeaderBar />);
    expect(wrapper).to.have.className('page-header');
  });
});
