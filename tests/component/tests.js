import React from 'react';
import {render} from 'enzyme';
import {expect} from 'chai';
import FriendsOnlyIndicator from '../../src/js/components/Widgets/FriendsOnlyIndicator.jsx';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// describe('FriendsOnlyIndicator', () => {
//   it('Should have appropriate classname', () => {
//     const wrapper = render(<FriendsOnlyIndicator />);
//     expect(wrapper.find('div')).to.have.className('public-friends-indicator');
//   });
// });
