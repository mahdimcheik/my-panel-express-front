// Dev proxy to the ASP.NET backend.
//
// The API endpoints (/services, /realisations, /contact, ...) share the same paths
// as the SPA routes. A full-page browser load of e.g. /services must serve the app,
// not the API. `bypass` returns index.html for navigation requests (Accept: text/html)
// so only real API calls (JSON/XHR) are proxied.
const bypass = (req) => {
  if (req.method === 'GET' && (req.headers.accept ?? '').includes('text/html')) {
    return '/index.html';
  }
  return null;
};

const target = 'https://localhost:7113';
const paths = [
  '/auth',
  '/contact',
  '/horaires',
  '/media',
  '/realisations',
  '/services',
  '/parametres',
];

module.exports = paths.reduce((config, path) => {
  config[path] = { target, secure: false, changeOrigin: true, bypass };
  return config;
}, {});
