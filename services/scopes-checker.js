const _ = require('lodash');
const getPermissions = require('./permissions-retriever');
const models = require('../models');

// Test if user has a dynamic scope tag (key/value pair)
function hasDynamicScope(userId, collectionPermissions, collectionName) {
  const usersTagValues = collectionPermissions[`${collectionName}`].data.scope.dynamicScopesValues.users;
  const usersWithTags = _.pickBy(usersTagValues, (user) => !_.isEmpty(user));
  const usersList = _.keys(usersWithTags);
  const hasScope = _.includes(usersList, userId);
  return hasScope;
}

// Test if requested record respects dynamic scope filter
function isRecordInDynamicScope(scopeValue, record) {
  let recordInScope = false;
  if (record.headquarter === scopeValue) {
    recordInScope = true;
  }
  return recordInScope;
}

async function isAllowed(request, response) {
  const clientRequest = request;
  let detailsViewAllowed = false;
  const userId = clientRequest.user.id;
  const { renderingId } = clientRequest.user;
  const collectionName = clientRequest.originalUrl.match(/forest\/(.*)\//)[1];
  const { recordId } = clientRequest.params;

  // Get permissions from Forest Admin servers for the requested collection
  const collectionPermissions = await getPermissions(`${process.env.FOREST_ENV_SECRET_PRODUCTION}`, '73759', collectionName);
  const userHasDynamicScope = hasDynamicScope(userId, collectionPermissions, collectionName);

  if (userHasDynamicScope) {
    // Get requested record from database
    const record = await models[`${collectionName}`].findByPk(recordId, { raw: true });

    // Get user dynamic scope value on the (partnerId) tag
    const userScopes = collectionPermissions[`${collectionName}`].data.scope.dynamicScopesValues.users[`${userId}`];
    const userScopeValue = userScopes['$currentUser.tags.companiesHQ'];

    // Return true if user is allowed to view requested record, false otherwise
    detailsViewAllowed = isRecordInDynamicScope(userScopeValue, record);

    if (detailsViewAllowed === false) {
      response.send({ data: {} });
    }
  } else {
    detailsViewAllowed = true;
  }
  return response;
}

module.exports = isAllowed;
