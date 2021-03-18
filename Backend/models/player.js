const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const Player = sequelize.define('Igrac', {
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
    datum_rodjenja: {
        type: DataTypes.DATE
    },
    lekarski_pregled_datum: {
        type: DataTypes.DATE
    }
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Player;