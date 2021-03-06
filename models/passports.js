// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Passports = sequelize.define('passports', {
    // id: {
    //   type: DataTypes.STRING,
    //   primaryKey: 'true',
    //   autoIncrement: true,
    //   // defaultValue: Sequelize.literal('nextval(passports_id_seq::regclass)'),
    // },
    countryCode: {
      type: DataTypes.STRING,
    },
    identityNumber: {
      type: DataTypes.STRING,
    },
    givenNames: {
      type: DataTypes.STRING,
    },
    surname: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    issuanceDate: {
      type: DataTypes.DATE,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    mrzOne: {
      type: DataTypes.STRING,
    },
    mrzTwo: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'passports',
    underscored: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Passports.associate = (models) => {
    Passports.hasOne(models.customers, {
      foreignKey: {
        name: 'passportIdKey',
        field: 'passport_id',
      },
      as: 'customer',
    });
  };

  return Passports;
};
