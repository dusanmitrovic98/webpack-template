export async function main(): Promise<void> {
  console.log("Hello from main function!");

  Promise.resolve().then(() => {
    console.log('Main program done.');
  });
}