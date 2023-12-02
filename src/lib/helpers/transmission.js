import { getStatisticsActivity } from './statistics';

/** @param {number} value  */
function formatNumber(value) {
  if (value >= 1e9) {
    return Math.ceil(value / 1e8) / 10 + ' GB';
  } else if (value >= 1e6) {
    return Math.ceil(value / 1e5) / 10 + ' MB';
  } else if (value >= 1000) {
    return Math.ceil(value / 100) / 10 + ' kB';
  } else {
    return value + ' B';
  }
}

/**
 * @param {import("@cyann/subler").Torrent} torrent
 * @param {import("@cyann/subler").TorrentStatistics} statistics
 * @returns {Array<{ label: string, value: string }>}
 */
export function getFullTorrentStatus(torrent, statistics) {
  const { status, size, speed } = torrent;
  const activity = getStatisticsActivity(statistics);
  const parts = [];

  let format = status.charAt(0).toUpperCase() + status.substring(1);
  if (status === 'seeding' && activity !== undefined) {
    format += ` (${activity}%)`;
  }

  parts.push({ label: 'Status', value: format });
  parts.push({ label: 'Size', value: formatNumber(size) });
  parts.push({ label: 'Speed', value: formatNumber(speed) + '/s' });
  return parts;
}

/**
 * @param {import("@cyann/subler").Torrent} torrent
 * @param {import('@cyann/subler').TorrentStatistics} statistics
 */
export function getTorrentStatus(torrent, statistics) {
  const parts = getFullTorrentStatus(torrent, statistics);
  return parts.map(({ value }) => value).join(' - ');
}
