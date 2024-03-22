import { deleteSession, ensureAuthenticated } from '$lib/server/authenticate';
import { getSettings, setSettings } from '$lib/server/settings';
import { error, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);

  const settings = await getSettings().catch((err) => {
    console.log(`SublerError: failed to get settings: ${err}`);
    throw error(404, { message: 'failed to get settings' });
  });

  return {
    settings,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  save: async (event) => {
    ensureAuthenticated(event);

    const data = await event.request.formData();
    const convertFolder = data.get('convertFolder');
    const quicktime = data.get('quicktime') === 'on';

    if (typeof convertFolder !== 'string' || !convertFolder) {
      return fail(400, { error: true, message: 'Invalid params' });
    }

    const settings = await getSettings();
    settings.convertFolder = convertFolder;
    settings.quicktime = quicktime;
    setSettings(settings);
    throw redirect(307, '/torrents');
  },
  logout: async (event) => {
    deleteSession(event);
    throw redirect(307, '/');
  },
};
