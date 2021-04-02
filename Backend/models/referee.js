const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const League = require('../models/league')

const Referee = sequelize.define('Sudija', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ime: {
        type: DataTypes.STRING
    },
    prezime: {
        type: DataTypes.STRING
    },
    adresa: {
        type: DataTypes.STRING
    },
    broj_telefona: {
        type: DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false,
});

Referee.belongsTo(League, {foreignKey : "najvisa_liga", as: 'liga'});

module.exports = Referee;