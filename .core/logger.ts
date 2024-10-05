const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let dotenv: any;

if(!isBrowser) {
    dotenv = await import('dotenv');
}

import chalk from 'chalk';

export enum LogLevel {
    INFO,
    SUCCESS,
    WARN,
    ERROR,
    NONE
}

export class Logger {
    private static environment: string = !isBrowser ? process.env.ENV! : 'production';

    private static timestamp(): string {
        const now = new Date();
        const hours = `0${now.getHours()}`.slice(-2);
        const minutes = `0${now.getMinutes()}`.slice(-2);
        const seconds = `0${now.getSeconds()}`.slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }

    static setEnvironment(env: string): void {
        this.environment = env || 'production';
    }

    private static shouldLog(forceLog: boolean): boolean {
        return forceLog || this.environment === 'development';
    }

    static success(message: string, forceLog: boolean = false): void {
        if (this.shouldLog(forceLog)) {
            this.log(`${chalk.green('✔')} ${chalk.green(message)}`);
        }
    }

    static info(message: string, forceLog: boolean = false): void {
        if (this.shouldLog(forceLog)) {
            this.log(`${chalk.blue(message)}`);
        }
    }

    static warn(message: string, forceLog: boolean = false): void {
        if (this.shouldLog(forceLog)) {
            this.log(`${chalk.yellow('⚠')} ${chalk.yellow(message)}`);
        }
    }

    static error(message: string, forceLog: boolean = false): void {
        if (this.shouldLog(forceLog)) {
            this.log(`${chalk.red('✖')} ${chalk.red(message)}`);
        }
    }

    static log(message: string, color: any = chalk.white, isBold: boolean = false): void {
        const formattedMessage = isBold ? chalk.bold(color(message)) : color(message);
        console.log(formattedMessage);
    }

    static header(text: string, forceLog: boolean = false) {
        if (this.shouldLog(forceLog)) {
            console.log(chalk.bold(chalk.cyan(`
╔════════════════════════════════════════════════╗
║ ${text.padEnd(46)} ║
╚════════════════════════════════════════════════╝`)));
        }
    }

    static logSection(title: string, color: any, forceLog: boolean = false) {
        if (this.shouldLog(forceLog)) {
            console.log(color(`\n■ ${title}`));
            console.log(color(`${'─'.repeat(50)}`));
        }
    }

    static logKeyValue(key: string, value: string, forceLog: boolean = false) {
        if (this.shouldLog(forceLog)) {
            console.log(`${chalk.bold(key.padEnd(15))} : ${value}`);
        }
    }

    static clear() {
        console.clear();
    }
}