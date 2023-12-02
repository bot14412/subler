import { filterMediaFiles } from '$lib/helpers/ffmpeg';
import { ensureAuthenticated } from '$lib/server/authenticate';
import { getSubtitlePreview } from '$lib/server/ffmpeg';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);

  const { mediaFiles } = await event.parent();
  const streamId = parseInt(event.params.streamId);
  const preview = await getSubtitlePreview(mediaFiles[0].file, streamId);

  return {
    preview,
  };
}
