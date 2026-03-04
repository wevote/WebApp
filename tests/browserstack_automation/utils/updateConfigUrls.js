import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadAppsToBrowserStack } from './uploadAndConfigureApps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE_PATH = path.join(__dirname, '../config/browserstack.config.js');
const CORDOVA_CAPABILITIES_PATH = path.join(__dirname, '../capabilities/cordova_mobile_devices.json');

function updateConfigFile (apkUrl, ipaUrl) {
  console.log('Updating browserstack.config.js...');

  try {
    let configContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');

    // Create backup
    const backupPath = `${CONFIG_FILE_PATH}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, configContent);
    console.log(`Created backup: ${path.basename(backupPath)}`);

    if (apkUrl) {
      configContent = configContent.replace(
        /("BROWSERSTACK_APK_URL":\s*")[^"]*(")/,
        `$1${apkUrl}$2`,
      );
      console.log(`Updated APK URL: ${apkUrl}`);
    }

    if (ipaUrl) {
      configContent = configContent.replace(
        /("BROWSERSTACK_IPA_URL":\s*")[^"]*(")/,
        `$1${ipaUrl}$2`,
      );
      console.log(`Updated IPA URL: ${ipaUrl}`);
    }

    fs.writeFileSync(CONFIG_FILE_PATH, configContent);
    console.log('Successfully updated browserstack.config.js');
  } catch (error) {
    console.error('Error updating config file:', error.message);
    throw error;
  }
}

function updateCapabilityFile (filePath, apkUrl, ipaUrl) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${path.basename(filePath)} - file not found`);
    return;
  }

  console.log(`Updating ${path.basename(filePath)}...`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const capabilities = JSON.parse(content);

    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, content);
    console.log(`Created backup: ${path.basename(backupPath)}`);

    let updated = false;

    capabilities.forEach((cap) => {
      if (cap.platformName === 'android' && apkUrl && cap['appium:options']?.app) {
        cap['appium:options'].app = apkUrl; // eslint-disable-line no-param-reassign
        updated = true;
      }

      if (cap.platformName === 'ios' && ipaUrl && cap['appium:options']?.app) {
        cap['appium:options'].app = ipaUrl; // eslint-disable-line no-param-reassign
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(capabilities, null, 2));
      console.log(`Successfully updated ${path.basename(filePath)}`);
    } else {
      console.log(`No updates needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error updating ${path.basename(filePath)}:`, error.message);
    throw error;
  }
}

async function uploadAndUpdateConfig () {
  console.log('BrowserStack App Upload & Config Update');
  console.log('======================================');

  try {
    console.log('Uploading apps to BrowserStack...');
    const { apkUrl, ipaUrl } = await uploadAppsToBrowserStack();

    if (!apkUrl && !ipaUrl) {
      console.log('No new URLs received - skipping config update');
      return;
    }

    console.log('Updating configuration files...');
    updateConfigFile(apkUrl, ipaUrl);

    console.log('Updating capability files...');
    updateCapabilityFile(CORDOVA_CAPABILITIES_PATH, apkUrl, ipaUrl);

    console.log('Process completed successfully!');
    console.log('Updated URLs:');
    if (apkUrl) console.log(`  Android APK: ${apkUrl}`);
    if (ipaUrl) console.log(`  iOS IPA: ${ipaUrl}`);
  } catch (error) {
    console.error('Process failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  uploadAndUpdateConfig();
}

export { uploadAndUpdateConfig, updateConfigFile };
