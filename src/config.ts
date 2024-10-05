import config from './../config.json';

export const CONFIG: any = {};

for (const [key, value] of Object.entries(config)) {
    CONFIG[key] = value;
}