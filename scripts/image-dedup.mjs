import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const statePath = path.join(root, "data", "downloaded-image-urls.json");

export async function loadDedupState() {
  try {
    const data = await fs.readFile(statePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return {};
    }
    throw err;
  }
}

export async function saveDedupState(state) {
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

export async function isDuplicateUrl(state, url) {
  return !!state[url];
}

export function markDownloaded(state, url, targetPath, imageType) {
  state[url] = { targetPath, imageType, downloadedAt: new Date().toISOString() };
}
