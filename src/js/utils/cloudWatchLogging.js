import initializejQuery from '../common/utils/initializejQuery';
import { isAndroid, isWebApp } from '../common/utils/isCordovaOrWebApp';
import $ajax from './service';


/**
 * Fork console.log, so that every console.log for the first 30 seconds goes to the Python server
 * and ends up in CloudWatch /ecs/wevote-api, as well as being logged to the JavaScript console.
 */
export default function insertCloudWatchLoggingFork () {
  if (isAndroid() || isWebApp()) {
    return;
  }
  // Store the original console.log function, so we can restore it later
  window.originalConsoleLog = console.log;
  window.logForkTime = performance.now();

  // Override console.log
  console.log = (args) => {
    const duration = performance.now() - window.logForkTime;
    const device = window.device?.model || '';
    if (duration > 30000) {
      // console.log('LOGGING CLOUD WATCH FORK REMOVED AFTER 30 SECONDS');
      console.log = window.originalConsoleLog;
      window.originalConsoleLog = null;
      console.log(args);
    } else {
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
      if (!cloudArgs.includes('AJAX URL')) {
        window.originalConsoleLog.apply(console, argsArray);
        initializejQuery(() => {
          $ajax({
            endpoint: 'logToCloudWatch',
            data: {
              message: cloudArgs,
              error_level: 'ERROR',         // Error is the lowest level that makes into the Python log, and on to CloudWatch
            },
            success: () => {
            },
          });
        });
      }
    }
  };
}

