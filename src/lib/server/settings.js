import { readFile, writeFile } from 'fs/promises';
import { env } from '$env/dynamic/private';
import { createLoader } from '$lib/helpers/factory';

const SETTINGS_FILE = `${env.CONFIG_DIR}/subler.json`;

const settings = createLoader({
  load: loadSettings,
  save: saveSettings,
  delay: 2,
});

/** @returns {Promise<import('@cyann/subler').Settings>} */
async function loadSettings() {
  const content = await readFile(SETTINGS_FILE, 'utf8');
  return JSON.parse(content);
}

/** @param {import('@cyann/subler').Settings} value */
async function saveSettings(value) {
  const content = JSON.stringify(value, null, 2);
  await writeFile(SETTINGS_FILE, content);
}

export async function getSettings() {
  return await settings.get();
}

/** @param {import('@cyann/subler').Settings} value  */
export function setSettings(value) {
  settings.set(value);
}
