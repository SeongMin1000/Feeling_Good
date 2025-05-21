const { DataTypes } = require('sequelize');
const db = require('../../config/db');
const Job = require('./job.model');

const Review = db.define('Review', {
  rating:  { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
  userId:  { type: DataTypes.INTEGER, allowNull: false },
  jobId:   { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'reviews',
  timestamps: true,
});

Review.belongsTo(Job, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Job.hasMany(Review, { foreignKey: 'jobId' });

module.exports = Review;