import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import fs from 'fs/promises';
import semver from 'semver';
import chalk from 'chalk';
import path from 'path';

import { Logger } from './logger.js';

const execAsync = promisify(exec);

type BumpType = "major" | "minor" | "patch" | "rollback";

interface VersionHistory {
  current: string;
  previous: string[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');
const VERSION_HISTORY_FILE = path.join(projectRoot, 'version-history.json');
const PACKAGE_JSON_PATH = path.join(projectRoot, 'package.json');
const CHANGELOG_PATH = path.join(projectRoot, 'CHANGELOG.md');

const MAX_HISTORY = 5;

async function readJsonFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
}

async function writeJsonFile(filePath: string, content: unknown) {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n');
}

async function getVersionHistory(): Promise<VersionHistory> {
  const history = await readJsonFile(VERSION_HISTORY_FILE);

  if (!history) {
    throw new Error("version-history.json not found");
  }

  return history;
}

async function updateVersionHistory(newVersion: string) {
  const history = await getVersionHistory();
  const updatedHistory: VersionHistory = {
    current: newVersion,
    previous: [history.current, ...history.previous].slice(0, MAX_HISTORY),
  };
  await writeJsonFile(VERSION_HISTORY_FILE, updatedHistory);
}

function parseChangelog(content: string): { unreleased: string; versions: { version: string; date: string; content: string }[] } {
  const lines = content.split('\n');
  let unreleased = '';
  const versions: { version: string; date: string; content: string }[] = [];
  let currentVersion: { version: string; date: string; content: string } | null = null;

  for (const line of lines) {
    if (line.startsWith('## [Unreleased]')) {
      unreleased = '## [Unreleased]\n';
    } else if (line.match(/^## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}/)) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      const [, version, date] = line.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/) || [];
      currentVersion = { version, date, content: line + '\n' };
    } else if (currentVersion && line.trim() !== '') {
      currentVersion.content += line + '\n';
    } else if (unreleased && line.trim() !== '') {
      unreleased += line + '\n';
    }
  }

  if (currentVersion) {
    versions.push(currentVersion);
  }

  return { unreleased, versions };
}

async function updateChangelog(newVersion: string, bumpType: BumpType, changeDescription: string) {
  let changelog = await fs.readFile(CHANGELOG_PATH, 'utf-8').catch(() => "# Changelog\n\n## [Unreleased]\n");

  const { unreleased, versions } = parseChangelog(changelog);

  const today = new Date().toISOString().split('T')[0];
  let newEntry = `## [${newVersion}] - ${today}\n`;

  if (bumpType !== "rollback") {
    newEntry += `### ${bumpType.charAt(0).toUpperCase() + bumpType.slice(1)}\n- ${changeDescription}\n`;
  } else {
    newEntry += `### Rollback\n- ${changeDescription}\n`;
  }

  const updatedChangelog = `# Changelog\n\n## [Unreleased]\n\n${newEntry.trim()}\n\n${versions.map(v => v.content.trim()).join('\n\n')}\n`;

  await fs.writeFile(CHANGELOG_PATH, updatedChangelog);
}

async function gitCommand(args: string[], cwd: string): Promise<void> {
  try {
    await execAsync(`git ${args.join(' ')}`, { cwd });
  } catch (error: any) {
    throw new Error(`Git command failed: git ${args.join(" ")} - ${error.message}`);
  }
}

async function rollbackGitHub(currentVersion: string, previousVersion: string): Promise<void> {
  try {
    const changeDescription = `Rolled back from v${currentVersion} to v${previousVersion}`;
    await updateChangelog(previousVersion, "rollback", changeDescription);
    await gitCommand(["add", "."], projectRoot);
    await gitCommand(["commit", "-m", `\"rollback v${currentVersion} to v${previousVersion}\"`], projectRoot);
    await gitCommand(["push", "origin", "main"], projectRoot);
    console.log("Changes pushed to GitHub successfully");
  } catch (error: any) {
    console.error("Error during GitHub rollback:", error.message);
    throw error;
  }
}

export async function updateVersion(bumpType: BumpType) {
  Logger.logSection("Version Update", chalk.blue);
  const history = await getVersionHistory();
  const currentVersion = history.current;
  let newVersion: string;
  let changeDescription: string;

  if (bumpType === "rollback") {
    if (history.previous.length === 0) {
      throw new Error("No previous version found to rollback to");
    }
    newVersion = history.previous[0];
    changeDescription = `Rolled back from v${currentVersion} to v${newVersion}`;
    const updatedHistory: VersionHistory = {
      current: newVersion,
      previous: history.previous.slice(1),
    };
    await writeJsonFile(VERSION_HISTORY_FILE, updatedHistory);
    const packageJson = await readJsonFile(PACKAGE_JSON_PATH);

    if (packageJson) {
      packageJson.version = newVersion;
      await writeJsonFile(PACKAGE_JSON_PATH, packageJson);
    }

    await rollbackGitHub(currentVersion, newVersion);
    Logger.success(`Rolled back to version ${newVersion}`);
  } else {
    if (!semver.valid(currentVersion)) {
      throw new Error(`Invalid version: ${currentVersion}`);
    }

    newVersion = semver.inc(currentVersion, bumpType) || currentVersion;
    changeDescription = `Updated ${bumpType} version from ${currentVersion} to ${newVersion}`;
    const packageJson = await readJsonFile(PACKAGE_JSON_PATH);

    if (packageJson) {
      packageJson.version = newVersion;
      await writeJsonFile(PACKAGE_JSON_PATH, packageJson);
    }

    await updateVersionHistory(newVersion);
    await updateChangelog(newVersion, bumpType, changeDescription);
    console.log(`Version bumped to ${newVersion}`);
  }
}

const bumpType = process.argv[2] as BumpType;

if (!["major", "minor", "patch", "rollback"].includes(bumpType)) {
  Logger.error("Please specify: major, minor, patch, or rollback");
  process.exit(1);
}

updateVersion(bumpType).catch(error => {
  Logger.error(`Error: ${error.message}`);
  process.exit(1);
});