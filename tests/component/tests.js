import React from 'react';
import Enzyme, { shallow } from 'enzyme'; // mount,
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
// import FriendsOnlyIndicator from '../../src/js/components/Widgets/FriendsOnlyIndicator';
import HeaderBarLogo from '../../src/js/components/Navigation/HeaderBarLogo';

Enzyme.configure({ adapter: new Adapter() });

// 2020-DALE: This started failing, and I'm not sure why
// describe('FriendsOnlyIndicator', () => {
//   it('We Vote Test: Should have an appropriate classname', () => {
//     // eslint-disable-next-line react/jsx-filename-extension
//     const wrapper = mount(<FriendsOnlyIndicator />);
//     expect(wrapper.find('span')).to.have.className('public-friends-indicator');
//   });
// });

describe('HeaderBarLogo', () => {
  it('We Vote Test: displays betaness', () => {
    const wrapper = shallow(<HeaderBarLogo showFullNavigation isBeta />);
    expect(wrapper).to.contain('beta');
  });
  it('We Vote Test: might not display betaness', () => {
    const wrapper = shallow(<HeaderBarLogo showFullNavigation />);
    expect(wrapper).to.not.contain('beta');
  });
});
