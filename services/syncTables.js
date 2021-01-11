const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Customers = sequelize.import('../models/customers');
const Passports = sequelize.import('../models/passports');

async function syncTablesWithModels() {
  await Customers.sync({ alter: true });
  await Passports.sync({ alter: true });

  console.log('Tables have been created or updated');
}

syncTablesWithModels();
