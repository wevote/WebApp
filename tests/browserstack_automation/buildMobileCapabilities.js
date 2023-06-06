const axios = require('axios');
const { writeFileSync } = require('fs');
const browserStackConfig = require('./config/browserstack.config');

// Visit https://www.browserstack.com/docs/app-automate/api-reference/appium/devices#get-device-list for details

async function fetchMobileDevices () {
  const url = 'https://api-cloud.browserstack.com/app-automate/devices.json';
  try {
    const response = await axios({
      url,
      withCredentials: true,
      auth: {
        username: browserStackConfig.BROWSERSTACK_USER,
        password: browserStackConfig.BROWSERSTACK_KEY,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function buildMobileCapabilities () {
  const mobileDevices = await fetchMobileDevices();
  const mobileCapabilities = [];
  for (let i = 0; i < mobileDevices.length; i++) {
    const capability = mobileDevices[i];
    if (capability.os === 'ios' && browserStackConfig.BROWSERSTACK_IPA_URL) {
      capability['appium:options'] = {};
      capability['appium:options'].app = browserStackConfig.BROWSERSTACK_IPA_URL;
    }
    if (capability.os === 'android' && browserStackConfig.BROWSERSTACK_APK_URL) {
      capability['appium:options'] = {};
      capability['appium:options'].app = browserStackConfig.BROWSERSTACK_APK_URL;
    }
    if (capability['appium:options']) {
      capability['appium:options'].platformVersion = capability.os_version;
      capability['appium:options'].deviceName = capability.device;
      capability['appium:options'].autoWebview = true;
      capability['bstack:options'] = {};
      capability['bstack:options'].appiumVersion = '2.0.0';
      capability['bstack:options'].automationVersion = 'latest';
      capability.platformName = capability.os;
      // Delete extra keys
      delete capability.os;
      delete capability.os_version;
      delete capability.device;
      delete capability.realMobile;
      mobileCapabilities.push(capability);
    }
  }
  const data = JSON.stringify(mobileCapabilities, null, 2);
  try {
    writeFileSync('./tests/browserstack_automation/capabilities/mobile.json', data);
  } catch (error) {
    console.error(error);
  }
}

buildMobileCapabilities();
