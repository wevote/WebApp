import { uploadVideoToDrive } from '../utils/uploadVideosToDriveFromBrowserStack.js';

const sessionId = process.argv[2];

if (!sessionId) {
  console.error('Usage: node DownloadVideo.browser.js <SESSION_ID>');
  process.exit(1);
}

(async () => {
  try {
    await uploadVideoToDrive(sessionId);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
