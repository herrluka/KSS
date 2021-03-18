const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const Club = sequelize.define('Klub', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    naziv_kluba: {
        type: DataTypes.STRING
    },
    godina_osnivanja: {
        type: DataTypes.INTEGER
    },
    adresa_kluba: {
        type: DataTypes.STRING
    },
    broj_telefona: {
        type: DataTypes.STRING
    }
    },{
        freezeTableName: true,
    timestamps: false,
});

module.exports = Club;