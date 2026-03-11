export const googleDriveConfig = {
  // URL of the Google Drive folder containing the APK/IPA app files
  // e.g. https://drive.google.com/drive/folders/YOUR_FOLDER_ID
  "FOLDER_URL": "-",

  // Local directory where downloaded app files will be saved
  // e.g. tests/browserstack_automation/apps
  "APPS_DIR": "",

  // Google Drive folder ID where BrowserStack session videos will be uploaded
  // Get it from the folder URL: https://drive.google.com/drive/folders/YOUR_FOLDER_ID
  "VIDEO_FOLDER_ID": "",

  // Timeout (ms) for listing files in Google Drive
  "LIST_TIMEOUT_MS": 30000,

  // Max number of files to fetch per page when listing Drive folder contents
  "LIST_PAGE_SIZE": 100
};

export default {
  googleDriveConfig,
};
