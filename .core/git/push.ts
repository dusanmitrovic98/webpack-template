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