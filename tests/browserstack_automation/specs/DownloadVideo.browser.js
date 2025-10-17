const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
const { google } = require('googleapis');
const browserStackConfig = require('../config/browserstack.config');

const BROWSERSTACK_USERNAME = browserStackConfig.BROWSERSTACK_USER;
const BROWSERSTACK_ACCESS_KEY = browserStackConfig.BROWSERSTACK_KEY;

const CREDENTIALS_PATH = path.resolve(__dirname, '../capabilities/credentials.json');
const TOKEN_PATH = path.resolve(__dirname, '../capabilities/token.json');
const FOLDER_ID = '12Dy94t7Gg6jTTqZCXEAsGyD20tH5f8AF'; //Replace with your folder ID

const sessionId = process.argv[2];
if (!sessionId) {
  console.error('Please provide the BrowserStack session ID as argument.');
  process.exit(1);
}

const wait = ms => new Promise(res => setTimeout(res, ms));

// Get video URL with retries
const getVideoUrl = async (sessionId, retries = 3, delay = 3000) => {
  const auth = {
    username: BROWSERSTACK_USERNAME,
    password: BROWSERSTACK_ACCESS_KEY,
  };

  const url = `https://api.browserstack.com/automate/sessions/${sessionId}.json`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, { auth });
      const videoUrl = response.data?.automation_session?.video_url;
      if (videoUrl){

        console.log("Video URL fetched successfully:", videoUrl);
        return videoUrl;
      }

      console.log(`Attempt ${attempt}: Video not ready. Retrying in ${delay / 1000}s...`);
      await wait(delay);
    } catch (err) {
      if (attempt === retries) throw new Error(` Failed to fetch video URL: ${err.message}`);
      await wait(delay);
    }
  }

  throw new Error(`Video URL not available after ${retries} attempts`);
};
const waitForVideo = async (videoUrl, maxAttempts = 20, delayMs = 3000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.head(videoUrl); // lightweight check
      if (response.status === 200) {
        console.log(`Video is ready (attempt ${attempt})`);
        return true;
      }
    } catch (err) {
      console.log(`Attempt ${attempt}: Video not ready yet, retrying in ${delayMs/1000}s...`);
    }
    await new Promise(res => setTimeout(res, delayMs));
  }
  throw new Error(`Video not available after ${maxAttempts} attempts`);
};

// Download video with retries
const downloadVideoBrowser = async (videoUrl, outputName, maxRetries = 5, delayMs = 3000) => {
  const outputPath = path.resolve(__dirname, outputName);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Downloading video...`);

      const response = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(outputPath);
        response.data.pipe(stream);
        stream.on('finish', () => {
          console.log(`Video downloaded to: ${outputPath}`);
          resolve(outputPath);
        });
        stream.on('error', reject);
      });

      return outputPath;
    } catch (error) {
      console.error(` Download attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${delayMs / 1000} seconds...`);
        await wait(delayMs);
      } else {
        throw new Error(` Failed to download video after ${maxRetries} attempts`);
      }
    }
  }
};

const authenticateGoogle = async () => {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });

  console.log('Authorize this app by visiting this URL:\n', authUrl);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Enter the code from the page: ', resolve));
  rl.close();

  const tokenResponse = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokenResponse.tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenResponse.tokens));
  return oAuth2Client;
};

const uploadToDrive = async (auth, filePath) => {
  const drive = google.drive({ version: 'v3', auth });
  const fileName = path.basename(filePath);

  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: 'video/mp4',
    body: fs.createReadStream(filePath),
  };

  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink, name',
  });

  console.log(`Uploaded to Google Drive:\n📁 File ID: ${uploadedFile.data.id}\n🔗 Link: ${uploadedFile.data.webViewLink}`);
  return uploadedFile.data; // return full file data including id
};

const deleteAllExcept = async (auth, folderId, excludeFileId) => {
  const drive = google.drive({ version: 'v3', auth });

  const filesInFolder = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
  });

  if (!filesInFolder.data.files.length) {
    console.log('No files found in folder.');
    return;
  }

  console.log('Files currently in folder:');
  filesInFolder.data.files.forEach(file => {
    console.log(` - ${file.name} (ID: ${file.id})`);
  });

  for (const file of filesInFolder.data.files) {
    if (file.id === excludeFileId) {
      console.log(`Skipping file (new upload): ${file.name}`);
      continue;
    }
    try {
      await drive.files.delete({ fileId: file.id });
      console.log(`🗑 Successfully deleted file: ${file.name}`);
    } catch (error) {
      console.error(`Failed to delete file: ${file.name} (ID: ${file.id})`, error.message);
    }
  }

  console.log(`Finished deleting all files except the uploaded one.`);
};
// MAIN
(async () => {
  try {
    console.log(`📹 Fetching video for session: ${sessionId}`);
    const videoUrl = await getVideoUrl(sessionId, 3, 5000);
    const uniqueFileName = `session-${sessionId}-${Date.now()}.mp4`;
    await waitForVideo(videoUrl, 20, 5000);
    const videoPath = await downloadVideoBrowser(videoUrl, uniqueFileName);
    await wait(5000); // Wait for the file to be fully written

    const auth = await authenticateGoogle();

    const uploadedFile = await uploadToDrive(auth, videoPath);

    await wait(5000); // Wait for Drive to register the new file

    await deleteAllExcept(auth, FOLDER_ID, uploadedFile.id);

    console.log('Done: Video uploaded and old files cleaned.');
  } catch (err) {
    console.error('Script failed:', err.stack || err.message);
    process.exit(1);
  }
})();
