import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../logger.js';
import chalk from 'chalk';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

export async function pushChanges(): Promise<void> {
    try {
        Logger.logSection("Git Push", chalk.blue);
        await execAsync('git push', { cwd: projectRoot });
        Logger.success("Changes pushed successfully.");
    } catch (error: any) {
        Logger.error(`Failed to push changes: ${error.message}`);
        process.exit(1);
    }
}

pushChanges().catch(error => {
    Logger.error(`Error: ${error.message}`);
    process.exit(1);
});