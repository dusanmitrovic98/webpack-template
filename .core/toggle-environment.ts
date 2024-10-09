import { readFileSync, writeFileSync } from 'fs';
import { Logger } from './logger';

const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
config.ENV = config.ENV === 'development' ? 'production' : 'development';
Logger.log(`Environment set to ${config.ENV === 'development' ? 'development' : 'production'}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
