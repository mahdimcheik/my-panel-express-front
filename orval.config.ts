import { defineConfig } from 'orval';

export default defineConfig({
  'my-panel-express': {
    input: {
      // Snapshot of the MyPanelExpress API spec, so codegen works without the API running.
      // Refresh it with `npm run api:fetch` (API must be up on https://localhost:7113).
      target: './openapi/my-panel-express.swagger.json',
    },
    output: {
      client: 'angular',
      mode: 'tags-split',
      target: './src/app/core/api/endpoints/my-panel-express.ts',
      schemas: './src/app/core/api/models',
      // Endpoints are emitted as root-relative paths (/horaires, /auth/login, ...).
      // In dev, proxy.conf.json forwards them to the API; in prod, serve the app
      // behind the same origin as the API or add a base-url interceptor.
      clean: true,
      indexFiles: true,
      prettier: true,
      override: {
        angular: {
          provideIn: 'root',
        },
      },
    },
  },
});
