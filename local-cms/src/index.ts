import fs from 'fs';
import path from 'path';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    if (process.env.NODE_ENV === 'development') {
      try {
        const tokenService = strapi.service('admin::api-token');
        if (tokenService) {
          // In Strapi v5 development mode, __dirname is in dist/src/
          const distDir = __dirname;
          const websiteRoot = path.join(distDir, '..', '..', '..');
          const envLocalPath = path.join(websiteRoot, '.env.local');

          let existingTokenValid = false;
          let envContent = '';
          let currentEnvToken = '';

          if (fs.existsSync(envLocalPath)) {
            envContent = fs.readFileSync(envLocalPath, 'utf8');
            const tokenMatch = envContent.match(/^STRAPI_API_TOKEN=(.*)$/m);
            if (tokenMatch && tokenMatch[1].trim()) {
              currentEnvToken = tokenMatch[1].trim();

              try {
                // Hash the token value to check in database
                const hashedToken = tokenService.hash(currentEnvToken);
                const dbToken = await strapi.db.query('admin::api-token').findOne({
                  where: { accessKey: hashedToken },
                });

                if (dbToken) {
                  existingTokenValid = true;
                  strapi.log.info('Existing STRAPI_API_TOKEN in .env.local is valid and registered in local DB.');
                }
              } catch (hashErr) {
                // Ignore error and generate a new token
              }
            }
          }

          if (!existingTokenValid) {
            strapi.log.info('STRAPI_API_TOKEN is missing, invalid, or database was reset. Creating a new Local Development API Token...');

            // Delete old token with same name to avoid duplicates
            const oldToken = await strapi.db.query('admin::api-token').findOne({
              where: { name: 'Local Development Token' },
            });
            if (oldToken) {
              await strapi.db.query('admin::api-token').delete({
                where: { id: oldToken.id },
              });
            }

            // Create new token (using content-api kind implicitly/explicitly via tokenService)
            const localDevToken = await tokenService.create({
              name: 'Local Development Token',
              description: 'Automatically created for local seeding and sync',
              type: 'full-access',
              lifespan: null,
            });

            strapi.log.info('Local Development API Token created successfully!');

            // Write/update .env.local
            if (fs.existsSync(envLocalPath)) {
              const tokenLineRegex = /^STRAPI_API_TOKEN=.*$/m;
              if (tokenLineRegex.test(envContent)) {
                envContent = envContent.replace(tokenLineRegex, `STRAPI_API_TOKEN=${localDevToken.accessKey}`);
              } else {
                envContent += `\nSTRAPI_API_TOKEN=${localDevToken.accessKey}\n`;
              }
              fs.writeFileSync(envLocalPath, envContent, 'utf8');
            } else {
              fs.writeFileSync(envLocalPath, `STRAPI_API_TOKEN=${localDevToken.accessKey}\n`, 'utf8');
            }
            strapi.log.info('Updated STRAPI_API_TOKEN in website root .env.local');
          }
        }
      } catch (err: any) {
        strapi.log.error('Failed to auto-configure Local Development Token: ' + err.stack);
      }
    }
  },
};
