// adyOS File System Driver

import * as fs from "fs";

function gethome(username) {
  return (
    username.replace(/[^a-z0-9]/gi, "") +
    btoa(username).replace(/[^a-z0-9]/gi, "")
  ).toLowerCase();
}

function setdefault(username) {
  return "/home/" + gethome(username) + "/";
}

function getdefault(username) {
  return setdefault(username);
}

function rewritepath(path, username) {
  if (typeof path !== "string") {
    throw new Error('Expected "path" to be a string, but got ' + typeof path);
  }

  let newpath = path
    .replace("/home/" + gethome(username), "~")
    .replace("./os/filesystem", "");
  return newpath;
}

async function getsystemname() {
  let file = await fs.promises.readFile("./os/filesystem/users.json");
  let json = await JSON.parse(Buffer.from(file));
  return json.sysname;
}

function fsfix(path) {
  return "./os/filesystem" + (path.charAt(0) == "/" ? "" : "/") + path;
}

function gettimezone() {
  let file = fs.readFileSync("./os/filesystem/users.json");
  let json = JSON.parse(Buffer.from(file));
  return json.timezone;
}

export {
  setdefault,
  rewritepath,
  getsystemname,
  fsfix,
  getdefault,
  gettimezone,
};
