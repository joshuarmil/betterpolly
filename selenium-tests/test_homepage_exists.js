const { Builder, By, Key, until } = require('selenium-webdriver');
const Assert = require('assert');

const host = 'localhost';
const port = 3000;
const authority = host + ':' + port;
const uri = 'http://' + authority;

var webdriver = require('selenium-webdriver');

var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {
  args: [
    '--test-type',
    '--start-maximized',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
};
chromeCapabilities.set('chromeOptions', chromeOptions);

var firefoxDriver = new webdriver.Builder().forBrowser('firefox').build();

var chromeDriver = new webdriver.Builder()
  .forBrowser('chrome')
  .withCapabilities(chromeCapabilities)
  .build();

var runTests = async function(driver) {
  let expectedMessage =
    'Welcome to our Secret Santa or Polyanna site! You can now easily send emails to all your friends and start a secret santa!';
  try {
    await driver.get(uri + '/');
    let element = await driver
      .findElement(By.name('about'))
      .getText()
      .then(function(text) {
        let testMessage =
          'Is the about page present and does it contain expecected text\n' +
          expectedMessage +
          'actual\n' +
          text;
        Assert(expectedMessage == text, testMessage);
      });
  } catch (error) {
    Assert.fail(error.message);
  } finally {
    await driver.quit();
  }
};

runTests(firefoxDriver);
runTests(chromeDriver);
