import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  mcp: {
    enabled: env.bool('MCP_ENABLED', true),
    connectTimeoutMs: 10000,
    requestTimeoutMs: 120000,
  },
});

export default config;
