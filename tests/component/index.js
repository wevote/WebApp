import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { jsdom } from "jsdom";
require.extensions['.svg'] = () => {};

chai.use(chaiEnzyme());

global.document = jsdom("<!doctype html><html><body></body></html>");
global.window = document.defaultView;
global.navigator = global.window.navigator;
