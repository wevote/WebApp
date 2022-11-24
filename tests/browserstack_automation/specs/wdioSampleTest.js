// Webdriverio-browserstack Integration Sample Test
// Created on 11-21-2022

/* --- Mocha Info ---
Resource URL: https://codeburst.io/how-to-test-javascript-with-mocha-the-basics-80132324752e

Mocha is a testing framework used to organize and execute tests.

When writing a test, there are two basic function calls you should be
aware of: describe() and it().

The describe() function is a way to group our tests. It takes in two arguments:
  1) The name of the test suite - String
  2) A callback function to perform - Function

The it() function is used for an individual test case. It takes in two arguments:
  1) The name of the test - String
  2) A callback function to perform - Function
*/

/* --- Webdriverio Selector Info ---
  Resource URL: https://webdriver.io/docs/selectors/

  Find element by id:
    const element = await $('#elementId')

  Find element by text:
    const element = await $('=elementText')

  Find element by partial text:
    const element = await $('*=elementText')

  Find element by className:
    const element = await $('.className')

  Visit resource url for more ways to access elements in the DOM
*/


describe("Top Navigation Test Suite", () => {
  it("openBallotTab", async () => {

    // Go to the WeVote Quality Site
    await browser.url("https://quality.wevote.us/");

    // Check that the page has loaded (Check title matches "Ready to Vote? - We Vote")
    await browser.waitUntil(
      async () => (await browser.getTitle()).match(/Ready to Vote\? - We Vote/),
      5000,
      "Title didn't match with Ready to Vote? - We Vote"
    );

    // Find the Ballot Tab element by id and click on it
    const ballotTabHeaderBar = await $('#ballotTabHeaderBar');
    await ballotTabHeaderBar.click();

    // Check that the correct page loaded (Check that the title of the
    // current page matches "Ballot - We Vote"
    await browser.waitUntil(
      async () => (await browser.getTitle()).match(/Ballot - We Vote/),
      5000,
      "Title didn't match with Ballot - We Vote"
    );
  });
});
