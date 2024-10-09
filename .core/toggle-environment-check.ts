import { readFileSync, writeFileSync } from 'fs';

const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
config.envCheck = !config.envCheck;
console.log(`Environment check ${config.envCheck ? 'enabled' : 'disabled'}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
