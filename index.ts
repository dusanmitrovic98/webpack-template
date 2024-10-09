import chalk from 'chalk';
import * as fs from 'fs';

import { isRunningInBrowser } from './src/utility/browser';
import { Env, requiredVars, setupEnv } from './.core/env';
import { Logger } from './.core/logger';
import { CONFIG } from './src/config';
import { main } from './src/main';
import config from './config.json';

async function initEnv(): Promise<Partial<Env>> {
  if (!isRunningInBrowser) {
    return setupEnv().catch(error => {
      Logger.error('Error:', error.message);
      process.exit(1);
    });
  }

  return Object.entries(CONFIG).reduce((acc, [key, value]) => {
    if (typeof value !== 'object') {
      acc[key as keyof Env] = value as any;
    }
    return acc;
  }, {} as Partial<Env>);
}

function displayEnvironmentInfo(env: Partial<Env>) {
  if (isRunningInBrowser) {
    Logger.header(`${config.APP_NAME!.toUpperCase()} - ${config.ENV!.toUpperCase()} MODE`, true);
    Logger.logSection('Configuration Variables', chalk.yellowBright, true);

    let tempConfig: any = {};

    Object.entries(config).forEach(([key, value]) => {
      if (key != 'environmentVariables' && key !== 'envCheck') {
        tempConfig[key] = value;
      }
    });

    Object.assign(CONFIG, tempConfig);

    Object.entries(CONFIG).forEach(([key, value]) => {
        Logger.logKeyValue(key, value as string, { forceLog: true });
    });
  } else {
    Logger.header(`${env.APP_NAME!.toUpperCase()} - ${env.ENV!.toUpperCase()} MODE`, true);
    Logger.logSection('Environment Variables', chalk.yellowBright, true);

    Object.entries(env).forEach(([key, value]) => {
      if (requiredVars.includes(key) || key !== 'ENV') {
        Logger.logKeyValue(key, value!, { forceLog: true });
      }
    });
  }
}

async function mergeConfigFile(env: Partial<Env>): Promise<void> {
  if (isRunningInBrowser) {
    if (Object.keys(CONFIG).length === 0) {
      Object.assign(CONFIG, config);
    }

    return;
  }

  if (fs.existsSync('config.json')) {
    const fileConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    Object.assign(CONFIG, fileConfig);

    Object.keys(env).forEach(key => {
      if (!(key in CONFIG)) {
        CONFIG[key as keyof typeof CONFIG] = env[key as keyof Env];
      }
    });
  }
}

async function executeMainProgram() {
  Logger.logSection('Main Program', chalk.magenta, true);
  const startTime = performance.now();

  await main(async (response: any) => {
    await Logger.logSection(response.message, chalk.cyan, true);
  }, async (error: any) => {
    await Logger.logSection("Program Failed", chalk.red, true);
    throw error;
  });

  const endTime = performance.now();

  Logger.logKeyValue(
    'Main program execution time',
    `${chalk.green(`${(endTime - startTime).toFixed(2)} ms\n`)}`,
    { forceLog: true },
  );
}

async function startApplication() {
  try {
    const env = await initEnv();
    Logger.clear();
    displayEnvironmentInfo(env);
    await mergeConfigFile(env);
    await executeMainProgram();
  } catch (error: any) {
    Logger.logSection('Error Occurred', chalk.red, true);
    console.error(chalk.red(`${error.message}`));
    throw error;
  }
}

(async () => {
  await startApplication();
})();