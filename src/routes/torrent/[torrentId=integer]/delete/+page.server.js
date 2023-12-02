import { fail, redirect } from '@sveltejs/kit';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { deletetorrent } from '$lib/server/transmission';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    ensureAuthenticated(event);

    const id = parseInt(event.params.torrentId);
    const success = await deletetorrent(id).catch((err) => {
      console.log(`SublerError: failed to delete torrent: ${err}`);
    });

    if (!success) {
      return fail(400, { error: true, message: 'failed to remove torrent' });
    }

    throw redirect(307, '/torrents');
  },
};
