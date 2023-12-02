export const HISTORY_LIMIT = 604800 * 1000;

/** @param {import("@cyann/subler").TorrentStatistics} statistics  */
export function getStatisticsActivity(statistics) {
  const first = statistics[0];
  const last = statistics[statistics.length - 1];

  if (first && last) {
    const progress = last.progress - first.progress;
    if (progress) {
      return progress;
    } else if (last.timestamp - first.timestamp >= HISTORY_LIMIT) {
      return 0;
    }
  }
}
