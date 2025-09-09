import initializejQuery from '../common/utils/initializejQuery';
import { isAndroid, isWebApp } from '../common/utils/isCordovaOrWebApp';
import webAppConfig from '../config';
import $ajax from './service';


/**
 * Fork console.log, so that every console.log for the first 30 seconds goes to the Python server
 * and ends up in CloudWatch /ecs/wevote-api, as well as being logged to the JavaScript console.
 */
export default function insertCloudWatchLoggingFork () {
  if (
    isAndroid() ||
    isWebApp() ||
    (webAppConfig?.LOG_TO_CLOUD_WATCH === undefined) ||
    webAppConfig.LOG_TO_CLOUD_WATCH === false) {
    return;
  }
  // Store the original console.log function, so we could restore it later
  window.originalConsoleLog = console.log;
  window.logForkTime = performance.now();

  // Override console.log
  console.log = (args) => {
    window.originalConsoleLog.apply(console, [args]);  // plain old console.log
    const duration = performance.now() - window.logForkTime;
    const device = window.device?.model || '';
    let argsArray;
    let cloudArgs;
    if (typeof args === 'string') {
      cloudArgs = `(${device}): ${args}`;
      argsArray = {
        message: `(${device}): ${args}`,
      };
    } else {
      argsArray = Array.from(args); // Convert arguments object to an array
      argsArray.push = { device };
      cloudArgs = argsArray.join(',');
    }
    if (duration < 30000 && !cloudArgs.includes('AJAX URL')) {
      initializejQuery(() => {
        $ajax({
          endpoint: 'logToCloudWatch',
          data: {
            message: cloudArgs,
            error_level: 'ERROR',   // Error is the lowest level that makes into the Python log, and on to CloudWatch
          },
          success: () => {
          },
        });
      });
    }
  };
}
