import { error } from '@sveltejs/kit';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { getTorrent } from '$lib/server/transmission';
import { filterMediaFiles } from '$lib/helpers/ffmpeg';
import { getConvertionProgress } from '$lib/server/ffmpeg';
import { getTorrentStatistics } from '$lib/server/statistics';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);
  event.depends('app:torrent');

  const id = parseInt(event.params.torrentId);
  const torrent = await getTorrent(id).catch((err) => {
    console.log(`SublerError: failed to get torrent: ${err}`);
    throw error(404, { message: 'failed to get torrent' });
  });

  const statistics = await getTorrentStatistics(torrent);
  const filteredFiles = filterMediaFiles(torrent.files);
  const mediaFiles = filteredFiles.map((file) => ({ file, ...getConvertionProgress(file) }));
  const disableConvertion = torrent.status !== 'seeding' || !mediaFiles.length;

  return {
    torrent,
    statistics,
    mediaFiles,
    disableConvertion,
  };
}
