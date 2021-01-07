// works for NODE > v10
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function parsePassport() {
  const data = new FormData();
  data.append('file', fs.createReadStream(path.join(__dirname, '/passportExample.png')));
  const config = {
    method: 'POST',
    url: 'https://api.mindee.net/products/passport/v1/predict',
    headers: {
      'X-Inferuser-Token': process.env.MINDEE_SECRET_KEY,
      ...data.getHeaders(),
    },
    data,
  };

  try {
    const result = await axios(config);
    console.log('SUCCESS', result.data.predictions[0]);
    const predictions = result.data.predictions[0];
    return predictions;
  } catch (error) {
    console.log('ERROR', error);
  }
}

// parsePassport();

module.exports = parsePassport;
