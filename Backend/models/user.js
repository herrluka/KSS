const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const User = global.sequelize.define('Korisnik', {
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
    korisnicko_ime: {
        type: DataTypes.STRING
    },
    lozinka: {
        type: DataTypes.STRING
    },
    uloga: {
        type: DataTypes.BOOLEAN
    }
    },{
    freezeTableName: true,
    timestamps: false,
});

module.exports = User;