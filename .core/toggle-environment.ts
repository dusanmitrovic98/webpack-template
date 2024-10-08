import { readFileSync, writeFileSync } from 'fs';

const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
config.ENV = config.ENV === 'development' ? 'production' : 'development';
console.log(`Environment set to ${config.ENV === 'development' ? 'development' : 'production'}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
