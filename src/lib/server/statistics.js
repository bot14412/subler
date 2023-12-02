import { readFile, writeFile } from 'fs/promises';
import { env } from '$env/dynamic/private';
import { createLoader } from '$lib/helpers/factory';
import { HISTORY_LIMIT } from '$lib/helpers/statistics';
import { addSchedulerTask } from './scheduler';
import { getTorrentList } from './transmission';

const STATISTICS_FILE = `${env.CONFIG_DIR}/subler-stats.json`;

const statistics = createLoader({
  load: loadStatistics,
  save: saveStatistics,
  delay: 2,
});

addSchedulerTask(async () => {
  const torrents = await getTorrentList();
  const previous = await statistics.get();
  const now = Date.now();
  const min = now - HISTORY_LIMIT;

  /** @type {import('@cyann/subler').Statistics} */
  const next = {};

  for (let { name, status, progress } of torrents) {
    if (status === 'seeding') {
      const stats = previous[name] || [];
      const first = stats.findIndex(({ timestamp }) => timestamp > min);
      const last = stats[stats.length - 1];

      if (!last || last.progress !== progress) {
        stats.push({ timestamp: now, progress });
      }

      next[name] = first > 0 ? stats.slice(first - 1) : stats;
    }
  }

  statistics.set(next);
});

/** @returns {Promise<import('@cyann/subler').Statistics>} */
async function loadStatistics() {
  const content = await readFile(STATISTICS_FILE, 'utf8').catch(() => {});
  return content ? JSON.parse(content) : {};
}

/** @param {import('@cyann/subler').Statistics} value */
async function saveStatistics(value) {
  const content = JSON.stringify(value);
  await writeFile(STATISTICS_FILE, content).catch((err) => {
    console.log(`SublerError: failed to write statistics: ${err}`);
  });
}

/** @param {import('@cyann/subler').Torrent} torrent */
export async function getTorrentStatistics(torrent) {
  const value = await statistics.get();
  return value[torrent.name] || [];
}
