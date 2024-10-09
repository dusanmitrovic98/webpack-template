import { readFileSync, writeFileSync } from 'fs';
import { Logger } from './logger';

const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
config.envCheck = !config.envCheck;
Logger.log(`Environment check ${config.envCheck ? 'enabled' : 'disabled'}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
