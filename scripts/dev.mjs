import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const commands = [
  ["server", ["--prefix", "server", "run", "dev"]],
  ["client", ["--prefix", "client", "run", "dev"]],
];

const children = commands.map(([name, args]) => {
  const child = spawn(npm, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code, signal) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown();
    }

    if (signal) {
      console.error(`${name} exited from signal ${signal}`);
      shutdown();
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
