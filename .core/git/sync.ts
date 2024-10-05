import { exec } from 'child_process';
import { promisify } from 'util';

import { Logger } from './../logger';

const execAsync = promisify(exec);
const projectRoot = process.cwd();

export async function pushToOrigin(): Promise<void> {
    try {
        await execAsync('git push origin main', { cwd: projectRoot });
        Logger.log("Changes pushed to origin/main successfully.");
    } catch (error: any) {
        Logger.error("Failed to push to origin/main:", error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    pushToOrigin().catch(error => {
        Logger.error("Error:", error.message);
        process.exit(1);
    });
}