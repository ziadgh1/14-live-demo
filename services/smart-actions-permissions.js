/* eslint-disable max-len */
const https = require('https');
const permissionsRetriever = require('./permissions-retriever');

// const environmentSecret = `${process.env.FOREST_ENV_SECRET_production}`;
// const renderingId = `${process.env.RENDERING_PRODUCTION_OPERATIONS}`;

// const permissions = permissionsRetriever(environmentSecret, renderingId);

async function smartActionPermissionsTest() {
  const data = JSON.stringify({
    attributes: {
      collection_name: 'companies',
      values: {},
      ids: ['1972'],
      parent_collection_name: null,
      parent_collection_id: null,
      parent_association_name: null,
      all_records: false,
      all_records_subset_query: {
        'fields[companies]': 'industry,status,description,certificateOfIncorporationId,createdAt,bankStatementId,passportId,proofOfAddressId,updatedAt', 'page[number]': 1, 'page[size]': 15, sort: '-id', filters: '{"aggregator":"and","conditions":[{"field":"status","operator":"equal","value":"rejected"},{"field":"headquarter","operator":"contains","value":"United States"}]}', searchExtended: 0, timezone: 'Europe/Berlin',
      },
      all_records_ids_excluded: ['1966', '1963', '1962', '1957', '1956', '1955', '1935', '1933', '1930', '1927', '1926', '1920', '1914', '1908'],
      smart_action_id: 'companies-Cancel@@@rejection',
    },
    type: 'custom-action-requests',
  });

  const options = {
    hostname: 'live-demo-14-production.herokuapp.com',
    port: 3310,
    path: '/forest/actions/cancel-rejection',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1MzAzIiwiZW1haWwiOiJ6aWFkZ0Bmb3Jlc3RhZG1pbi5jb20iLCJmaXJzdE5hbWUiOiJaaWFkIiwibGFzdE5hbWUiOiJHaGFsbGViIiwidGVhbSI6Ik9wZXJhdGlvbnMiLCJyZW5kZXJpbmdJZCI6IjczNzU5IiwiaWF0IjoxNjA0OTMxNjY5LCJleHAiOjE2MDYxNDEyNjl9.wlGFzV2PrHg7XGgfq_KoJhMSede50VwseP_98c5aVL4',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImRhdGEiOnsidHlwZSI6InVzZXJzIiwiaWQiOiIzNTMwMyIsImF0dHJpYnV0ZXMiOnsiZmlyc3RfbmFtZSI6IlppYWQiLCJsYXN0X25hbWUiOiJHaGFsbGViIiwiZW1haWwiOiJ6aWFkZ0Bmb3Jlc3RhZG1pbi5jb20ifX19LCJhdWQiOiJGT1JFU1RfVVNFUlMiLCJpc3MiOiJGT1JFU1RfQVVUSEVOVElDQVRJT05fU1lTVEVNIiwiaWF0IjoxNjA1MDE5NTU5LCJleHAiOjE2MDUxOTIzNTl9.tq_FHwPGUGp8JUfb5LFYA8XJMXAq63K1a-5kIlpZBCQ',
    },
  };

  const request = https.request(options, (response) => {
    console.log(`statusCode: ${response.statusCode}`);

    response.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  request.on('error', (error) => {
    console.error(error);
  });

  request.write(data);
  request.end();
}

smartActionPermissionsTest();
