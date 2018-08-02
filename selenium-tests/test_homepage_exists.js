const {Builder, By, Key, until} = require('selenium-webdriver');
var driver = new Builder().forBrowser('firefox').build();

driver.get('http://localhost:8080/');

driver.findElement(By.name('navbar'));

driver.findElement(By.name('info'));

driver.quit();

