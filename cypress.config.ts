import fs from 'fs';
import 'dotenv/config';
import { defineConfig } from "cypress";
import allureWriter from '@shelex/cypress-allure-plugin/writer';
import { DatabaseManager } from "./cypress/plugins/databaseManager";


// Configurações de ambiente
const urls = {
  uat: 'https://demoqa.com/',
  rc: 'https://demoqa.com/',
  prod: 'https://demoqa.com/'
};

// Configuração do banco de dados
const dbConfig = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_NAME: process.env.DB_NAME || 'testdb',
  DB_USER: process.env.DB_USER || 'testuser',
  DB_PASSWORD: process.env.DB_PASSWORD || 'testpassword',
};

// Instância do gerenciador de banco de dados
let db: DatabaseManager | null = null;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuração do Allure
      allureWriter(on, config);
      
      // Configuração do ambiente
      const environment = config.env.ENV || 'uat';
      config.baseUrl = urls[environment];

      // Configuração das tasks de banco de dados
      on('task', {
        async dbConnect() {
          console.log('Connecting to database...');
          try {
            db = new DatabaseManager(dbConfig);
            await db.connect();
            console.log('Database connected successfully');
            return { success: true };
          } catch (error) {
            console.error('Database connection failed:', error);
            return { success: false, error: error.message };
          }
        },
        
        async dbExecuteScript({ scriptPath }) {
          console.log(`Executing SQL script: ${scriptPath}`);
          try {
            if (!db) {
              throw new Error('Database not connected');
            }
            
            // Ler o SQL do arquivo
            const sql = fs.readFileSync(scriptPath, 'utf-8').trim();
            if (!sql) {
              throw new Error('Script file is empty');
            }
            
            // Executar o SQL
            const rows = await db.executeScript(scriptPath);
            
            return {
              success: true,
              sql,
              rows
            };
          } catch (error) {
            console.error('SQL execution failed:', error);
            return { success: false, error: error.message };
          }
        },
        
        async dbReplaceAndExecute({ scriptPath, values }) {
          console.log(`Executing SQL script with replacements: ${scriptPath}`);
          try {
            if (!db) {
              throw new Error('Database not connected');
            }
            
            // Ler o SQL original
            const originalSql = fs.readFileSync(scriptPath, 'utf-8').trim();
            if (!originalSql) {
              throw new Error('Script file is empty');
            }
            
            // Executar com substituições
            const result = await db.replaceValuesAndExecuteScript(scriptPath, values);
            
            return {
              success: true,
              originalSql,
              modifiedSql: result.modifiedSql,
              rows: result.rows
            };
          } catch (error) {
            console.error('SQL execution with replacements failed:', error);
            return { success: false, error: error.message };
          }
        },
        
        async dbClose() {
          console.log('Closing database connection...');
          try {
            if (db) {
              await db.closeConnection();
              db = null;
              console.log('Database connection closed successfully');
            } else {
              console.log('No database connection to close');
            }
            return { success: true };
          } catch (error) {
            console.error('Error closing database:', error);
            return { success: false, error: error.message };
          }
        },
      });

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
