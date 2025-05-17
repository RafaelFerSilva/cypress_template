import { defineConfig } from "cypress";
import allureWriter from '@shelex/cypress-allure-plugin/writer';

const urls = {
  uat: 'https://demoqa.com/',
  rc: 'https://demoqa.com/',
  prod: 'https://demoqa.com/'
};

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      const environment = config.env.ENV || 'uat';
      config.baseUrl = urls[environment];
      return config;
    },
    chromeWebSecurity: false,
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    trashAssetsBeforeRuns: true,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
