const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class BaseModel {
  static init(attributes, options) {
    return sequelize.define(this.name, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ...attributes
    }, {
      ...options,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  }
}

module.exports = BaseModel; 