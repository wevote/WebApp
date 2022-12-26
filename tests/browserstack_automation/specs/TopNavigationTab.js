// /tests/browserstack_automation/specs/TopNavigationTab.js


describe("Test Cases", () => {
  it("TopNavigation Tab", async () => {

    // TopNavigation_001
    // openWeVoteHomeLogo
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
