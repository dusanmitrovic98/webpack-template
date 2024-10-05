import readline from 'readline';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import chalk from 'chalk';

export interface Env {
    APP_NAME: string;
    ENV: string;
    [key: string]: string;
}

const requiredVars = ['APP_NAME', 'ENV'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function updateEnvFile(env: Env) {
    let content = '';
    for (const [key, value] of Object.entries(env)) {
        content += `${key}=${value}\n`;
    }
    await fs.writeFile('.env', content);
}

function validateEnv(env: Env): string[] {
    return requiredVars.filter(varName => !env[varName]);
}

export async function setupEnv(): Promise<Env> {
    dotenv.config();
    let env = process.env as unknown as Env;
    let envUpdated = false;
    
    const missingVars = validateEnv(env);
    
    for (const varName of missingVars) {
        if (varName === 'APP_NAME') {
            const appName = await prompt(`Please enter the ${varName}: `);
            if (appName) {
                env[varName] = appName;
                envUpdated = true;
            } else {
                rl.close();
                throw new Error(`${varName} is required`);
            }
        } else if (varName === 'ENV') {
            let isValidEnv = false;
            while (!isValidEnv) {
                const envInput = await prompt(
                  `Please enter the environment ("d" or "development" for development, "p" or "production" for production): `
                );
                
                if (envInput) {
                    const lowercaseInput = envInput.toLowerCase();
                    if (lowercaseInput === 'd' || lowercaseInput === 'development') {
                        env[varName] = 'development';
                        isValidEnv = true;
                    } else if (lowercaseInput === 'p' || lowercaseInput === 'production') {
                        env[varName] = 'production';
                        isValidEnv = true;
                    } else {
                        console.log(chalk.red(`Invalid input "${envInput}".`));
                    }
                } else {
                    console.log("Environment is required. Please enter a valid value.");
                }
            }
            envUpdated = true;
        }
    }
    
    if (envUpdated) {
        await updateEnvFile(env);
        console.log("Updated .env file with new values");
    }
    
    rl.close();
    return env;
}

if (require.main === module) {
  setupEnv().catch(error => {
    console.error("Error:", error.message);
    process.exit(1);
  });
}