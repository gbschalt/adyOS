// adyOS Kernel
import * as delay from "../custom_modules/delay.js";
import * as debug from "../debug.js";
if (!debug.debug) {
  console.clear();
}
console.log("kernel $ loading files");
await delay.wait(Math.random() * 30);
console.log('kernel $ loaded "./index.js"');
await delay.wait(Math.random() * 30);
console.log('kernel $ loaded "./os/kernel.js"');
await delay.wait(Math.random() * 30);
import * as ezout from "./ezout.js";
console.log('kernel $ loaded "./os/ezout.js"');
await delay.wait(Math.random() * 30);
import * as logins from "./filesystem/usr/login.js";
console.log('kernel $ loaded "./os/filesystem/usr/login.js"');
await delay.wait(Math.random() * 30);
import * as acr from "./acr.js";
console.log('kernel $ loaded "./os/acr.js"');
await delay.wait(Math.random() * 30);
console.log('kernel $ loaded "./custom_modules/delay.js"');
await delay.wait(Math.random() * 30);
console.log('kernel $ loaded "./custom_modules/wfi.js"');
await delay.wait(Math.random() * 30);
console.log('kernel $ loaded "./debug.js"');
await delay.wait(Math.random() * 30);
import { read } from "read";
console.log("kernel $ files loaded");
await delay.wait(Math.random() * 30);

console.log("kernel $ starting boot process");
await delay.wait(Math.random() * 30);

console.log("kernel $ loading folder structure");
import * as fs from "fs";
fs.existsSync("./os/filesystem/home") || fs.mkdirSync("./os/filesystem/home");

console.log(`\nWelcome to adyOS ${fs.readFileSync("./os/version", "utf-8")}`);
ezout.info("Now with DEBUG MODE!!!!!!!!!!!!!!!!!!");
ezout.warn("Debug mode enabled, it may look wacky.");
ezout.warn("YOU HAVE BEEN WARNED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

if (debug.debug) {
  console.log();
}

await delay.wait(1000);

function panic(err) {
  let message = [
    `System panicked!`,
    "We found a(n) " + err.name + " due to:",
    "Running adyOS version " + fs.readFileSync("./os/version"),
    "Please add an issue in the project GitHub if you can replicate this panic.",
    "Press enter to shut down...",
  ];
  err.message.split("\n").forEach((i) => {
    message.push(i);
  });
  let longest = message.sort(function (a, b) {
    return b.length - a.length;
  })[0].length;
  const width = process.stdout.columns || 80; // Default to 80 if undefined
  const padding = Math.max(0, Math.floor((width - longest) / 2));
  let spacer = " ".repeat(padding - 4);
  let lines =
    Math.max(0, Math.floor((process.stdout.rows - message.length) / 2)) - 1;

  console.clear();
  for (let i = 0; i < lines; i++) {
    console.log();
  }
  console.log(spacer + "┌" + "─".repeat(longest + 2) + "┐");
  console.log(
    spacer +
      "│ " +
      ezout.colours.bold +
      "System panicked!" +
      ezout.colours.reset +
      " ".repeat(longest - 16) +
      " │"
  );
  console.log(
    spacer +
      "│ We found a(n) " +
      ezout.colours.bold +
      ezout.colours.red +
      err.name +
      ezout.colours.reset +
      " due to:" +
      " ".repeat(longest - ("We found a(n) " + err.name + " due to:").length) +
      " │"
  );
  err.message.split("\n").forEach((i) => {
    console.log(spacer + "│ " + i + " ".repeat(longest - i.length) + " │");
  });
  console.log(
    spacer +
      "│ Running adyOS version " +
      ezout.colours.bold +
      fs.readFileSync("./os/version") +
      ezout.colours.reset +
      " ".repeat(
        longest -
          ("Running adyOS version " + fs.readFileSync("./os/version")).length
      ) +
      " │"
  );
  console.log(
    spacer +
      "│ Please add an issue in the project GitHub if you can replicate this panic." +
      " ".repeat(
        longest -
          "Please add an issue in the project GitHub if you can replicate this panic."
            .length
      ) +
      " │"
  );
  console.log(
    spacer + "│ Press enter to shut down..." + " ".repeat(longest - 27) + " │"
  );
  console.log(spacer + "└" + "─".repeat(longest + 2) + "┘");
  for (let i = 1; i < lines; i++) {
    console.log();
  }
}

async function startup() {
  ezout.info("Loading login screen");
  let usrinfo = await logins.show(); // show login screen
  try {
    let os = await acr.start(usrinfo);
  } catch (err) {
    if (debug.debug) {
      throw err;
    } else {
      panic(err);
      await read({
        prompt: "",
        silent: true,
        replace: "",
      });
      return;
    }
  }
  if (os === 126) {
    await startup();
  }
}

export { startup };
