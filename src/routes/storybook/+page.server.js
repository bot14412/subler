import { ensureAuthenticated } from '$lib/server/authenticate';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  ensureAuthenticated(event);
}
