const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const Player = require("../models/player");
const Club = require("../models/club");

const PlayerPlaysIn = sequelize.define('Igrac_Igra_U_Klubu', {
    datum_angazovanja: DataTypes.DATE,
},{
    freezeTableName: true,
    timestamps: false,
});

PlayerPlaysIn.belongsTo(Player, {foreignKey: "igrac_id", as: 'igrac'});
PlayerPlaysIn.belongsTo(Club, {foreignKey: "klub_id", as: 'klub'});

module.exports = PlayerPlaysIn;