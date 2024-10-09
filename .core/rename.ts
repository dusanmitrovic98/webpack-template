import { readFileSync, writeFileSync } from 'fs';
import { Logger } from './logger';

const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const readline = await import('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const newAppName = await new Promise<string>((resolve) => {
    rl.question(`Enter new name for ${config.APP_NAME}: `, (input: any) => {
        rl.close();
        resolve(input);
    });
});
config.APP_NAME = newAppName;
Logger.log(`New app name set to ${config.APP_NAME}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
