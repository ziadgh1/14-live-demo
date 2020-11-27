// Each environment has a FOREST_ENV_SECRET retrievable from project settings >> environments tab
// Each layout (environment, team) has its own rendering ID

const forestServerRequester = require('../node_modules/forest-express/dist/services/forest-server-requester');

const permissionsPerRendering = {};

async function getPermissions(environmentSecret, renderingId, collectionName) {
  const responseBody = await forestServerRequester.perform('/liana/v2/permissions', environmentSecret, { renderingId });
  permissionsPerRendering[collectionName] = {
    data: responseBody[`${collectionName}`],
  };
  return permissionsPerRendering;
}

module.exports = getPermissions;
