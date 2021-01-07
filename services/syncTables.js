const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://ziadghalleb@localhost:5436/postgres');

const Customers = sequelize.import('../models/customers');
const Passports = sequelize.import('../models/passports');

async function syncTablesWithModels() {
  await Customers.sync({ alter: true });
  await Passports.sync({ alter: true });

  console.log('Tables have been created or updated');
}

syncTablesWithModels();
