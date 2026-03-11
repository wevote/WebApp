import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { googleDriveConfig } from '../config/googleDrive.config.js';
import { getAuthenticatedDriveClient } from './googleDriveOAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_APPS_DIR = path.resolve(__dirname, '../apps');

function getArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((v) => v.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function extractFolderId(input) {
  if (!input) return null;
  const trimmed = input.trim();

  if (!/[\\/?&]/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

async function getDriveClient() {
  return getAuthenticatedDriveClient();
}

async function listFolderFiles(drive, folderId) {
  const start = Date.now();

  try {
    const timeoutMs = Number(googleDriveConfig.LIST_TIMEOUT_MS) || 30000;
    const pageSize = Number(googleDriveConfig.LIST_PAGE_SIZE) || 100;

    const res = await drive.files.list(
      {
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        pageSize,
      },
      {
        timeout: timeoutMs,
      },
    );

    const elapsedMs = Date.now() - start;
    console.log(`Listed files in ${(elapsedMs / 1000).toFixed(1)}s`);

    return res.data.files || [];
  } catch (error) {
    throw new Error(`Error listing files from Drive (possible slow network or access issue): ${error.message}`);
  }
}

async function downloadDriveFile(drive, file, targetDir) {
  // Sanitize filename for cross-platform compatibility (Windows forbids: \ / : * ? " < > |)
  const sanitizedName = file.name.replace(/[\\/:*?"<>|]/g, '-');
  const targetPath = path.join(targetDir, sanitizedName);

  await fs.promises.mkdir(targetDir, { recursive: true });

  return new Promise((resolve, reject) => {
    drive.files
      .get({ fileId: file.id, alt: 'media' }, { responseType: 'stream' })
      .then((res) => {
        const dest = fs.createWriteStream(targetPath);
        res.data
          .on('error', (err) => {
            dest.close();
            reject(err);
          })
          .pipe(dest)
          .on('finish', () => {
            dest.close();
            resolve(targetPath);
          })
          .on('error', (err) => {
            dest.close();
            reject(err);
          });
      })
      .catch(reject);
  });
}

export async function downloadAppsFromDriveFolder(options = {}) {
  const configFolderUrl = googleDriveConfig.FOLDER_URL || '';
  const configAppsDir = googleDriveConfig.APPS_DIR || '';

  const folderInput = options.folderUrl || configFolderUrl || getArg('folder');
  const appsDir = options.appsDir || configAppsDir || getArg('apps-dir') || DEFAULT_APPS_DIR;

  if (!folderInput) {
    throw new Error('Provide --folder=<Google-Drive-folder-URL-or-ID>');
  }

  const folderId = extractFolderId(folderInput);
  if (!folderId) {
    throw new Error('Could not extract folder ID from the provided folder argument');
  }

  console.log(`Using folder ID: ${folderId}`);
  console.log(`Apps directory: ${appsDir}`);

  const drive = await getDriveClient();

  console.log('Listing files in folder...');
  const files = await listFolderFiles(drive, folderId);

  if (!files.length) {
    throw new Error('No files found in the specified folder');
  }

  const apkCandidates = files.filter((f) => f.name.toLowerCase().endsWith('.apk'));
  const ipaCandidates = files.filter((f) => f.name.toLowerCase().endsWith('.ipa'));

  console.log('\nFiles in folder:');
  files.forEach((f) => {
    const sizeMB = f.size ? (Number(f.size) / (1024 * 1024)).toFixed(2) : '0.00';
    console.log(`- ${f.name} (${sizeMB} MB)`);
  });

  if (!apkCandidates.length && !ipaCandidates.length) {
    throw new Error('No .apk or .ipa files found in the specified folder');
  }

  const result = {};

  if (apkCandidates.length) {
    const apkFile = apkCandidates[0];
    console.log(`\nDownloading APK: ${apkFile.name}`);
    result.apkPath = await downloadDriveFile(drive, apkFile, appsDir);
  }

  if (ipaCandidates.length) {
    const ipaFile = ipaCandidates[0];
    console.log(`\nDownloading IPA: ${ipaFile.name}`);
    result.ipaPath = await downloadDriveFile(drive, ipaFile, appsDir);
  }

  return { ...result, appsDir };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  downloadAppsFromDriveFolder()
    .then(({ apkPath, ipaPath, appsDir }) => {
      console.log('\nDownload complete.');
      console.log(`Apps folder: ${appsDir}`);
      if (apkPath) console.log(`APK: ${apkPath}`);
      if (ipaPath) console.log(`IPA: ${ipaPath}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Download failed:', err.message);
      process.exit(1);
    });
}
