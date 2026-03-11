import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { googleDriveOAuthConfig } from '../config/googleDriveOAuth.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.resolve(__dirname, '../config/googleDriveOAuthToken.json');

// Full drive scope covers both read (download) and write (upload).
const SCOPES = ['https://www.googleapis.com/auth/drive'];

function loadSavedToken() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2), 'utf8');
  console.log(`OAuth token cached at: ${TOKEN_PATH}`);
}

function getAuthCodeViaLocalServer(authUrl, redirectUri) {
  const parsed = new URL(redirectUri);
  const port = Number(parsed.port) || 3000;
  const callbackPath = parsed.pathname || '/';

  return new Promise((resolve, reject) => {
    let settled = false;

    function settle(fn, value) {
      if (settled) return;
      settled = true;
      server.close();
      fn(value);
    }

    const server = http.createServer((req, res) => {
      // Ignore any follow-up requests (e.g. favicon) after the callback was handled.
      if (settled) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      try {
        const reqUrl = new URL(req.url, `http://localhost:${port}`);

        if (reqUrl.pathname !== callbackPath) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const code = reqUrl.searchParams.get('code');
        const error = reqUrl.searchParams.get('error');

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h2>Authentication successful. You can close this tab.</h2>');
          settle(resolve, code);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h2>Authentication failed: ${error || 'unknown error'}</h2>`);
          settle(reject, new Error(`OAuth error: ${error || 'unknown'}`));
        }
      } catch (err) {
        res.writeHead(500);
        res.end('Internal server error');
        settle(reject, err);
      }
    });

    server.listen(port, () => {
      console.log('\nOpen the following URL in your browser to authenticate:\n');
      console.log(`  ${authUrl}\n`);
      console.log(`Waiting for OAuth callback on port ${port}...`);
    });

    server.on('error', (err) => settle(reject, err));
  });
}

export async function getAuthenticatedDriveClient() {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = googleDriveOAuthConfig;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      'CLIENT_ID and CLIENT_SECRET must be set in googleDriveOAuth.config.js. ' +
      'Copy googleDriveOAuth.config.template.js to googleDriveOAuth.config.js and fill in your credentials.',
    );
  }

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  const saved = loadSavedToken();
  if (saved) {
    oAuth2Client.setCredentials(saved);
    // Persist any token refresh that happens during API calls.
    oAuth2Client.on('tokens', (newTokens) => {
      const existing = loadSavedToken() || {};
      saveToken({ ...existing, ...newTokens });
    });
    return google.drive({ version: 'v3', auth: oAuth2Client });
  }

  // First run: prompt the user to authenticate via browser.
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  const code = await getAuthCodeViaLocalServer(authUrl, REDIRECT_URI);
  const { tokens } = await oAuth2Client.getToken(code);
  saveToken(tokens);
  oAuth2Client.setCredentials(tokens);
  // Persist any future token refreshes.
  oAuth2Client.on('tokens', (newTokens) => {
    const existing = loadSavedToken() || {};
    saveToken({ ...existing, ...newTokens });
  });

  return google.drive({ version: 'v3', auth: oAuth2Client });
}
