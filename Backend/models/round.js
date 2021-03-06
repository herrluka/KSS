const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const League = require("../models/league");

const Round = sequelize.define('Kolo', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        naziv: DataTypes.STRING,
        datum_od:  DataTypes.DATE,
        datum_do:  DataTypes.DATE,
        eliminaciona_faza: DataTypes.BOOLEAN
    },
    {
        freezeTableName: true,
        timestamps: false,
    });

Round.belongsTo(League, {foreignKey: "liga_id", as: 'liga'});

module.exports = Round;