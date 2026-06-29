const childProcess = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 5173);
const outLog = path.join(root, "vite-dev.log");
const errLog = path.join(root, "vite-dev.err.log");

async function main() {
  const open = await isPortOpen(port);

  if (open) {
    console.log(`Vite is already reachable at http://127.0.0.1:${port}/`);
    return;
  }

  fs.appendFileSync(outLog, `\n--- Starting Vite on port ${port} ---\n`);
  fs.appendFileSync(errLog, "");

  const command = [
    "npm.cmd run dev -- --port",
    String(port),
    ">>",
    JSON.stringify(outLog),
    "2>>",
    JSON.stringify(errLog),
  ].join(" ");

  const child = childProcess.spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", command], {
    cwd: root,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  child.unref();
  console.log(`Started Vite process ${child.pid} at http://127.0.0.1:${port}/`);
}

function isPortOpen(portNumber) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port: portNumber });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => {
      resolve(false);
    });
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
