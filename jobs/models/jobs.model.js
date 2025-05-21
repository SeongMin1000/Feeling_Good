const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const Job = db.define('Job', {
  title:    { type: DataTypes.STRING, allowNull: false },
  company:  { type: DataTypes.STRING, allowNull: false },
  desc:     { type: DataTypes.TEXT },
  createdBy:{ type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'jobs',
  timestamps: true,
});

module.exports = Job;