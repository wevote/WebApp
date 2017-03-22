# Testing WebApp - Overview of Process

## Minimum Browsers
[Click here to see the minimum browser versions](https://docs.google.com/spreadsheets/d/1FlUMCvg1pNIO0IzJm0jQyvUW1YC_KHh-LO4l-OVIcog/edit#gid=1774503729) 
that we support.

## User Interaction Automated Testing with SauceLabs and Selenium

This is where we imitate a Voter interacting with our website. 
In Travis we automate this with a Travis powered test with every pull request. 
In Travis, we reach out to Sauce Labs, and have them run tests recorded with Selenium.

Configuration in WebApp/.travis.yml and WebApp/tests/selenium/interpreter_config.json

Please see /tests/selenium

## Component automated testing

This is where we test one component at a time. 
Currently in Travis we automate this with a Travis powered test with every pull request. 

Configuration in WebApp/.travis.yml and WebApp/package.json

Developers can run “npm run autoTest”

What are the components we want to test separately from user interaction testing?
/src/js/components/AddressBox.jsx

---

[Go back to Readme Home](../../README.md)
