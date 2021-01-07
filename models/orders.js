// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Orders = sequelize.define('orders', {
    ref: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: Sequelize.literal('nextval(orders_id_seq::regclass)'),
    },
    shippingStatus: {
      // type: DataTypes.STRING,
      type: DataTypes.ENUM(['Ready for shipping', 'Being processed', 'In transit', 'Shipped']),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    beingProcessedAt: {
      type: DataTypes.DATE,
    },
    readyForShippingAt: {
      type: DataTypes.DATE,
    },
    inTransitAt: {
      type: DataTypes.DATE,
    },
    shippedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'orders',
    underscored: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Orders.associate = (models) => {
    Orders.belongsTo(models.customers, {
      foreignKey: {
        name: 'customerIdKey',
        field: 'customer_id',
      },
      as: 'customer',
    });
    Orders.belongsTo(models.deliveries, {
      foreignKey: {
        name: 'deliveryIdKey',
        field: 'delivery_id',
      },
      as: 'delivery',
    });
    Orders.belongsTo(models.products, {
      foreignKey: {
        name: 'productIdKey',
        field: 'product_id',
      },
      as: 'product',
    });
  };

  return Orders;
};
