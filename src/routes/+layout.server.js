/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
  url.pathname;

  return {
    user: locals.user,
  };
}
