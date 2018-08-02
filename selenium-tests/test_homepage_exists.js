const {Builder, By, Key, until} = require('selenium-webdriver');
const Assert = require('assert');

const host = "localhost";
const port = 3000;
const authority = host + ":" + port;
const uri = "http://" + authority;

var runTests = 
  (async function (browser) {
    let driver = await new Builder().forBrowser(browser).build();
    let expectedMessage = "Welcome to our Secret Santa or Polyanna site! You can now easily send emails to all your friends and start a secret santa!";
    try {
      await driver.get(uri + "/");
      let element = await driver
		    .findElement(By.name('about'))
		    .getText()
		    .then(function(text) {
                       let testMessage = "Is the about page present and does it contain expecected text\n" + expectedMessage + "actual\n" + text;
                       Assert(expectedMessage == text, testMessage);
		    });
    } catch(error) {
      Assert.fail(error.message);
    } finally {
      await driver.quit();
    }
  });

runTests('firefox')
runTests('chrome')
