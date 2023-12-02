import { error, fail, redirect } from '@sveltejs/kit';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { addConvertionTask, getMediaDetails, hasConvertionFile } from '$lib/server/ffmpeg';
import { getTorrent } from '$lib/server/transmission';
import { filterMediaFiles } from '$lib/helpers/ffmpeg';
import { some } from '$lib/helpers/async';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);

  const { mediaFiles, disableConvertion } = await event.parent();
  const convertionWarning = await some(mediaFiles, ({ file }) => hasConvertionFile(file));
  let mediaDetails = undefined;

  if (mediaFiles.length && !disableConvertion) {
    mediaDetails = await getMediaDetails(mediaFiles[0].file).catch((err) => {
      console.log(`SublerError: failed to get media details: ${err}`);
      throw error(404, { message: 'failed to get media details' });
    });
  }

  return {
    streams: mediaDetails?.streams || [],
    convertionWarning,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const mapping = data.getAll('mapping').map((value) => parseInt(value.toString()));

    if (!mapping.length || mapping.some((value) => Number.isNaN(value) || value < 0)) {
      return fail(400, { error: true, message: 'invalid mapping' });
    }

    const id = parseInt(event.params.torrentId);
    const torrent = await getTorrent(id).catch((err) => {
      console.log(`SublerError: failed to get torrent: ${err}`);
    });

    if (!torrent) {
      return fail(400, { error: true, message: 'failed to get torrent' });
    }

    const filteredFiles = filterMediaFiles(torrent.files);
    filteredFiles.forEach((file) => addConvertionTask(file, mapping));
    throw redirect(307, `/torrent/${id}`);
  },
};
