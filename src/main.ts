import { Logger } from "../.core/logger";
import { CONFIG } from "./config";
import { STATE } from "./state";

export async function main(
  resolve: (value: { message: string }) => Promise<void>,
  reject: (error: Error) => Promise<void>,
): Promise<void> {
  try {
    await Logger.log("hello world from ./src/main.ts!");
    await Logger.log(`config: ${JSON.stringify(CONFIG)}`);
    STATE.PORT = 60002;
    await Logger.log(`state: ${JSON.stringify(STATE)}`);

    await resolve({
      message: "Program Completed",
    });
  } catch (error: any) {
    await Logger.error(error);
    await reject(error);
  }
}
