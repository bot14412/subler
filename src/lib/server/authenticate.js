import { redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { getSettings } from './settings';

const SESSION_VALIDITY = 48 * 3600;

/** @type {Record<string, import('@cyann/subler').Session>} */
const sessions = {};

/** @param {number} [duration] */
function getTimestamp(duration) {
  const now = Math.floor(Date.now() / 1000);
  return now + (duration || 0);
}

function cleanupSessions() {
  const timestamp = getTimestamp();

  for (const id in sessions) {
    const { expire } = sessions[id];
    if (expire <= timestamp) {
      delete sessions[id];
    }
  }
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @param {import('@cyann/subler').User} user
 * @returns {Promise<void>}
 */
export async function createSession(event, user) {
  const id = randomUUID();

  cleanupSessions();
  event.cookies.set('session', id, { path: '/' });
  sessions[id] = { user, expire: getTimestamp(SESSION_VALIDITY) };
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<void>}
 */
export async function deleteSession(event) {
  const { cookies } = event;
  const id = cookies.get('session');

  if (id) {
    delete sessions[id];
    cookies.delete('session', { path: '/' });
  }
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<void>}
 */
export async function resumeSession(event) {
  const id = event.cookies.get('session');
  const session = id && sessions[id];
  const timestamp = getTimestamp();

  if (!session || session.expire <= timestamp) {
    deleteSession(event);
    return;
  }

  session.expire = getTimestamp(SESSION_VALIDITY);
  event.locals.user = {
    email: session.user.email,
  };
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {boolean}
 */
export function hasSession(event) {
  return !!event.locals.user;
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export function ensureAuthenticated(event) {
  if (!event.locals.user) {
    throw redirect(307, '/login');
  }
}

/**
 * @param {string} email
 * @returns {Promise<import('@cyann/subler').User | undefined>}
 */
export async function getUser(email) {
  const settings = await getSettings();
  if (email === settings.email) {
    const { password } = settings;
    return { email, password };
  }
}
