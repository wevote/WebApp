import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { browserStackConfig } from '../config/browserstack.config.js';
import { googleDriveConfig } from '../config/googleDrive.config.js';
import { getAuthenticatedDriveClient } from './googleDriveOAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wait = (ms) => new Promise(res => setTimeout(res, ms));

async function getDriveClient() {
  return getAuthenticatedDriveClient();
}

async function getVideoUrl(sessionId) {
  const url = `https://api.browserstack.com/app-automate/sessions/${sessionId}.json`;
  const auth = {
    username: browserStackConfig.BROWSERSTACK_USER,
    password: browserStackConfig.BROWSERSTACK_KEY,
  };

  const maxRetries = 3;
  const delayMs = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, { auth });
      const videoUrl = response.data?.automation_session?.video_url;

      if (videoUrl) {
        console.log(`Video URL fetched: ${videoUrl}`);
        return videoUrl;
      }

      console.log(`Attempt ${attempt}: Video not ready yet. Retrying in ${delayMs / 1000}s...`);
      await wait(delayMs);
    } catch (err) {
      if (attempt === maxRetries) throw new Error(`Failed to fetch video URL: ${err.message}`);
      await wait(delayMs);
    }
  }

  throw new Error(`Video URL not available after ${maxRetries} attempts`);
}

async function downloadVideo(videoUrl, outputPath) {
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

  const maxRetries = 5;
  const delayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Downloading video...`);

      const response = await axios({ url: videoUrl, method: 'GET', responseType: 'stream' });

      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(outputPath);
        response.data.pipe(stream);
        stream.on('finish', () => {
          console.log(`Video downloaded to: ${outputPath}`);
          resolve();
        });
        stream.on('error', reject);
      });

      return outputPath;
    } catch (err) {
      if (attempt === maxRetries) throw new Error(`Failed to download video after ${maxRetries} attempts`);
      console.log(`Retrying in ${delayMs / 1000}s...`);
      await wait(delayMs);
    }
  }
}

async function uploadToDrive(drive, filePath, folderId) {
  const fileName = path.basename(filePath);

  const uploadedFile = await drive.files.create({
    resource: { name: fileName, parents: [folderId] },
    media: { mimeType: 'video/mp4', body: fs.createReadStream(filePath) },
    fields: 'id, webViewLink, name',
    supportsAllDrives: true,
  });

  console.log(`Uploaded to Google Drive: ${uploadedFile.data.name}`);
  console.log(`Link: ${uploadedFile.data.webViewLink}`);

  return uploadedFile.data;
}

export async function uploadVideoToDrive(sessionId) {
  const { BROWSERSTACK_USER, BROWSERSTACK_KEY } = browserStackConfig;
  if (!BROWSERSTACK_USER || !BROWSERSTACK_KEY) {
    throw new Error('BrowserStack credentials missing in browserstack.config.js');
  }

  const folderId = googleDriveConfig.VIDEO_FOLDER_ID;
  if (!folderId) {
    throw new Error('VIDEO_FOLDER_ID not set in googleDrive.config.js');
  }

  console.log(`Fetching video for session: ${sessionId}`);

  const videoUrl = await getVideoUrl(sessionId);

  const outputPath = path.resolve(__dirname, '../../../logs', `session-${sessionId}-${Date.now()}.mp4`);
  console.log('Downloading video...');
  await downloadVideo(videoUrl, outputPath);
  await wait(5000);

  const drive = await getDriveClient();

  console.log('Uploading to Google Drive...');
  const uploadedFile = await uploadToDrive(drive, outputPath, folderId);

  console.log('Done.');
  return uploadedFile;
}

// CLI support: node uploadVideosToDriveFromBrowserStack.js <SESSION_ID>
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const sessionId = process.argv[2];
  if (!sessionId) {
    console.error('Usage: node uploadVideosToDriveFromBrowserStack.js <SESSION_ID>');
    process.exit(1);
  }

  uploadVideoToDrive(sessionId).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
