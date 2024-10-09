import { writeFileSync } from "fs";

writeFileSync('./config.json', JSON.stringify({
    APP_NAME: '',
    ENV: '',
    environmentVariables: [],
    envCheck: true
}, null, 2));
