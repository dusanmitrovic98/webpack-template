import { exec } from 'child_process';
import { promisify } from 'util';

import { Logger } from './../logger';

const execAsync = promisify(exec);
const projectRoot = process.cwd();

export async function pushChanges(): Promise<void> {
    try {
        await execAsync('git push', { cwd: projectRoot });
        Logger.log("Changes pushed successfully.");
    } catch (error: any) {
        Logger.error("Failed to push changes:", error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    await pushChanges().catch(error => {
        Logger.error("Error:", error.message);
        process.exit(1);
    });
}