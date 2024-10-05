import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
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

        console.log(chalk.cyan.bold(commitMessage));

        const { stdout: statusOutput } = await execAsync('git status --porcelain', { cwd: projectRoot });
        if (!statusOutput) {
            console.log("Nothing to commit.");
            return;
        }

        await execAsync('git add .', { cwd: projectRoot });
        await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
        console.log(chalk.green("Changes committed successfully."));
    } catch (error) {
        console.error(chalk.red.bold("Git operation failed:", error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
}

// Run the function
commitChanges().catch(error => {
    console.error(chalk.red.bold("Error:", error instanceof Error ? error.message : String(error)));
    process.exit(1);
});