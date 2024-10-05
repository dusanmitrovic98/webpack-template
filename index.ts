const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

import { Logger } from "./.core/logger";
import { main } from "./src/main";
import chalk from "chalk";

import { Env, requiredVars, setupEnv } from './.core/env';
import config from "./config.json";

(async () => {
    try {
        Logger.clear();

        let env: Partial<Env> = {};

        if (!isBrowser) {
            env = await setupEnv().catch(error => {
                Logger.error("Error:", error.message);
                process.exit(1);
            });
        } else {
            for (const key of Object.keys(config) as Array<keyof typeof config>) {
                if (!Array.isArray(config[key])) {
                    env[key] = config[key] as any;
                }
            }
        }

        Logger.header(`${env!.APP_NAME!.toUpperCase()} - ${env!.ENV!.toUpperCase()} MODE`, true);

        Logger.logSection("Environment Variables", chalk.yellowBright, true);

        for (const [key, value] of Object.entries(env)) {
            if (requiredVars.includes(key) || key !== 'ENV') {
                Logger.logKeyValue(key, value!, true);
            }
        }

        Logger.logSection("Main Program", chalk.magenta, true);
        const startTime = performance.now();
        await main();
        const endTime = performance.now();

        Logger.logSection("Program Completed", chalk.cyan, true);
        Logger.logKeyValue(
            "Main program execution time",
            `${chalk.green(`${(endTime - startTime).toFixed(2)} ms\n`)}`,
            true
        );
    } catch (error: any) {
        Logger.logSection("Error Occurred", chalk.red, true);
        console.error(chalk.red(`${error.message}`));
        throw error;
    }
})();