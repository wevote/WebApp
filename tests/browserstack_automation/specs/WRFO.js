import { $,driver, expect, browser} from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import WRFOPage from '../page_objects/footer_wrfo.page';
const ExcelData = require('../config/readExcel.js');
  
const { describe, it } = require('mocha');
const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('WRFOPage', () => {
  // WRFO#1
  const excelRead = new ExcelData();
  it('CheckStateUrlLinks', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    console.log("ready page opened");
    excelRead.SheetName = "Sheet1";
    let stName = (await excelRead.read("stateName"));
    let stUrl = (await excelRead.read("stateURL"));
    let stTitle = (await excelRead.read("stateTitle"));

    console.log("state names: " +stName);
    console.log("state urls :" +stUrl);
    console.log("state titles :" +stTitle);

    for (let k=0; k < stName.length; k++ )
    {
      try
      {
        console.log("state name from excel file: " + stName[k]);
        await driver.pause(waitTime);
        await $('//a[@href="/'+stName[k]+'-candidates/cs/"]').click();
        await driver.pause(waitTime);
        console.log("state url from excel file: " + stUrl[k]);
        await expect(browser).toHaveUrl(expect.stringContaining(stUrl[k]));
        await driver.pause(waitTime);
        console.log("state title from excel file: " + stTitle[k]);
        await expect(browser).toHaveTitle(expect.stringContaining(stTitle[k]));
        await driver.pause(waitTime);
        const stSelectBox = await $('#outlined-age-native-simple');
        const visibleText = await stSelectBox.getText()[k];
        console.log("selected state in drop down:"+visibleText);
        await expect(visibleText).toHaveValue(stName, { ignoreCase: true });
        
      }
      catch(ex)
      {
          console.log("Error : " + ex);
          continue;     
      }
    }
});
  });