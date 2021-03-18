const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const League = sequelize.define('Liga', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        naziv_lige: DataTypes.STRING,
        rang:  DataTypes.INTEGER
    },
    {
        freezeTableName: true,
        timestamps: false,
    });

module.exports = League;