
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { browserStackConfig } from '../config/browserstack.config.js';
const APPS_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), '../apps');

// --- Helper: Get the latest app file by extension (.apk / .ipa) ---
function getAppFile(extension) {
  if (!fs.existsSync(APPS_DIR)) {
    throw new Error(`Apps folder not found at ${APPS_DIR}`);
  }

  const files = fs.readdirSync(APPS_DIR).filter(f => f.endsWith(extension));
  if (files.length === 0) {
    console.log(`No ${extension} file found in apps folder. Skipping upload for this platform.`);
    return null;
  }

  // Pick the latest by modified time
  const latestFile = files
    .map(f => ({
      name: f,
      mtime: fs.statSync(path.join(APPS_DIR, f)).mtime,
    }))
    .sort((a, b) => b.mtime - a.mtime)[0].name;

  return path.join(APPS_DIR, latestFile);
}

// --- Helper: Upload a single app to BrowserStack ---
async function uploadApp(filePath) {
  if (!filePath) return null;

  console.log(`Uploading app: ${path.basename(filePath)}`);

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      'https://api-cloud.browserstack.com/app-automate/upload',
      form,
      {
        auth: {
          username: browserStackConfig.BROWSERSTACK_USER,
          password: browserStackConfig.BROWSERSTACK_KEY,
        },
        headers: form.getHeaders(),
      }
    );

    if (!response.data || !response.data.app_url) {
      throw new Error(`Upload failed: No app_url returned for ${path.basename(filePath)}`);
    }

    console.log(`Upload successful for ${path.basename(filePath)} → ${response.data.app_url}`);
    console.log('Full response from BrowserStack:', JSON.stringify(response.data, null, 2));

    return response.data.app_url;
  } catch (err) {
    if (err.response && err.response.status === 422) {
      console.error('Upload failed (422 Unprocessable Entity): possibly invalid app file.');
    }
    throw new Error(`Failed to upload ${path.basename(filePath)}: ${err.message}`);
  }
}

// --- Main: Upload both apps ---
export async function uploadAppsToBrowserStack() {
  console.log('[uploadAndConfigureApps] Starting upload process...');
  console.log('[uploadAndConfigureApps] Using config from browserstack.config.js');

  const { BROWSERSTACK_USER, BROWSERSTACK_KEY } = browserStackConfig;

  if (!BROWSERSTACK_USER || !BROWSERSTACK_KEY) {
    throw new Error('BrowserStack credentials missing in browserstack.config.js');
  }

  const apkPath = getAppFile('.apk');
  const ipaPath = getAppFile('.ipa');

  if (!apkPath && !ipaPath) {
    console.log('No app files found in apps folder. Skipping uploads.');
    return { apkUrl: null, ipaUrl: null };
  }

  const apkUrl = await uploadApp(apkPath);
  const ipaUrl = await uploadApp(ipaPath);

  return { apkUrl, ipaUrl };
}


