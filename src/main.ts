import chalk from "chalk";

import { isRunningInBrowser } from "./utility/browser";
import { Logger } from "../.core/logger";
import { CONFIG } from "./config";
import { STATE } from "./state";

export async function main(
  resolve: (value: { message: string }) => Promise<void>,
  reject: (error: Error) => Promise<void>,
): Promise<void> {
  try {
    await Logger.log(`config: ${JSON.stringify(CONFIG)}`, chalk.white, {
      timestamp: true,
    });
    STATE.PORT = 60002; 
    await Logger.log(`state: ${JSON.stringify(STATE)}`, chalk.white, {
      timestamp: true,
    });

    Logger.ForceLogOn();
    if (isRunningInBrowser) {
      const helloWorldHtmlElement = document.createElement("div");
      helloWorldHtmlElement.textContent = "Hello World!";
      document.body.appendChild(helloWorldHtmlElement);
      await Logger.log("hello browser!", chalk.green, { timestamp: true });
    } else {
      await Logger.log("hello world from ./src/main.ts!", chalk.green, {
        timestamp: true,
      });
    }

    await resolve({
      message: "Program Completed",
    });
  } catch (error: any) {
    await Logger.error(error);
    await reject(error);
  }
}
