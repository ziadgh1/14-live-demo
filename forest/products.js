const { collection } = require('forest-express-sequelize');
const models = require('../models');

const { Op } = models.Sequelize;

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('products', {
  actions: [],
  fields: [],
  segments: [{
    name: 'Bestsellers',
    where: () => models.sequelize.query(`
        SELECT products.id, COUNT(orders.*)
        FROM products
        JOIN orders ON orders.product_id = products.id
        GROUP BY products.id
        ORDER BY count DESC
        LIMIT 5;
      `, { type: models.sequelize.QueryTypes.SELECT })
      .then((products) => {
        const productIds = products.map((product) => product.id);
        return { id: { [Op.in]: productIds } };
      }),
  }],
});
