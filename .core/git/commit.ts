import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import chalk from 'chalk';
import path from 'path';

import { Logger } from '../logger.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

async function commitChanges(): Promise<void> {
    try {
        const packageJsonPath = path.join(projectRoot, 'package.json');
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
        const commitMessage = `v${packageJson.version}`;

        Logger.logSection("Git Commit", chalk.blue);

        Logger.log(chalk.cyan.bold(commitMessage));

        const { stdout: statusOutput } = await execAsync('git status --porcelain', { cwd: projectRoot });
        if (!statusOutput) {
            Logger.log("Nothing to commit.");
            return;
        }

        await execAsync('git add .', { cwd: projectRoot });
        await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
        Logger.log(chalk.green("Changes committed successfully."));
    } catch (error) {
        Logger.error(chalk.red.bold("Git operation failed:", error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
}

commitChanges().catch(error => {
    Logger.error(chalk.red.bold("Error:", error instanceof Error ? error.message : String(error)));
    process.exit(1);
});