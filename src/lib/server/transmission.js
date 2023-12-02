import { createCache } from '$lib/helpers/factory';
import { addSchedulerTask } from './scheduler';
import { getSettings } from './settings';

const TORRENT_FIELDS = [
  'id',
  'name',
  'status',
  'sizeWhenDone',
  'percentDone',
  'uploadRatio',
  'rateDownload',
  'rateUpload',
  'files',
];

const cache = createCache({
  load: loadTorrentList,
  ttl: 2,
});

/** @type {string | undefined} */
let token = undefined;

addSchedulerTask(() => {
  cache.cleanup();
});

/**
 * @param {Record<string, any>} torrent
 * @returns {import('@cyann/subler').Torrent}
 */
function formatTorrent(torrent) {
  let status = 'unknown';
  let progress = torrent.percentDone;
  let speed = torrent.rateDownload;

  if (torrent.status === 0) {
    status = 'paused';
  } else if (torrent.status === 1 || torrent.status === 2) {
    status = 'checking';
  } else if (torrent.status === 3 || torrent.status === 4) {
    status = 'downloading';
  } else if (torrent.status === 5 || torrent.status === 6) {
    status = 'seeding';
    progress = torrent.uploadRatio;
    speed = torrent.rateUpload;
  }

  return {
    id: torrent.id,
    name: torrent.name,
    size: torrent.sizeWhenDone,
    status: status,
    speed: speed,
    progress: Math.ceil(progress * 100),
    files: torrent.files.map((/** @type {Record<string, any>} */ file) => file.name),
  };
}

/**
 * @param {string} body
 * @returns {Promise<Record<string, any>>}
 */
async function sendRequest(body) {
  const settings = await getSettings();
  const headers = token ? { 'X-Transmission-Session-Id': token } : undefined;
  const response = await fetch(settings.transmissionURL, { method: 'POST', headers, body });

  if (response.status === 409) {
    const sessionHeader = response.headers.get('X-Transmission-Session-Id');

    if (!sessionHeader) {
      throw new Error('invalid transmission session');
    }

    token = sessionHeader;
    return sendRequest(body);
  } else {
    const content = await response.json();

    if (content.result !== 'success') {
      throw new Error('invalid transmission response');
    }

    return content.arguments;
  }
}

/** @returns {Promise<Array<import('@cyann/subler').Torrent>>} */
async function loadTorrentList() {
  const body = JSON.stringify({ method: 'torrent-get', arguments: { fields: TORRENT_FIELDS } });
  const response = await sendRequest(body);
  return response.torrents.map((/** @type {Record<String, any>} */ torrent) => formatTorrent(torrent));
}

export async function getTorrentList() {
  return await cache.get();
}

/** @param {number | undefined} id */
export async function getTorrent(id) {
  const torrents = await cache.get();
  const torrent = torrents.find((torrent) => torrent.id === id);

  if (!torrent) {
    throw new Error(`failed to get torrent ${id}`);
  }
  return torrent;
}

/** @param {ArrayBuffer} buffer */
export async function addTorrent(buffer) {
  const metainfo = Buffer.from(buffer).toString('base64');
  const body = JSON.stringify({ method: 'torrent-add', arguments: { metainfo } });
  const response = await sendRequest(body);

  return {
    id: response.id,
    name: response.name,
  };
}

/** @param {number} id  */
export async function deletetorrent(id) {
  const body = JSON.stringify({ method: 'torrent-remove', arguments: { id, 'delete-local-data': true } });
  await sendRequest(body);
  return true;
}
