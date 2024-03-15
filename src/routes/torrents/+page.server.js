import { error } from '@sveltejs/kit';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { getTorrentList } from '$lib/server/transmission';
import { getTorrentStatistics } from '$lib/server/statistics';
import { map } from '$lib/helpers/async';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);

  const torrents = await getTorrentList().catch((err) => {
    console.log(`SublerError: failed to get torrent list: ${err}`);
    throw error(404, { message: 'failed to get torrent list' });
  });

  const list = await map(torrents, async (torrent) => ({
    statistics: await getTorrentStatistics(torrent),
    torrent,
  }));

  return {
    list,
  };
}
