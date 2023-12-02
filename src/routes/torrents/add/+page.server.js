import { fail, redirect } from '@sveltejs/kit';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { addTorrent } from '$lib/server/transmission';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    ensureAuthenticated(event);

    const data = await event.request.formData();
    const file = data.get('file');
    const magnet = data.get('magnet');
    let torrent = undefined;

    if (file && file instanceof File && file.size) {
      const buffer = await file.arrayBuffer();
      torrent = await addTorrent(buffer).catch((err) => {
        console.log(`SublerError: failed to add torrent: ${err}`);
      });
    } else if (magnet && typeof magnet === 'string') {
      return fail(400, { error: true, message: 'not yet implemented' });
    }

    if (torrent) {
      throw redirect(307, '/torrents');
    }

    return fail(400, { error: true, message: 'failed to add torrent' });
  },
};
