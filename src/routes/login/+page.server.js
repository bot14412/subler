import { createSession, getUser, hasSession } from '$lib/server/authenticate';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  if (hasSession(event)) {
    throw redirect(307, '/');
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const email = data.get('email');

    if (!email || typeof email != 'string') {
      return fail(400, { error: true, message: 'invalid email' });
    }

    const password = data.get('password');
    const user = await getUser(email);

    if (!user || user.password !== password) {
      return fail(400, { error: true, message: 'invalid email or password' });
    }

    await createSession(event, user);
    throw redirect(307, '/torrents');
  },
};
