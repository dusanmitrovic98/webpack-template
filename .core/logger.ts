const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let dotenv: any;

if (!isBrowser) {
    dotenv = await import('dotenv');
}

import chalk from 'chalk';
import { isRunningInBrowser } from '../src/utility/browser';
import { CONFIG } from '../src/config';

export enum LogLevel {
    INFO,
    SUCCESS,
    WARN,
    ERROR,
    NONE
}

export interface LogConfig {
    forceLog: boolean,
    timestamp: boolean
}

export class Logger {
    private static forceLog: boolean = false;

    static async ForceLogOn(){
        this.forceLog = true;
    }

    static async ForceLogOff(){
        this.forceLog = false;
    }

    private static timestamp(): string {
        const now = new Date();
        const hours = `0${now.getHours()}`.slice(-2);
        const minutes = `0${now.getMinutes()}`.slice(-2);
        const seconds = `0${now.getSeconds()}`.slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    static async prompt(question: string): Promise<string> {
        if (isRunningInBrowser) {
            return new Promise(resolve => {
                const answer = window.prompt(question);
                resolve(answer || '');
            });
        } else {
            const readline = await import('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            return new Promise((resolve) => {
                rl.question(question, (answer: string) => {
                    rl.close();
                    resolve(answer);
                });
            });
        }
    }

    private static isDevelopment(): boolean {
        return CONFIG.ENV === 'development';
    }

    private static shouldLog(forceLog: boolean): boolean {
        return this.forceLog || forceLog || this.isDevelopment();
    }

    static async success(message: string, config: Partial<LogConfig> = { forceLog: false, timestamp: false }): Promise<void> {
        if (this.shouldLog(config.forceLog ?? false)) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            this.log(`[${timestamp}]${chalk.green('✔')} ${chalk.green(message)}`);
        }
    }

    static async info(message: string, config: Partial<LogConfig> = { forceLog: false, timestamp: false }): Promise<void> {
        if (this.shouldLog(config.forceLog ?? this.isDevelopment())) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            this.log(`${timestamp}${chalk.blue(message)}`);
        }
    }

    static async warn(message: string, config: Partial<LogConfig> = { forceLog: false, timestamp: false }): Promise<void> {
        if (this.shouldLog(config.forceLog ?? false)) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            this.log(`${timestamp}${chalk.yellow('⚠')} ${chalk.yellow(message)}`);
        }
    }

    static async error(message: string, config: Partial<LogConfig> = { forceLog: false, timestamp: false }): Promise<void> {
        if (this.shouldLog(config.forceLog ?? false)) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            this.log(`${timestamp}${chalk.red('✖')} ${chalk.red(message)}`);
        }
    }

    static async log(message: string, color: any = chalk.white, config: Partial<LogConfig> = { forceLog: false, timestamp: false }): Promise<void> {
        if (this.shouldLog(config.forceLog ?? false)) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            console.log(color(`${timestamp}${message}`));
        }
    }

    static async header(text: string, forceLog: boolean = false) {
        if (this.shouldLog(forceLog)) {
            console.log(chalk.bold(chalk.cyan(`
╔════════════════════════════════════════════════╗
║ ${text.padEnd(46)} ║
╚════════════════════════════════════════════════╝`)));
        }
    }

    static async logSection(title: string, color: any, forceLog: boolean = false) {
        if (this.shouldLog(forceLog)) {
            console.log(color(`\n■ ${title}`));
            console.log(color(`${'─'.repeat(50)}`));
        }
    }

    static async logKeyValue(key: string, value: string, config: Partial<LogConfig> = { forceLog: false, timestamp: false }) {
        if (this.shouldLog(config.forceLog ?? false)) {
            const timestamp = config.timestamp ? `[${this.timestamp()}] ` : '';
            console.log(`${timestamp}${chalk.bold(key.padEnd(15))} : ${value}`);
        }
    }

    static async clear() {
        console.clear();
    }
}