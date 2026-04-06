// Copy this file to googleDriveOAuth.config.js and fill in your OAuth 2.0 credentials.
// googleDriveOAuth.config.js is listed in .gitignore and must never be committed.
//
// How to create credentials:
//   1. Go to https://console.cloud.google.com/apis/credentials
//   2. Create an OAuth 2.0 Client ID
//   3. Application type: "Web application" (for localhost redirect) or "Desktop app"
//   4. Under "Authorized redirect URIs", add: http://localhost:3000/oauth2callback
//   5. Download the JSON and copy the values below.

export const googleDriveOAuthConfig = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  // Must match the redirect URI registered in Google Cloud Console
  REDIRECT_URI: 'http://localhost:3000/oauth2callback',
};


