import { Logger } from "../.core/logger";

export async function main(): Promise<void> {
  Logger.log("Starting main program...");
  Logger.log("hello world!");

  Promise.resolve().then(() => {
    Logger.log('Main program completed.');
  });
}
