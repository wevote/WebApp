
// eslint-disable-next-line import/prefer-default-export
export function createSharedIssuesText (issuesInCommonBetweenOrganizationAndVoter) {
  if (!issuesInCommonBetweenOrganizationAndVoter) return ' some of the same values';
  const issuesInCommonBetweenOrganizationAndVoterCount = issuesInCommonBetweenOrganizationAndVoter.length;
  let sharedIssuesText = '';
  if (issuesInCommonBetweenOrganizationAndVoterCount === 0) {
    sharedIssuesText += ' some of the same values';
  } else if (issuesInCommonBetweenOrganizationAndVoterCount === 1) {
    sharedIssuesText += ' ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[0].issue_name;
    sharedIssuesText += '';
  } else if (issuesInCommonBetweenOrganizationAndVoterCount === 2) {
    sharedIssuesText += ' ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[0].issue_name;
    sharedIssuesText += ' and ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[1].issue_name;
    sharedIssuesText += '';
  } else if (issuesInCommonBetweenOrganizationAndVoterCount === 3) {
    sharedIssuesText += ' ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[0].issue_name;
    sharedIssuesText += ', ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[1].issue_name;
    sharedIssuesText += ' and ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[2].issue_name;
    sharedIssuesText += '';
  } else if (issuesInCommonBetweenOrganizationAndVoterCount > 3) {
    sharedIssuesText += ' ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[0].issue_name;
    sharedIssuesText += ', ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[1].issue_name;
    sharedIssuesText += ', ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoter[2].issue_name;
    sharedIssuesText += ' and ';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoterCount - 3;
    sharedIssuesText += ' other value';
    sharedIssuesText += issuesInCommonBetweenOrganizationAndVoterCount > 4 ? 's' : '';
  }
  return sharedIssuesText;
}
