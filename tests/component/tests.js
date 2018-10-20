import React from "react";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import { expect } from "chai";
import FriendsOnlyIndicator from "../../src/js/components/Widgets/FriendsOnlyIndicator.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("FriendsOnlyIndicator", () => {
  it("Should have an appropriate classname", () => {
    const wrapper = mount(<FriendsOnlyIndicator />);
    expect(wrapper.find("span")).to.have.className("public-friends-indicator");
  });
});
