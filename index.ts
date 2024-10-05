import chalk from 'chalk';

import { Env, requiredVars, setupEnv } from './.core/env';
import { Logger } from './.core/logger';
import { CONFIG } from './src/config';
import { main } from './src/main';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

async function setupEnvironment(): Promise<Partial<Env>> {
  if (!isBrowser) {
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

function logEnvironmentVariables(env: Partial<Env>) {
  Logger.header(`${env.APP_NAME!.toUpperCase()} - ${env.ENV!.toUpperCase()} MODE`, true);
  Logger.logSection('Environment Variables', chalk.yellowBright, true);

  Object.entries(env).forEach(([key, value]) => {
    if (requiredVars.includes(key) || key !== 'ENV') {
      Logger.logKeyValue(key, value!, true);
    }
  });
}

async function runMainProgram() {
  Logger.logSection('Main Program', chalk.magenta, true);
  const startTime = performance.now();
  await main();
  const endTime = performance.now();

  Logger.logSection('Program Completed', chalk.cyan, true);
  Logger.logKeyValue(
    'Main program execution time',
    `${chalk.green(`${(endTime - startTime).toFixed(2)} ms\n`)}`,
    true
  );
}

async function start() {
  try {
    Logger.clear();
    const env = await setupEnvironment();
    logEnvironmentVariables(env);
    await runMainProgram();
  } catch (error: any) {
    Logger.logSection('Error Occurred', chalk.red, true);
    console.error(chalk.red(`${error.message}`));
    throw error;
  }
}

(async () => {
  await start();
})();