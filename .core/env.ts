import chalk from 'chalk';

import { isRunningInBrowser } from '../src/utility/browser';
import { Logger } from './logger';

let fs: any, dotenv: any, path: any;

if (!isRunningInBrowser) {
    fs = await import('fs/promises');
    dotenv = await import('dotenv');
    path = await import('path');
}

interface Config {
    APP_NAME: string;
    ENV: string;
    environmentVariables: string[];
    envCheck: boolean;
    [key: string]: any;
}

export interface Env {
    APP_NAME: string;
    ENV: string;
    [key: string]: string;
}

export const requiredVars = ['APP_NAME', 'ENV'];

async function prompt(question: string): Promise<string> {
    if (isRunningInBrowser) {
        return new Promise(resolve => {
            const answer = window.prompt(question);
            resolve(answer || '');
        });
    } else {
        const readline = await import('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question(question, (answer: string) => {
                rl.close();
                resolve(answer);
            });
        });
    }
}

async function readJsonFile(filePath: string): Promise<any> {
    if (isRunningInBrowser) {
        return null;
    }

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

async function writeJsonFile(filePath: string, content: any): Promise<void> {
    if (isRunningInBrowser) {
        return;
    }

    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}

async function updateEnvFile(env: Partial<Env>, filename: string, varsToWrite: string[]) {
    if (isRunningInBrowser) {
        return;
    }

    let content = '';

    for (const key of varsToWrite) {
        if (env[key] !== undefined) {
            content += `${key}=${env[key]}\n`;
        }
    }

    await fs.writeFile(filename, content);
}

async function setupConfig(): Promise<Config> {
    let config: Config;

    if (isRunningInBrowser) {
        config = {
            APP_NAME: '',
            ENV: '',
            environmentVariables: [],
            envCheck: true
        };
    } else {
        const configPath = path.join(process.cwd(), 'config.json');
        config = await readJsonFile(configPath) || {
            APP_NAME: '',
            ENV: '',
            environmentVariables: [],
            envCheck: true
        };
    }

    if (!config.APP_NAME) {
        config.APP_NAME = await prompt('Please enter the APP_NAME: ');
    }

    if (!config.ENV) {
        let isValidEnv = false;

        while (!isValidEnv) {
            const envInput = await prompt(
                'Please enter the environment ("d" or "development" for development, "p" or "production" for production): '
            );
            const lowercaseInput = envInput.toLowerCase();

            if (lowercaseInput === 'd' || lowercaseInput === 'development') {
                config.ENV = 'development';
                isValidEnv = true;
            } else if (lowercaseInput === 'p' || lowercaseInput === 'production') {
                config.ENV = 'production';
                isValidEnv = true;
            } else {
                Logger.log(chalk.red(`Invalid input "${envInput}".`));
            }
        }
    }

    if (!isRunningInBrowser) {
        const configPath = path.join(process.cwd(), 'config.json');
        await writeJsonFile(configPath, config);
        Logger.log(chalk.green('Updated config.json with new values'));
    }

    return config;
}

async function manageEnvironmentVariables(config: Config, env: Partial<Env>): Promise<Partial<Env>> {
    Logger.log(chalk.cyan('Environment Check Enabled'));
    let managing = true;

    while (managing) {
        Logger.log(chalk.cyan('\nCurrent environment variables:'));

        if (config.environmentVariables.length === 0) {
            Logger.log(chalk.yellow('No environment variables found.'));
        }

        config.environmentVariables.forEach((varName, index) => {
            Logger.log(chalk.cyan(`${index + 1}. ${varName}: ${env[varName] || 'Not set'}`));
        });

        const action = await prompt(`\nDo you want to\n
(a)dd an environment variable, 
(c)lear all environment variables,
(r)emove an environment variable, 
(d)isable environment checks (to enable "envCheck": true),
(f)inish managing environment variables?\n\nInput action: `);

        switch (action.toLowerCase()) {
            case 'a':
                const newVarName = await prompt('Enter new variable name: ');
                if (newVarName && !config.environmentVariables.includes(newVarName)) {
                    config.environmentVariables.push(newVarName);
                    const newVarValue = await prompt(`Enter value for ${newVarName}: `);
                    env[newVarName] = newVarValue;
                    Logger.log(chalk.green(`Added ${newVarName}`));
                }
                break;
            case 'c':
                config.environmentVariables = [];
                env = { APP_NAME: config.APP_NAME, ENV: config.ENV };
                Logger.log(chalk.yellow('All environment variables cleared.'));
                break;
            case 'r':
                const removeIndex = parseInt(await prompt('Enter the number of the variable to remove: ')) - 1;
                if (removeIndex >= 0 && removeIndex < config.environmentVariables.length) {
                    const removedVar = config.environmentVariables.splice(removeIndex, 1)[0];
                    delete env[removedVar];
                    Logger.log(chalk.yellow(`Removed ${removedVar}`));
                }
                break;
            case 'd':
                config.envCheck = false;
                Logger.log(chalk.cyan(`Environment check ${config.envCheck ? 'enabled' : 'disabled'}`));
                break;
            case 'f':
                managing = false;
                break;
            default:
                Logger.log(chalk.red('Invalid option. Please try again.'));
        }

        await saveEnvironmentChanges(config, env);
    }

    return env;
}

async function saveEnvironmentChanges(config: Config, env: Partial<Env>): Promise<void> {
    if (isRunningInBrowser) {
        return;
    }

    const configPath = path.join(process.cwd(), 'config.json');
    await writeJsonFile(configPath, config);

    if (config.ENV === 'development') {
        const envFile = '.env';
        await updateEnvFile(env, envFile, config.environmentVariables);
        Logger.log(chalk.green(`Updated ${envFile} file with new values`));
    } else {
        Logger.log(chalk.yellow('Production environment uses system variables. Current values:'));
        config.environmentVariables.forEach(varName => {
            if (env[varName] !== undefined) {
                Logger.log(chalk.yellow(`${varName}=${env[varName]}`));
            } else {
                Logger.log(chalk.red(`${varName} is not set`));
            }
        });
    }
}

export async function setupEnv(): Promise<Env> {
    Logger.clear();
    const config = await setupConfig();
    let env: Partial<Env> = { APP_NAME: config.APP_NAME, ENV: config.ENV };
    
    if (!isRunningInBrowser) {
        const envFile = config.ENV === 'development' ? '.env' : '.env.production';

        if (config.ENV === 'development') {
            dotenv.config({ path: envFile });
        }

        for (const varName of config.environmentVariables) {
            if (process.env[varName] !== undefined) {
                env[varName] = process.env[varName]!;
            }
        }
    }

    if (config.envCheck) {
        env = await manageEnvironmentVariables(config, env);
    }

    for (const varName of config.environmentVariables) {
        if (env[varName] === undefined) {
            const value = await prompt(`Please enter the value for ${varName}: `);
            if (value) {
                env[varName] = value;
            }
        }
    }

    if (!isRunningInBrowser) {
        await saveEnvironmentChanges(config, env);
    }

    for (const requiredVar of requiredVars) {
        if (env[requiredVar] === undefined) {
            throw new Error(`Required environment variable ${requiredVar} is missing`);
        }
    }

    return env as Env;
}