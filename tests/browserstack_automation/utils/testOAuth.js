// Quick smoke-test for the OAuth helper.
// Run with: node tests/browserstack_automation/utils/testOAuth.js
//
// First run: opens browser auth, writes token to googleDriveOAuthToken.json
// Subsequent runs: uses cached token, lists Drive root to confirm access.

import { getAuthenticatedDriveClient } from './googleDriveOAuth.js';

(async () => {
  console.log('Getting authenticated Drive client...');
  const drive = await getAuthenticatedDriveClient();

  console.log('Authenticated. Listing files in Drive root...');
  const res = await drive.files.list({
    pageSize: 5,
    fields: 'files(id, name, mimeType)',
  });

  const files = res.data.files || [];
  if (!files.length) {
    console.log('No files found (empty Drive or no access).');
  } else {
    console.log('Files:');
    files.forEach((f) => console.log(`  ${f.name} (${f.mimeType})`));
  }

  console.log('\nOAuth test passed.');
})().catch((err) => {
  console.error('OAuth test failed:', err.message);
  process.exit(1);
});
