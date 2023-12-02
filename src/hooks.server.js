import { resumeSession } from '$lib/server/authenticate';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  await resumeSession(event);
  return resolve(event);
}
