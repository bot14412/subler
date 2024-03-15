import { resumeSession } from '$lib/server/authenticate';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  await resumeSession(event);
  return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, status }) {
  if (status !== 404) {
    console.log(error);
  }
}
