import { readFileSync, writeFileSync } from 'fs';

const environment = process.argv[2];
const configPath = ('./config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

if (environment && ['development', 'production'].includes(environment)) {
    config.ENV = environment;
}

console.log(`Environment set to ${config.ENV === 'development' ? 'development' : 'production'}.`);
writeFileSync(configPath, JSON.stringify(config, null, 2));